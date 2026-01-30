import React, { useState } from "react";
import Icon from "@/components/AppIcon";

const SettingsSection = ({ title, description, icon, children, collapsible = false, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical-sm overflow-hidden">
      <div
        className={`px-6 py-4 border-b border-border bg-muted/30 ${collapsible ? "cursor-pointer hover:bg-muted/50" : ""}`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={icon} size={20} color="var(--color-primary)" />
              </div>
            )}
            <div>
              <h3 className="font-headline font-semibold text-base md:text-lg text-foreground">{title}</h3>
              {description && <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
          </div>
          {collapsible && (
            <Icon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              size={20}
              className="text-muted-foreground transition-transform duration-base"
            />
          )}
        </div>
      </div>
      {(!collapsible || isOpen) && <div className="p-6">{children}</div>}
    </div>
  );
};

export default SettingsSection;
