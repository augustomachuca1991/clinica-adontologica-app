// pages/clinical-records/components/StatsOverview.jsx
import React, { memo, useMemo } from "react";
import Icon from "@/components/AppIcon";
import { cn } from "@/utils/cn";

// ── Constantes estáticas ──────────────────────────────────────────────────────

const ICON_COLOR = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

const TrendBadge = memo(({ trend, trendUp }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
      trendUp ? "bg-success/10 text-success" : "bg-error/10 text-error"
    )}
  >
    <Icon name={trendUp ? "TrendingUp" : "TrendingDown"} size={12} />
    {trend}
  </span>
));
TrendBadge.displayName = "TrendBadge";

const StatCard = memo(({ label, value, icon, color, trend, trendUp, delay }) => (
  <div className="clinical-card p-4 flex flex-col gap-3 fade-in-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center justify-between">
      <div
        className={cn("w-9 h-9 rounded-lg flex items-center justify-center", ICON_COLOR[color] ?? ICON_COLOR.primary)}
      >
        <Icon name={icon} size={17} />
      </div>
      <TrendBadge trend={trend} trendUp={trendUp} />
    </div>

    <div className="h-px bg-border" />

    <div className="flex flex-col gap-0.5">
      <p className="text-2xl md:text-3xl font-headline font-bold text-foreground leading-none">{value ?? "—"}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
));
StatCard.displayName = "StatCard";

// ── Componente principal ──────────────────────────────────────────────────────

const StatsOverview = memo(({ stats }) => {
  const statCards = useMemo(
    () => [
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
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 50} />
      ))}
    </div>
  );
});

StatsOverview.displayName = "StatsOverview";
export default StatsOverview;
