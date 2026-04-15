import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, X, Bot, Globe, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string | null;
  image_url: string | null;
  display_name: string | null;
  message_type: string;
  created_at: string;
}

type ChatTab = "global" | "group" | "ai";

interface ChatPanelProps {
  selectedGroupId: string | null;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const ChatPanel = ({ selectedGroupId }: ChatPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<ChatTab>("global");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch messages
  useEffect(() => {
    if (tab === "ai") return;
    const fetchMessages = async () => {
      let query = supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(100);
      if (tab === "global") {
        query = query.is("group_id", null);
      } else if (tab === "group" && selectedGroupId) {
        query = query.eq("group_id", selectedGroupId);
      } else {
        setMessages([]);
        return;
      }
      const { data } = await query;
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();
  }, [tab, selectedGroupId]);

  // Realtime subscription
  useEffect(() => {
    if (tab === "ai") return;
    const channel = supabase
      .channel(`chat-${tab}-${selectedGroupId || "global"}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        const newMsg = payload.new as Record<string, unknown>;
        const groupId = newMsg.group_id as string | null;
        if (tab === "global" && groupId === null) {
          setMessages((prev) => [...prev, newMsg as unknown as ChatMessage]);
        } else if (tab === "group" && groupId === selectedGroupId) {
          setMessages((prev) => [...prev, newMsg as unknown as ChatMessage]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tab, selectedGroupId]);

  useEffect(scrollToBottom, [messages, aiMessages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    const displayName = user.user_metadata?.full_name || user.email || "User";

    if (tab === "ai") {
      const userMsg = { role: "user" as const, content: input };
      const newAiMsgs = [...aiMessages, userMsg];
      setAiMessages(newAiMsgs);
      setInput("");
      setAiLoading(true);

      let assistantSoFar = "";
      try {
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newAiMsgs }),
        });

        if (!resp.ok || !resp.body) {
          toast({ title: "AI Error", description: "Could not reach AI. Try again.", variant: "destructive" });
          setAiLoading(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantSoFar += content;
                setAiMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                  }
                  return [...prev, { role: "assistant", content: assistantSoFar }];
                });
              }
            } catch { /* partial JSON */ }
          }
        }
      } catch {
        toast({ title: "Error", description: "Failed to connect to AI.", variant: "destructive" });
      }
      setAiLoading(false);
      return;
    }

    // Regular chat message
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      group_id: tab === "group" ? selectedGroupId : null,
      message: input.trim(),
      display_name: displayName,
      message_type: "text",
    });
    setInput("");
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("chat-photos").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("chat-photos").getPublicUrl(path);
    const displayName = user.user_metadata?.full_name || user.email || "User";
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      group_id: tab === "group" ? selectedGroupId : null,
      image_url: urlData.publicUrl,
      display_name: displayName,
      message_type: "image",
    });
    setUploading(false);
  };

  const tabs: { id: ChatTab; label: string; icon: React.ReactNode }[] = [
    { id: "global", label: "Global", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "group", label: "Group", icon: <MessageCircle className="w-3.5 h-3.5" /> },
    { id: "ai", label: "AI", icon: <Bot className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-[500px] rounded-xl bg-card border border-border overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
              tab === t.id ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tab === "ai" ? (
          aiMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">Chat with DareUp AI</p>
              <p className="text-xs">Your productivity companion</p>
            </div>
          ) : (
            aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )
        ) : tab === "group" && !selectedGroupId ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Select a group to chat</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Globe className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.user_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${msg.user_id === user?.id ? "" : ""}`}>
                {msg.user_id !== user?.id && (
                  <p className="text-[10px] text-muted-foreground mb-0.5 px-1">{msg.display_name || "User"}</p>
                )}
                <div className={`rounded-lg px-3 py-2 text-sm ${
                  msg.user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.message_type === "image" && msg.image_url ? (
                    <img src={msg.image_url} alt="shared" className="rounded max-w-full max-h-48 object-cover" />
                  ) : (
                    msg.message
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg px-3 py-2 text-sm text-muted-foreground animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-2 flex items-center gap-2">
        {tab !== "ai" && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || (tab === "group" && !selectedGroupId)}
            >
              <Image className="w-4 h-4" />
            </Button>
          </>
        )}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={tab === "ai" ? "Ask DareUp AI..." : "Type a message..."}
          className="flex-1 h-8 text-sm"
          disabled={tab === "group" && !selectedGroupId}
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={sendMessage}
          disabled={!input.trim() || (tab === "group" && !selectedGroupId)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
