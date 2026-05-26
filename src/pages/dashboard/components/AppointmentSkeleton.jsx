// pages/dashboard/components/AppointmentSkeleton.jsx
import React, { memo } from "react";
import Skeleton from "@/components/ui/Skeleton";

const AppointmentSkeleton = memo(() => (
  <div className="flex items-center justify-between p-3 border-b border-border last:border-0">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="flex flex-col items-end space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
));

AppointmentSkeleton.displayName = "AppointmentSkeleton";
export default AppointmentSkeleton;
