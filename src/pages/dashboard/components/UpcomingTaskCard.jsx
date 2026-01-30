import React from "react";
import Icon from "@/components/AppIcon";
import { Checkbox } from "@/components/ui/Checkbox";

const UpcomingTaskCard = ({ task, onToggleComplete, onViewDetails }) => {
  const getPriorityColor = () => {
    switch (task?.priority) {
      case "urgent":
        return "text-error";
      case "high":
        return "text-warning";
      case "medium":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriorityBadge = () => {
    switch (task?.priority) {
      case "urgent":
        return "bg-error/10 text-error";
      case "high":
        return "bg-warning/10 text-warning";
      case "medium":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-base">
      <Checkbox checked={task?.completed} onChange={(e) => onToggleComplete(task?.id, e?.target?.checked)} className="mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={`text-sm font-medium ${task?.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {task?.title}
          </h4>
          <span className={`status-indicator text-xs px-2 py-1 ${getPriorityBadge()}`}>{task?.priority}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task?.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={12} />
            <span>{task?.dueTime}</span>
          </div>
          {task?.patientName && (
            <div className="flex items-center gap-1">
              <Icon name="User" size={12} />
              <span>{task?.patientName}</span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => onViewDetails(task?.id)}
        className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors duration-base focus-clinical"
        aria-label="View task details"
      >
        <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default UpcomingTaskCard;
