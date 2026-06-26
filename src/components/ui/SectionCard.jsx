// components/ui/SectionCard.jsx
import React, { memo } from "react";
import Button from "@/components/ui/Button";

/**
 * SectionCard – tarjeta clínica con header (título + acción opcional) y contenido.
 *
 * Props:
 *  - title:         string
 *  - actionLabel?:  string
 *  - actionIcon?:   string  (nombre de icono de lucide)
 *  - onAction?:     () => void
 *  - children:      ReactNode
 *  - className?:    string
 */
const SectionCard = memo(({ title, actionLabel, actionIcon, onAction, children, className = "" }) => {
  return (
    <div className={`clinical-card p-4 md:p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-base md:text-lg font-headline font-semibold text-foreground">{title}</h2>
        {actionLabel && onAction && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            iconName={actionIcon}
            iconPosition="left"
          >
            {actionLabel}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
});

SectionCard.displayName = "SectionCard";
export default SectionCard;
