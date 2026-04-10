import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Check, X, Calendar, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayHistory {
  date: string;
  tasks: { title: string; status: "completed" | "failed" }[];
}

interface UserProfile {
  name: string;
  points: number;
  streak: number;
  longestStreak: number;
  totalCompleted: number;
  totalFailed: number;
  history: DayHistory[];
}

const MOCK_PROFILES: Record<string, UserProfile> = {
  Alex: {
    name: "Alex",
    points: 450,
    streak: 12,
    longestStreak: 18,
    totalCompleted: 87,
    totalFailed: 9,
    history: [
      { date: "Apr 10", tasks: [{ title: "Workout", status: "completed" }, { title: "Read 30 pages", status: "completed" }, { title: "Meditate", status: "completed" }] },
      { date: "Apr 9", tasks: [{ title: "Workout", status: "completed" }, { title: "Study 2hrs", status: "completed" }] },
      { date: "Apr 8", tasks: [{ title: "Workout", status: "completed" }, { title: "Read 30 pages", status: "failed" }, { title: "Cold shower", status: "completed" }] },
      { date: "Apr 7", tasks: [{ title: "Study 3hrs", status: "completed" }, { title: "Meditate", status: "completed" }] },
      { date: "Apr 6", tasks: [{ title: "Workout", status: "completed" }, { title: "Journal", status: "completed" }, { title: "No sugar", status: "failed" }] },
    ],
  },
  Jordan: {
    name: "Jordan",
    points: 380,
    streak: 7,
    longestStreak: 14,
    totalCompleted: 62,
    totalFailed: 15,
    history: [
      { date: "Apr 10", tasks: [{ title: "Run 5km", status: "completed" }, { title: "Code 2hrs", status: "completed" }] },
      { date: "Apr 9", tasks: [{ title: "Run 5km", status: "failed" }, { title: "Code 2hrs", status: "completed" }] },
      { date: "Apr 8", tasks: [{ title: "Run 5km", status: "completed" }, { title: "Read", status: "completed" }] },
      { date: "Apr 7", tasks: [{ title: "Gym", status: "completed" }, { title: "Code 2hrs", status: "completed" }] },
    ],
  },
  Sam: {
    name: "Sam",
    points: 320,
    streak: 5,
    longestStreak: 10,
    totalCompleted: 48,
    totalFailed: 12,
    history: [
      { date: "Apr 10", tasks: [{ title: "Yoga", status: "completed" }, { title: "Study", status: "completed" }] },
      { date: "Apr 9", tasks: [{ title: "Yoga", status: "completed" }, { title: "Meal prep", status: "failed" }] },
      { date: "Apr 8", tasks: [{ title: "Yoga", status: "completed" }, { title: "Study", status: "completed" }] },
    ],
  },
  You: {
    name: "You",
    points: 280,
    streak: 3,
    longestStreak: 8,
    totalCompleted: 34,
    totalFailed: 8,
    history: [
      { date: "Apr 10", tasks: [{ title: "Study 2hrs", status: "completed" }, { title: "Workout", status: "completed" }, { title: "Meditate", status: "failed" }] },
      { date: "Apr 9", tasks: [{ title: "Study 2hrs", status: "completed" }, { title: "Read 30 pages", status: "completed" }] },
      { date: "Apr 8", tasks: [{ title: "Workout", status: "completed" }, { title: "Study 2hrs", status: "failed" }] },
    ],
  },
  Casey: {
    name: "Casey",
    points: 210,
    streak: 2,
    longestStreak: 6,
    totalCompleted: 28,
    totalFailed: 18,
    history: [
      { date: "Apr 10", tasks: [{ title: "Walk 10k steps", status: "completed" }, { title: "No junk food", status: "failed" }] },
      { date: "Apr 9", tasks: [{ title: "Walk 10k steps", status: "completed" }] },
    ],
  },
  Riley: {
    name: "Riley",
    points: 180,
    streak: 0,
    longestStreak: 4,
    totalCompleted: 22,
    totalFailed: 20,
    history: [
      { date: "Apr 10", tasks: [{ title: "Gym", status: "failed" }, { title: "Study", status: "failed" }] },
      { date: "Apr 9", tasks: [{ title: "Gym", status: "completed" }, { title: "Cook dinner", status: "completed" }] },
    ],
  },
};

interface UserProfileDialogProps {
  userName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfileDialog = ({ userName, open, onOpenChange }: UserProfileDialogProps) => {
  const profile = userName ? MOCK_PROFILES[userName] : null;

  if (!profile) return null;

  const completionRate = Math.round(
    (profile.totalCompleted / (profile.totalCompleted + profile.totalFailed)) * 100
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {profile.name[0]}
            </div>
            {profile.name}
          </DialogTitle>
        </DialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Current Streak</span>
            </div>
            <div className="font-display text-2xl font-bold text-primary">
              {profile.streak} <span className="text-sm">days</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Longest Streak</span>
            </div>
            <div className="font-display text-2xl font-bold text-foreground">
              {profile.longestStreak} <span className="text-sm">days</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="font-display text-2xl font-bold text-success">{profile.totalCompleted}</div>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <div className="font-display text-2xl font-bold text-destructive">{profile.totalFailed}</div>
          </div>
        </div>

        {/* Completion Rate Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-display font-bold text-primary">{completionRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Daily History */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Daily History
            </h3>
          </div>

          <div className="space-y-3">
            {profile.history.map((day) => {
              const dayCompleted = day.tasks.filter((t) => t.status === "completed").length;
              const dayTotal = day.tasks.length;

              return (
                <div key={day.date} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{day.date}</span>
                    <span className="text-xs text-muted-foreground">
                      {dayCompleted}/{dayTotal} done
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {day.tasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            task.status === "completed" ? "bg-success" : "bg-destructive"
                          )}
                        />
                        <span
                          className={cn(
                            task.status === "completed"
                              ? "text-foreground"
                              : "text-muted-foreground line-through"
                          )}
                        >
                          {task.title}
                        </span>
                        {task.status === "completed" ? (
                          <Check className="w-3 h-3 text-success ml-auto" />
                        ) : (
                          <X className="w-3 h-3 text-destructive ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
