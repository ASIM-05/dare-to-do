import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD = [
  { name: "Alex", points: 450, rank: 1 },
  { name: "Jordan", points: 380, rank: 2 },
  { name: "Sam", points: 320, rank: 3 },
  { name: "You", points: 280, rank: 4 },
  { name: "Casey", points: 210, rank: 5 },
  { name: "Riley", points: 180, rank: 6 },
];

const LeaderboardPanel = () => {
  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {LEADERBOARD.map((user) => (
          <div
            key={user.name}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
              user.name === "You"
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  user.rank === 1 && "bg-yellow-500/20 text-yellow-400",
                  user.rank === 2 && "bg-gray-400/20 text-gray-300",
                  user.rank === 3 && "bg-amber-700/20 text-amber-600",
                  user.rank > 3 && "bg-muted text-muted-foreground"
                )}
              >
                {user.rank <= 3 ? <Medal className="w-4 h-4" /> : user.rank}
              </span>
              <span className={cn("font-medium", user.name === "You" && "text-primary")}>
                {user.name}
              </span>
            </div>
            <span className="font-display text-sm font-bold text-muted-foreground">
              {user.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPanel;
