// components/ui/TimeframeSelector.jsx
import React, { memo } from "react";
import Button from "@/components/ui/Button";

/**
 * TimeframeSelector – botones de filtro reutilizables para "today / week / month / all".
 *
 * Props:
 *  - options:  [{ value: string, label: string }]
 *  - value:    string (timeframe activo)
 *  - onChange: (value: string) => void
 *  - className?: string
 */
const TimeframeSelector = memo(({ options, value, onChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? "default" : "tertiary"}
          size="sm"
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
});

TimeframeSelector.displayName = "TimeframeSelector";
export default TimeframeSelector;
