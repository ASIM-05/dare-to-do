import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Zap, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Dare {
  id: string;
  description: string;
  category: string;
  difficulty: number;
}

interface DarePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDare: (dare: Dare) => void;
  failedUserName?: string;
}

const categoryColors: Record<string, string> = {
  physical: "bg-success/10 text-success border-success/30",
  social: "bg-primary/10 text-primary border-primary/30",
  mental: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  funny: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  extreme: "bg-destructive/10 text-destructive border-destructive/30",
};

const DarePickerDialog = ({ open, onOpenChange, onSelectDare, failedUserName }: DarePickerDialogProps) => {
  const [dares, setDares] = useState<Dare[]>([]);
  const [selectedDare, setSelectedDare] = useState<Dare | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomDares = async () => {
    setLoading(true);
    setSelectedDare(null);
    const { data } = await supabase
      .from("dares")
      .select("*")
      .limit(100);

    if (data && data.length > 0) {
      // Shuffle and pick 3
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setDares(shuffled.slice(0, 3));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchRandomDares();
  }, [open]);

  const handleConfirm = () => {
    if (selectedDare) {
      onSelectDare(selectedDare);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-dare" />
            Choose a Dare{failedUserName ? ` for ${failedUserName}` : ""}!
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Pick one of these dares. The failed member must complete it to recover points!
        </p>

        <div className="space-y-3 my-4">
          {dares.map((dare) => (
            <button
              key={dare.id}
              onClick={() => setSelectedDare(dare)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all",
                selectedDare?.id === dare.id
                  ? "border-dare bg-dare/10 glow-dare"
                  : "border-border hover:border-dare/50 bg-card"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{dare.description}</p>
                <span className={cn("text-xs px-2 py-1 rounded-full border shrink-0", categoryColors[dare.category] || "")}>
                  {dare.category}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      i < dare.difficulty ? "bg-dare" : "bg-muted"
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">Difficulty</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={fetchRandomDares} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4 mr-1", loading && "animate-spin")} />
            Shuffle
          </Button>
          <Button variant="dare" onClick={handleConfirm} disabled={!selectedDare}>
            Assign This Dare ⚡
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DarePickerDialog;
