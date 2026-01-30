import React from "react";
import Icon from "@/components/AppIcon";

const StatCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-success";
    if (changeType === "negative") return "text-error";
    return "text-muted-foreground";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <div className="clinical-card p-4 md:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-base text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground">{value}</h3>
        </div>
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-2">
          <Icon name={getTrendIcon()} size={16} className={getChangeColor()} />
          <span className={`text-sm font-medium ${getChangeColor()}`}>{change}</span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
