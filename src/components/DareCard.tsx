import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const DARES = [
  "Do 20 pushups right now! 💪",
  "Take a cold shower for 30 seconds 🥶",
  "Post an embarrassing selfie 📸",
  "Run around the block once 🏃",
  "Do a 2-minute plank 🧘",
  "Eat something spicy 🌶️",
  "No phone for 1 hour 📵",
  "Do 50 jumping jacks 🦘",
];

interface DareCardProps {
  onComplete: () => void;
  onDismiss: () => void;
}

const DareCard = ({ onComplete, onDismiss }: DareCardProps) => {
  const dare = DARES[Math.floor(Math.random() * DARES.length)];

  return (
    <div className="p-6 rounded-xl bg-dare/10 border border-dare/30 glow-dare animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-dare" />
        <span className="font-display text-sm font-bold uppercase tracking-wider text-dare">
          Dare Triggered!
        </span>
      </div>
      <p className="text-xl font-bold text-foreground mb-4">{dare}</p>
      <p className="text-sm text-muted-foreground mb-4">
        Complete this dare to recover +5 points!
      </p>
      <div className="flex gap-3">
        <Button variant="dare" onClick={onComplete}>
          Dare Completed ✅
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          Skip (0 pts)
        </Button>
      </div>
    </div>
  );
};

export default DareCard;
