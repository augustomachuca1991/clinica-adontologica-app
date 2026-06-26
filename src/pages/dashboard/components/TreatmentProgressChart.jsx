import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TreatmentProgressChart = ({ data, t }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <p className="text-sm font-medium text-foreground mb-2">{payload[0].payload.month}</p>
          <div className="space-y-1">
            <p className="text-xs" style={{ color: "#00f0ff" }}>
              {t("common.status.completed")}: {payload[0].value}
            </p>
            <p className="text-xs" style={{ color: "#ff6b4a" }}>
              {t("common.status.inProgress")}: {payload[1].value}
            </p>
            <p className="text-xs" style={{ color: "#90007f" }}>
              {t("common.status.scheduled")}: {payload[2].value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 md:h-80" aria-label="Treatment Progress Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            stroke="rgba(255,255,255,0.08)"
            tickFormatter={(month) => t(`dashboard.treatmentProgress.months.${month}`)}
          />
          <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} stroke="rgba(255,255,255,0.08)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              switch (value) {
                case "completed": return t("common.status.completed");
                case "inProgress": return t("common.status.inProgress");
                case "scheduled": return t("common.status.scheduled");
                default: return value;
              }
            }}
            wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}
          />
          <Bar dataKey="completed" fill="#00f0ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="#ff6b4a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="scheduled" fill="#90007f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TreatmentProgressChart;
