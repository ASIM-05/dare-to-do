import { Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/pages/Dashboard";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onFail: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onComplete, onFail, onDelete }: TaskItemProps) => {
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        task.status === "completed" && "bg-success/5 border-success/30",
        task.status === "failed" && "bg-destructive/5 border-destructive/30",
        task.status === "pending" && "bg-card border-border hover:border-primary/30 card-hover"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            task.status === "completed" && "bg-success",
            task.status === "failed" && "bg-destructive",
            task.status === "pending" && "bg-muted-foreground"
          )}
        />
        <span
          className={cn(
            "font-medium",
            task.status === "completed" && "line-through text-muted-foreground",
            task.status === "failed" && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {task.status === "pending" && (
          <>
            <Button variant="success" size="icon" className="h-8 w-8" onClick={() => onComplete(task.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onFail(task.id)}>
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        {task.status === "completed" && (
          <span className="text-xs font-medium text-success">+10 pts</span>
        )}
        {task.status === "failed" && (
          <span className="text-xs font-medium text-destructive">DARE!</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
