import React, { memo } from "react";
import Icon from "@/components/AppIcon";

const Field = memo(({ label, required, children, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <Icon name="AlertCircle" size={11} />
        {error}
      </p>
    )}
  </div>
));

Field.displayName = "Field";
export default Field;
