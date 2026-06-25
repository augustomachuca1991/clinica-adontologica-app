import React from "react";
import Icon from "@/components/AppIcon";
import { cn } from "@/utils/cn";

const TagPill = ({ tag, selected, onToggle, label }) => (
  <button
    type="button"
    onClick={() => onToggle(tag)}
    className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95",
      selected
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
    )}
  >
    {selected && <Icon name="Check" size={10} />}
    {label}
  </button>
);

export default TagPill;
