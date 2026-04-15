import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, Flame, Trophy, Target, Zap, LogOut, Medal, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskItem from "@/components/TaskItem";
import DareCard from "@/components/DareCard";
import StatsCard from "@/components/StatsCard";
import AddTaskDialog from "@/components/AddTaskDialog";
import GroupsSidebar from "@/components/GroupsSidebar";
import DarePickerDialog from "@/components/DarePickerDialog";
import UserProfileDialog from "@/components/UserProfileDialog";
import CompletionShareDialog from "@/components/CompletionShareDialog";
import ChatPanel from "@/components/ChatPanel";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import animeThumbsup from "@/assets/anime-thumbsup.png";
import animeThinking from "@/assets/anime-thinking.png";
import animeCelebrate from "@/assets/anime-celebrate.png";

export interface Task {
  id: string;
  title: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  total_points: number;
  current_streak: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeDare, setActiveDare] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showDarePicker, setShowDarePicker] = useState(false);
  const [failedTaskId, setFailedTaskId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<{ total_points: number; current_streak: number } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showCompletionShare, setShowCompletionShare] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("due_date", new Date().toISOString().split("T")[0])
        .order("created_at", { ascending: false });

      if (data) {
        setTasks(data.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status as "pending" | "completed" | "failed",
          createdAt: new Date(t.created_at),
        })));
      }
    };
    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("total_points, current_streak")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("user_id, display_name, total_points, current_streak")
      .order("total_points", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setLeaderboard(data);
      });
  }, []);

  const completeTask = async (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t)));
    await supabase.from("tasks").update({ status: "completed" }).eq("id", id);
    if (profile) {
      const newPoints = profile.total_points + 10;
      await supabase.from("profiles").update({ total_points: newPoints }).eq("user_id", user!.id);
      setProfile({ ...profile, total_points: newPoints });
    }
    // Show completion share dialog
    setShowCompletionShare(true);
  };

  const failTask = async (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "failed" as const } : t)));
    await supabase.from("tasks").update({ status: "failed" }).eq("id", id);

    if (selectedGroupId) {
      setFailedTaskId(id);
      setShowDarePicker(true);
    } else {
      setActiveDare(id);
    }
  };

  const addTask = async (title: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({ user_id: user.id, title, group_id: selectedGroupId })
      .select()
      .single();

    if (data) {
      setTasks((prev) => [
        { id: data.id, title: data.title, status: "pending", createdAt: new Date(data.created_at) },
        ...prev,
      ]);
    }
    setShowAddTask(false);
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  };

  const handleDareComplete = async () => {
    if (profile) {
      const newPoints = profile.total_points + 5;
      await supabase.from("profiles").update({ total_points: newPoints }).eq("user_id", user!.id);
      setProfile({ ...profile, total_points: newPoints });
    }
    setActiveDare(null);
  };

  const points = profile?.total_points ?? 0;
  const streak = profile?.current_streak ?? 0;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const displayName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <div className="min-h-screen bg-background bg-grid relative flex">
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <GroupsSidebar selectedGroupId={selectedGroupId} onSelectGroup={setSelectedGroupId} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold tracking-wider">
                DARE<span className="text-primary">UP</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="font-display font-bold">{points} pts</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Flame className="w-5 h-5" />
                <span className="font-display font-bold">{streak} day streak</span>
              </div>

              <div className="hidden md:flex items-center gap-1 border-l border-border pl-4">
                <Medal className="w-4 h-4 text-yellow-400" />
                <div className="flex items-center gap-2">
                  {leaderboard.slice(0, 3).map((entry, i) => (
                    <button
                      key={entry.user_id}
                      onClick={() => setSelectedUser(entry.display_name)}
                      className="flex items-center gap-1 text-xs hover:text-primary transition-colors"
                    >
                      <span className="font-bold text-muted-foreground">#{i + 1}</span>
                      <span className="text-foreground truncate max-w-[60px]">
                        {entry.user_id === user?.id ? "You" : (entry.display_name || "User")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <img src={animeThumbsup} alt="" width={60} height={60} className="absolute -top-8 -right-2 animate-bounce-slow pointer-events-none hidden md:block" loading="lazy" />
            <StatsCard icon={Trophy} label="Points" value={points} color="primary" />
            <StatsCard icon={Check} label="Completed" value={completed} color="success" />
            <StatsCard icon={X} label="Failed" value={failed} color="destructive" />
            <StatsCard icon={Target} label="Pending" value={pending} color="muted" />
          </div>

          <div className="rounded-xl bg-card border border-border p-4 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Leaderboard</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {leaderboard.map((entry, i) => (
                <button
                  key={entry.user_id}
                  onClick={() => setSelectedUser(entry.display_name)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/30 transition-all text-sm"
                >
                  <span className={
                    i === 0 ? "text-yellow-400 font-bold" :
                    i === 1 ? "text-gray-300 font-bold" :
                    i === 2 ? "text-amber-600 font-bold" :
                    "text-muted-foreground"
                  }>
                    #{i + 1}
                  </span>
                  <span className={entry.user_id === user?.id ? "text-primary font-medium" : "text-foreground"}>
                    {entry.user_id === user?.id ? "You" : (entry.display_name || "User")}
                  </span>
                  <span className="text-muted-foreground text-xs">{entry.total_points} pts</span>
                </button>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet. Be the first!</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">Today's Tasks</h2>
              <div className="flex items-center gap-2">
                <Button variant="dare" size="sm" onClick={() => setShowDarePicker(true)}>
                  <Zap className="w-4 h-4 mr-1" /> Generate Dare
                </Button>
                <Button variant="hero" size="sm" onClick={() => setShowAddTask(true)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Task
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onComplete={completeTask} onFail={failTask} onDelete={deleteTask} />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-16 text-muted-foreground animate-fade-in">
                  <img src={animeThinking} alt="Thinking" width={120} height={120} className="mx-auto mb-4 animate-float" loading="lazy" />
                  <p className="text-lg font-medium">No tasks yet!</p>
                  <p className="text-sm">Add your first task and let's get going! 💪</p>
                </div>
              )}
            </div>

            {activeDare && (
              <DareCard onComplete={handleDareComplete} onDismiss={() => setActiveDare(null)} />
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Chat</h2>
            <ChatPanel selectedGroupId={selectedGroupId} />
          </div>
        </main>
      </div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} onAdd={addTask} />
      <DarePickerDialog
        open={showDarePicker}
        onOpenChange={setShowDarePicker}
        onSelectDare={(dare) => {
          toast({ title: "Dare assigned! ⚡", description: dare.description });
          setShowDarePicker(false);
        }}
      />
      <UserProfileDialog
        userName={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
      <CompletionShareDialog
        open={showCompletionShare}
        onOpenChange={setShowCompletionShare}
        completed={completed}
        total={tasks.length}
        streak={streak}
        points={points}
        userName={displayName}
      />
    </div>
  );
};

export default Dashboard;
