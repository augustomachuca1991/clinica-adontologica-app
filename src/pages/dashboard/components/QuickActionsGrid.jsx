// pages/dashboard/components/QuickActionsGrid.jsx
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import QuickActionButton from "@/pages/dashboard/components/QuickActionButton";

const QuickActionsGrid = memo(({ actions, onAction }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <QuickActionButton
          key={action.label}
          icon={action.icon}
          label={t(`dashboard.quickActions.${action.label}`)}
          color={action.color}
          onClick={() => onAction(action.label)}
        />
      ))}
    </div>
  );
});

QuickActionsGrid.displayName = "QuickActionsGrid";
export default QuickActionsGrid;
