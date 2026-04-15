import { useRef } from "react";
import animeCelebrate from "@/assets/anime-celebrate.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Download, Flame, Trophy, Check, Target } from "lucide-react";

interface CompletionShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completed: number;
  total: number;
  streak: number;
  points: number;
  userName: string;
}

const CompletionShareDialog = ({ open, onOpenChange, completed, total, streak, points, userName }: CompletionShareDialogProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = `🔥 ${userName} just crushed ${completed}/${total} tasks today!\n🏆 ${points} total points | 🔥 ${streak} day streak\n\n#DareUp #Accountability`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "DareUp Progress", text: shareText });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader className="relative">
          <img src={animeCelebrate} alt="Celebrating!" width={70} height={70} className="absolute -top-14 right-0 animate-bounce-slow pointer-events-none" />
          <DialogTitle className="font-display flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Task Complete! 🎉
          </DialogTitle>
          <DialogDescription>Share your progress with friends!</DialogDescription>
        </DialogHeader>

        {/* Shareable Card */}
        <div ref={cardRef} className="rounded-2xl bg-gradient-to-br from-primary/20 via-background to-primary/10 border border-primary/30 p-6 space-y-4">
          <div className="text-center">
            <Flame className="w-10 h-10 text-primary mx-auto mb-2" />
            <h3 className="font-display text-lg font-bold text-foreground">
              DARE<span className="text-primary">UP</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{userName}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-card/80 border border-border p-3">
              <Check className="w-5 h-5 text-success mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{completed}/{total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tasks</p>
            </div>
            <div className="rounded-xl bg-card/80 border border-border p-3">
              <Flame className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{streak}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Streak</p>
            </div>
            <div className="rounded-xl bg-card/80 border border-border p-3">
              <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{points}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Points</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleCopy}>
            <Target className="w-4 h-4 mr-1" /> Copy Text
          </Button>
          <Button variant="hero" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletionShareDialog;
