import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TreatmentProgressChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-clinical-md p-3">
          <p className="text-sm font-medium text-foreground mb-2">{payload?.[0]?.payload?.month}</p>
          <div className="space-y-1">
            <p className="text-xs text-success">Completed: {payload?.[0]?.value}</p>
            <p className="text-xs text-warning">In Progress: {payload?.[1]?.value}</p>
            <p className="text-xs text-primary">Scheduled: {payload?.[2]?.value}</p>
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} stroke="var(--color-border)" />
          <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} stroke="var(--color-border)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "var(--color-foreground)" }} />
          <Bar dataKey="completed" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="scheduled" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TreatmentProgressChart;
