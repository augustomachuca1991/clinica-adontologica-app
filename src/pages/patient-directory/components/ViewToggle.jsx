import React from "react";
import Button from "@/components/ui/Button";

const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        iconName="Grid"
        aria-label="Grid view"
      />
      <Button
        variant={currentView === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        iconName="List"
        aria-label="Table view"
      />
    </div>
  );
};

export default ViewToggle;
