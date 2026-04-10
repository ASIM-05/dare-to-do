import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, Flame, Trophy, Target, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskItem from "@/components/TaskItem";
import DareCard from "@/components/DareCard";
import StatsCard from "@/components/StatsCard";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import AddTaskDialog from "@/components/AddTaskDialog";

export interface Task {
  id: string;
  title: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Study 2 hours for exam", status: "pending", createdAt: new Date() },
  { id: "2", title: "Workout - Push day", status: "completed", createdAt: new Date() },
  { id: "3", title: "Read 30 pages", status: "pending", createdAt: new Date() },
  { id: "4", title: "Meditate 15 min", status: "failed", createdAt: new Date() },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeDare, setActiveDare] = useState<string | null>(null);

  const points = tasks.filter((t) => t.status === "completed").length * 10;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const failed = tasks.filter((t) => t.status === "failed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  const completeTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t)));
  };

  const failTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "failed" as const } : t)));
    setActiveDare(id);
  };

  const addTask = (title: string) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title, status: "pending", createdAt: new Date() },
    ]);
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Bar */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold tracking-wider">
                DARE<span className="text-primary">UP</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="w-5 h-5" />
              <span className="font-display font-bold">{points} pts</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Flame className="w-5 h-5" />
              <span className="font-display font-bold">3 day streak</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Trophy} label="Points" value={points} color="primary" />
          <StatsCard icon={Check} label="Completed" value={completed} color="success" />
          <StatsCard icon={X} label="Failed" value={failed} color="destructive" />
          <StatsCard icon={Target} label="Pending" value={pending} color="muted" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">Today's Tasks</h2>
              <Button variant="hero" size="sm" onClick={() => setShowAddTask(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onFail={failTask}
                  onDelete={deleteTask}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks yet. Add your first task!</p>
                </div>
              )}
            </div>

            {/* Active Dare */}
            {activeDare && (
              <DareCard
                onComplete={() => setActiveDare(null)}
                onDismiss={() => setActiveDare(null)}
              />
            )}
          </div>

          {/* Leaderboard */}
          <LeaderboardPanel />
        </div>
      </main>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} onAdd={addTask} />
    </div>
  );
};

export default Dashboard;
