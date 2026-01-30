import React from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";

const RecentActivityItem = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity?.type) {
      case "appointment":
        return "Calendar";
      case "treatment":
        return "Activity";
      case "payment":
        return "DollarSign";
      case "note":
        return "FileText";
      default:
        return "Circle";
    }
  };

  const getActivityColor = () => {
    switch (activity?.type) {
      case "appointment":
        return "var(--color-primary)";
      case "treatment":
        return "var(--color-success)";
      case "payment":
        return "var(--color-warning)";
      case "note":
        return "var(--color-secondary)";
      default:
        return "var(--color-muted-foreground)";
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-base">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${getActivityColor()}15` }}
      >
        <Icon name={getActivityIcon()} size={18} color={getActivityColor()} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Image src={activity?.userImage} alt={activity?.userImageAlt} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm font-medium text-foreground">{activity?.userName}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{activity?.time}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{activity?.description}</p>
      </div>
    </div>
  );
};

export default RecentActivityItem;
