import React from "react";
import Button from "../../../components/ui/Button";

const BulkActions = ({ selectedCount, onAction }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 fade-in-up">
      <div className="clinical-card px-4 md:px-6 py-3 md:py-4 shadow-clinical-xl border-2 border-primary/20">
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{selectedCount === 1 ? "patient" : "patients"} selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onAction("export")} iconName="Download" iconPosition="left">
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction("email")} iconName="Mail" iconPosition="left">
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction("schedule")} iconName="Calendar" iconPosition="left">
              Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction("tag")} iconName="Tag" iconPosition="left">
              Add Tag
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onAction("delete")} iconName="Trash2" iconPosition="left">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
