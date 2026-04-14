import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, LogIn, Copy, Crown, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
}

interface GroupsSidebarProps {
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

const GroupsSidebar = ({ selectedGroupId, onSelectGroup }: GroupsSidebarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("group_members")
      .select("group_id, groups(id, name, description, invite_code, created_by)")
      .eq("user_id", user.id);

    if (data) {
      const mapped = data
        .map((gm: any) => gm.groups)
        .filter(Boolean) as Group[];
      setGroups(mapped);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !groupName.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("groups")
      .insert({ name: groupName.trim(), description: groupDesc.trim() || null, created_by: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    await supabase
      .from("group_members")
      .insert({ group_id: data.id, user_id: user.id, role: "admin" });

    setGroupName("");
    setGroupDesc("");
    setShowCreate(false);
    setLoading(false);
    fetchGroups();
    onSelectGroup(data.id);
    toast({ title: "Group created!", description: `Share code: ${data.invite_code}` });
  };

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;
    setLoading(true);

    const { data: group, error: findErr } = await supabase
      .from("groups")
      .select("id, name")
      .eq("invite_code", inviteCode.trim())
      .maybeSingle();

    if (findErr || !group) {
      toast({ title: "Not found", description: "Invalid invite code.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("group_members")
      .insert({ group_id: group.id, user_id: user.id });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already a member", description: "You're already in this group." });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      setLoading(false);
      return;
    }

    setInviteCode("");
    setShowJoin(false);
    setLoading(false);
    fetchGroups();
    onSelectGroup(group.id);
    toast({ title: "Joined!", description: `Welcome to ${group.name}` });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Invite code copied to clipboard." });
  };

  return (
    <>
      <div className="w-64 shrink-0 bg-card border-r border-border h-full overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Groups</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowCreate(true)}>
              <Plus className="w-3 h-3 mr-1" /> Create
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setShowJoin(true)}>
              <LogIn className="w-3 h-3 mr-1" /> Join
            </Button>
          </div>
        </div>

        <div className="p-2 space-y-1">
          <button
            onClick={() => onSelectGroup(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all",
              selectedGroupId === null
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "hover:bg-muted/50 text-muted-foreground"
            )}
          >
            <Target className="w-4 h-4" />
            <span className="font-medium">My Tasks</span>
          </button>

          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-left text-sm transition-all group",
                selectedGroupId === group.id
                  ? "bg-primary/10 border border-primary/30 text-primary"
                  : "hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Users className="w-4 h-4 shrink-0" />
                <span className="font-medium truncate">{group.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {group.created_by === user?.id && (
                  <Crown className="w-3 h-3 text-primary" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyInviteCode(group.invite_code);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-primary"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </button>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No groups yet</p>
              <p>Create or join one!</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Create Group</DialogTitle>
            <DialogDescription>Create a new accountability group and invite friends.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createGroup} className="space-y-4">
            <Input placeholder="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="bg-muted border-border" required />
            <Input placeholder="Description (optional)" value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} className="bg-muted border-border" />
            <Button variant="hero" type="submit" className="w-full" disabled={loading}>Create Group</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showJoin} onOpenChange={setShowJoin}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Join Group</DialogTitle>
            <DialogDescription>Enter the invite code shared by a group member.</DialogDescription>
          </DialogHeader>
          <form onSubmit={joinGroup} className="space-y-4">
            <Input placeholder="Enter invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="bg-muted border-border" required />
            <Button variant="hero" type="submit" className="w-full" disabled={loading}>Join Group</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupsSidebar;
