import React, { memo } from "react";
import AppointmentCard from "@/pages/dashboard/components/AppointmentCard";
import AppointmentSkeleton from "@/pages/dashboard/components/AppointmentSkeleton";
import EmptyState from "@/components/ui/EmptyState";

const AppointmentList = memo(({ appointments, loading, emptyText, onViewDetails, onReschedule }) => (
  <div className="space-y-3">
    <EmptyState loading={loading} loadingText="" emptyText={emptyText}>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <AppointmentSkeleton key={i} />)
        : appointments.length === 0
          ? null
          : appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onViewDetails={onViewDetails}
                onReschedule={onReschedule}
              />
            ))}
    </EmptyState>
  </div>
));

AppointmentList.displayName = "AppointmentList";
export default AppointmentList;