import React from "react";
import * as LucideIcons from "@/components/iconMap";
import { HelpCircle } from "@/components/iconMap";

function Icon({ name, size = 24, color = "currentColor", className = "", strokeWidth = 2, ...props }) {
  const IconComponent = LucideIcons?.[name];

  if (!IconComponent) {
    return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
  }

  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} className={className} {...props} />;
}
export default Icon;
