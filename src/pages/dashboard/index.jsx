// pages/dashboard/Dashboard.jsx
import React, { useCallback } from "react";
import GracePeriodBanner from "@/components/ui/GracePeriodBanner";
import TimeframeSelector from "@/components/ui/TimeframeSelector";
import SectionCard from "@/components/ui/SectionCard";
import TreatmentProgressChart from "@/pages/dashboard/components/TreatmentProgressChart";
import ScheduleAppointmentModal from "@/pages/dashboard/components/ScheduleAppointmentModal";
import AddPatientModal from "@/pages/patient-directory/components/AddPatientModal";
import AppointmentList from "@/pages/dashboard/components/AppointmentList";
import QuickActionsGrid from "@/pages/dashboard/components/QuickActionsGrid";
import RecentActivityList from "@/pages/dashboard/components/RecentActivityList";
import { useDashboard } from "@/hooks/DashboardHooks";
import { QUICK_ACTIONS, TREATMENT_DATA } from "@/pages/dashboard/constants";

const Dashboard = () => {
  const {
    selectedTimeframe,
    setSelectedTimeframe,
    isAddPatientModalOpen,
    setIsAddPatientModalOpen,
    isScheduleModalOpen,
    selectedAppointment,
    isSavingAppt,
    activities,
    loadingActivities,
    activitiesError,
    filteredAppointments,
    userProfile,
    t,
    handleViewAppointmentDetails,
    handleRescheduleAppointment,
    handleQuickAction,
    handleCloseScheduleModal,
    handleAddPatient,
    handleSaveAppointment,
    handleUpdateAppointment,
  } = useDashboard();

  const fullname = userProfile?.full_name || "no especified";

  const timeframeOptions = [
    { value: "today", label: t("timeFrame.today") },
    { value: "week", label: t("timeFrame.thisWeek") },
    { value: "month", label: t("timeFrame.thisMonth") },
  ];

  const handleViewAllAppointments = useCallback(() => setSelectedTimeframe("all"), [setSelectedTimeframe]);

  return (
    <>
      <div className="space-y-6">
        <GracePeriodBanner />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-headline font-bold text-foreground mb-1.5">
              {t("home.welcome", { name: fullname })}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("home.overview")}</p>
          </div>
          <TimeframeSelector options={timeframeOptions} value={selectedTimeframe} onChange={setSelectedTimeframe} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title={t(`appointment.timeFrame.${selectedTimeframe}`)}
              actionLabel={t("appointment.viewAll")}
              actionIcon="Calendar"
              onAction={handleViewAllAppointments}
            >
              <AppointmentList
                appointments={filteredAppointments}
                loading={isSavingAppt}
                emptyText={t(`appointment.noAppointments.${selectedTimeframe}`)}
                onViewDetails={handleViewAppointmentDetails}
                onReschedule={handleRescheduleAppointment}
              />
            </SectionCard>

            <SectionCard
              title={t("dashboard.treatmentProgress.title")}
              actionLabel={t("common.actions.export")}
              actionIcon="Download"
              onAction={() => {}}
            >
              <TreatmentProgressChart data={TREATMENT_DATA} t={t} />
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SectionCard title={t("dashboard.quickActions.title")}>
              <QuickActionsGrid actions={QUICK_ACTIONS} onAction={handleQuickAction} />
            </SectionCard>

            <SectionCard
              title={t("dashboard.recentActivity.title")}
              actionLabel={t("dashboard.recentActivity.refresh")}
              actionIcon="RefreshCw"
              onAction={() => {}}
            >
              <RecentActivityList activities={activities} loading={loadingActivities} error={activitiesError} />
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSave={selectedAppointment ? handleUpdateAppointment : handleSaveAppointment}
        initialData={selectedAppointment}
        isLoading={isSavingAppt}
      />
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSave={handleAddPatient}
      />
    </>
  );
};

export default Dashboard;
