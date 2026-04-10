import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: "primary" | "success" | "destructive" | "muted";
}

const colorMap = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  success: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
  muted: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

const StatsCard = ({ icon: Icon, label, value, color }: StatsCardProps) => {
  const colors = colorMap[color];

  return (
    <div className={cn("p-4 rounded-xl border card-hover", colors.bg, colors.border)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-5 h-5", colors.text)} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className={cn("font-display text-3xl font-bold", colors.text)}>{value}</div>
    </div>
  );
};

export default StatsCard;
