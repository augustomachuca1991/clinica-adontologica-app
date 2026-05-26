// pages/patient-directory/components/Field.jsx
import React, { memo } from "react";

const Field = memo(({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>}
    {children}
  </div>
));

Field.displayName = "Field";
export default Field;
