// pages/patient-directory/components/StepIndicator.jsx
import React, { memo } from "react";
import Icon from "@/components/AppIcon";
import { cn } from "@/utils/cn";

const StepIndicator = memo(({ current, steps }) => (
  <div className="flex items-center gap-0">
    {steps.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border",
                done && "bg-primary border-primary text-primary-foreground shadow-sm",
                active && "bg-primary/10 border-primary text-primary scale-110 shadow-md",
                !done && !active && "bg-muted/50 border-border text-muted-foreground"
              )}
            >
              {done ? <Icon name="Check" size={14} /> : <Icon name={step.icon} size={14} />}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider transition-colors",
                active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px flex-1 mx-2 mb-4 transition-all duration-500",
                i < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
));

StepIndicator.displayName = "StepIndicator";
export default StepIndicator;
