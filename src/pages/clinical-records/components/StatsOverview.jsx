import React from "react";
import Icon from "../../../components/AppIcon";

const StatsOverview = ({ stats }) => {
  const statCards = [
    {
      label: "Total Records",
      value: stats?.totalRecords,
      icon: "FileText",
      color: "primary",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Completed",
      value: stats?.completed,
      icon: "CheckCircle",
      color: "success",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "In Progress",
      value: stats?.inProgress,
      icon: "Clock",
      color: "warning",
      trend: "-3%",
      trendUp: false,
    },
    {
      label: "Planned",
      value: stats?.planned,
      icon: "Calendar",
      color: "primary",
      trend: "+15%",
      trendUp: true,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: "bg-primary/10 text-primary",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm hover:shadow-clinical-md transition-all duration-base fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat?.color)}`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stat?.trendUp ? "text-success" : "text-error"}`}>
              <Icon name={stat?.trendUp ? "TrendingUp" : "TrendingDown"} size={14} />
              <span>{stat?.trend}</span>
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-headline font-bold text-foreground mb-1">{stat?.value}</p>
            <p className="text-xs md:text-sm text-muted-foreground">{stat?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
