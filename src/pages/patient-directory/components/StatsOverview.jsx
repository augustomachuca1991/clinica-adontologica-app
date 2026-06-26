import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";

const StatsOverview = ({ stats }) => {
  const { t } = useTranslation();
  const statCards = [
    {
      label: t("directory.stats.total"),
      value: stats?.total,
      icon: "Users",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: t("directory.stats.active"),
      value: stats?.active,
      icon: "UserCheck",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: t("directory.stats.upcoming"),
      value: stats?.upcoming,
      icon: "Calendar",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: t("directory.stats.overdue"),
      value: stats?.overdue,
      icon: "AlertCircle",
      color: "text-error",
      bgColor: "bg-error/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="clinical-card p-4 md:p-5 lg:p-6 fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-headline font-bold text-foreground mb-1">{stat?.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{stat?.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
