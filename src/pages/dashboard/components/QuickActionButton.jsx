import React from "react";
import Icon from "@/components/AppIcon";

const QuickActionButton = ({ icon, label, onClick, color = "var(--color-primary)" }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 md:p-6 rounded-lg bg-card border border-border hover:shadow-clinical-md transition-all duration-base focus-clinical group"
    >
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-3 transition-transform duration-base group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon name={icon} size={24} color={color} />
      </div>
      <span className="text-sm md:text-base font-medium text-foreground text-center">{label}</span>
    </button>
  );
};

export default QuickActionButton;
