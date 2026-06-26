import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

// ── Mini sparkbar estática por métrica ──────────────────────────────────────
const SPARKBARS = {
  totalRecords: [8, 11, 9, 13, 18],
  completed: [9, 12, 10, 14, 18],
  inProgress: [18, 14, 12, 10, 8],
  planned: [6, 9, 11, 13, 18],
};

const COLORS = {
  totalRecords: { dot: "bg-primary", bar: "bg-primary", trend: "text-primary" },
  completed: { dot: "bg-success", bar: "bg-success", trend: "text-success" },
  inProgress: { dot: "bg-warning", bar: "bg-warning", trend: "text-warning" },
  planned: { dot: "bg-secondary", bar: "bg-secondary", trend: "text-secondary" },
};

// ── SparkBar ────────────────────────────────────────────────────────────────
const SparkBar = memo(({ heights, colorClass }) => (
  <div className="flex items-end gap-[3px] h-5">
    {heights.map((h, i) => (
      <div
        key={i}
        className={cn(
          "w-1 rounded-sm transition-all",
          colorClass,
          i < heights.length - 1 ? "opacity-40" : "opacity-100"
        )}
        style={{ height: `${h}px` }}
      />
    ))}
  </div>
));
SparkBar.displayName = "SparkBar";

// ── StatItem ────────────────────────────────────────────────────────────────
const StatItem = memo(({ label, value, trendLabel, trendUp, metricKey, isLast }) => {
  const color = COLORS[metricKey];

  return (
    <div className={cn("flex flex-col gap-3 px-5 py-4", !isLast && "border-r border-border")}>
      {/* Label + dot */}
      <div className="flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", color.dot)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>

      {/* Valor */}
      <div className="text-[28px] font-headline font-semibold text-foreground leading-none">{value ?? "—"}</div>

      {/* Footer: trend + sparkbar */}
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px] font-medium", trendUp ? "text-success" : "text-error")}>
          {trendUp ? "↑" : "↓"} {trendLabel}
        </span>
        <SparkBar heights={SPARKBARS[metricKey]} colorClass={color.bar} />
      </div>
    </div>
  );
});
StatItem.displayName = "StatItem";

// ── StatsOverview ────────────────────────────────────────────────────────────
const StatsOverview = memo(({ stats }) => {
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      {
        metricKey: "totalRecords",
        label: t("records.stats.total"),
        value: stats?.totalRecords,
        trendLabel: t("records.stats.trends.thisMonth", { percent: 12 }),
        trendUp: true,
      },
      {
        metricKey: "completed",
        label: t("records.stats.completed"),
        value: stats?.completed,
        trendLabel: t("records.stats.trends.positive", { percent: 8 }),
        trendUp: true,
      },
      {
        metricKey: "inProgress",
        label: t("records.stats.inProgress"),
        value: stats?.inProgress,
        trendLabel: t("records.stats.trends.negative", { percent: 3 }),
        trendUp: false,
      },
      {
        metricKey: "planned",
        label: t("records.stats.planned"),
        value: stats?.planned,
        trendLabel: t("records.stats.trends.positive", { percent: 15 }),
        trendUp: true,
      },
    ],
    [stats, t]
  );

  return (
    <div className="clinical-card grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-border overflow-hidden">
      {items.map((item, i) => (
        <StatItem key={item.metricKey} {...item} isLast={i === items.length - 1} />
      ))}
    </div>
  );
});

StatsOverview.displayName = "StatsOverview";
export default StatsOverview;
