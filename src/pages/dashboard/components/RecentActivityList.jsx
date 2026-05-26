// pages/dashboard/components/RecentActivityList.jsx
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import RecentActivityItem from "@/pages/dashboard/components/RecentActivityItem";
import EmptyState from "@/components/ui/EmptyState";

const RecentActivityList = memo(({ activities, loading, error }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <EmptyState
        loading={loading}
        error={!!error}
        loadingText={t("dashboard.recentActivity.loading")}
        errorText={t("dashboard.recentActivity.error")}
        emptyText={t("dashboard.recentActivity.empty")}
      >
        {activities.map((activity) => (
          <RecentActivityItem key={activity.id} activity={activity} />
        ))}
      </EmptyState>
    </div>
  );
});

RecentActivityList.displayName = "RecentActivityList";
export default RecentActivityList;
