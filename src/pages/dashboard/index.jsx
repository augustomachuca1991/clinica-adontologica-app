import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import GracePeriodBanner from "@/components/ui/GracePeriodBanner";
import { useTranslation } from "react-i18next";
import AppointmentCard from "@/pages/dashboard/components/AppointmentCard";
import QuickActionButton from "@/pages/dashboard/components/QuickActionButton";
import RecentActivityItem from "@/pages/dashboard/components/RecentActivityItem";
import TreatmentProgressChart from "@/pages/dashboard/components/TreatmentProgressChart";
import { useAuth } from "@/contexts/AuthContext";
import AddPatientModal from "@/pages/patient-directory/components/AddPatientModal";
import { usePatients } from "@/hooks/PatientsHooks";
import { useAppointments } from "@/hooks/AppointmentsHooks";
import { useRecentActivity } from "@/hooks/RecentActivityHooks";
import ScheduleAppointmentModal from "@/pages/dashboard/components/ScheduleAppointmentModal";
import { notifyError, notifySuccess } from "@/utils/notifications";

import PatientAlertCard from "./components/PatientAlertCard";
import UpcomingTaskCard from "./components/UpcomingTaskCard";
/* import StatCard from "./components/StatCard"; */

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const fullname = userProfile?.full_name || "no especified";
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    loading: isSavingAppt,
  } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { addPatient } = usePatients();
  const { activities, loading, error } = useRecentActivity(userProfile?.id);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const alerts = [
    {
      id: 1,
      type: "critical",
      patientName: "Robert Williams",
      patientId: 1,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1f23d9c3d-1763295425663.png",
      patientImageAlt:
        "Professional headshot of African American man with short hair in gray suit with serious expression",
      message: "Post-operative follow-up required - Extraction site showing signs of infection",
      time: "15 min ago",
    },
    {
      id: 2,
      type: "warning",
      patientName: "Lisa Anderson",
      patientId: 2,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_179d264c2-1763294988724.png",
      patientImageAlt: "Professional headshot of Caucasian woman with red hair in yellow top with warm smile",
      message: "Lab results ready for review - Crown preparation measurements",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "info",
      patientName: "David Martinez",
      patientId: 3,
      patientImage: "https://img.rocket.new/generatedImages/rocket_gen_img_116742dea-1763296857162.png",
      patientImageAlt: "Professional headshot of Hispanic man with beard in blue shirt with professional demeanor",
      message: "Insurance pre-authorization approved for orthodontic treatment",
      time: "2 hours ago",
    },
  ];

  const quickActions = [
    { icon: "UserPlus", label: "newPatient", color: "var(--color-primary)" },
    { icon: "AlarmClockCheck", label: "scheduleAppointment", color: "var(--color-success)" },
    { icon: "FileText", label: "addNote", color: "var(--color-warning)" },
    { icon: "Calendar", label: "weekly", color: "var(--color-accent)" },
  ];

  const treatmentData = [
    { month: "Jan", completed: 45, inProgress: 12, scheduled: 23 },
    { month: "Feb", completed: 52, inProgress: 15, scheduled: 28 },
    { month: "Mar", completed: 48, inProgress: 18, scheduled: 25 },
    { month: "Apr", completed: 61, inProgress: 14, scheduled: 30 },
    { month: "May", completed: 55, inProgress: 20, scheduled: 27 },
    { month: "Jun", completed: 67, inProgress: 16, scheduled: 32 },
    { month: "Jul", completed: 45, inProgress: 12, scheduled: 23 },
    { month: "Ago", completed: 52, inProgress: 15, scheduled: 28 },
    { month: "Sep", completed: 48, inProgress: 18, scheduled: 25 },
    { month: "Oct", completed: 61, inProgress: 14, scheduled: 30 },
    { month: "Nov", completed: 55, inProgress: 20, scheduled: 27 },
    { month: "Dec", completed: 67, inProgress: 16, scheduled: 32 },
  ];

  /* const upcomingTasks = [
    {
      id: 1,
      title: "Review lab results for crown preparation",
      description: "Check measurements and color matching for Lisa Anderson's crown",
      dueTime: "11:00 AM",
      priority: "urgent",
      patientName: "Lisa Anderson",
      completed: false,
    },
    {
      id: 2,
      title: "Follow-up call with insurance company",
      description: "Verify coverage for orthodontic treatment plan",
      dueTime: "02:30 PM",
      priority: "high",
      patientName: "David Martinez",
      completed: false,
    },
    {
      id: 3,
      title: "Update treatment plan documentation",
      description: "Complete clinical notes and treatment progress updates",
      dueTime: "04:00 PM",
      priority: "medium",
      patientName: null,
      completed: false,
    },
    {
      id: 4,
      title: "Order dental supplies",
      description: "Restock composite materials and anesthetic supplies",
      dueTime: "05:00 PM",
      priority: "low",
      patientName: null,
      completed: true,
    },
  ]; */

  const handleViewAppointmentDetails = (appointmentId) => {
    navigate("/treatment-planning");
  };

  const handleRescheduleAppointment = (appointmentId) => {
    const apptToEdit = appointments.find((a) => a.id === appointmentId);
    setSelectedAppointment(apptToEdit);
    setIsScheduleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleDismissAlert = (alertId) => {
    console.log("Dismissing alert:", alertId);
  };

  const handleViewPatient = (patientId) => {
    console.log("Viewing patient:", patientId);
    navigate("/patient-profile");
  };

  const handleQuickAction = (action) => {
    if (action === "newPatient") {
      setIsAddPatientModalOpen(true);
    } else if (action === "scheduleAppointment") {
      setIsScheduleModalOpen(true);
    } else if (action === "addNote") {
      navigate("/clinical-notes");
    } else if (action === "weekly") {
      navigate("/weekly-calendar");
    } else {
      navigate("/dashboard");
    }
  };

  const handleToggleTaskComplete = (taskId, completed) => {
    console.log("Task completion toggled:", taskId, completed);
  };

  const handleAddPatient = async (formData, imageFile) => {
    const result = await addPatient(formData, imageFile);

    if (result.success) {
      setIsAddPatientModalOpen(false);
      notifySuccess(t("patient.created"));
    } else {
      console.error("Error al guardar:", result.error);
      notifyError("Error: " + result.error);
    }
  };

  const handleViewTaskDetails = (taskId) => {
    console.log("Viewing task:", taskId);
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      const result = await addAppointment(appointmentData);

      if (result.success) {
        setIsScheduleModalOpen(false);
        notifySuccess(t("appointment.msgSuccess"));
        await fetchAppointments();
      } else {
        console.error("Error:", result.error);
        notifyError(t("appointment.msgError") + ": " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("error:", error);
      notifyError(t("appointment.msgError"));
    }
  };

  const handleUpdate = async (appointmentData) => {
    try {
      // 1. Extraemos la función updateAppointment de tu hook
      // (Asegúrate de agregarla a la desestructuración de useAppointments arriba)
      const result = await updateAppointment(selectedAppointment.id, appointmentData);

      if (result.success) {
        handleCloseModal(); // Esto cierra y limpia el selectedAppointment
        notifySuccess(t("appointment.msgUpdateSuccess") || "Cita actualizada correctamente");
        await fetchAppointments(); // Refresca la lista para ver los cambios
      } else {
        notifyError(result.error || t("appointment.msgError"));
      }
    } catch (error) {
      console.error("Error en update:", error);
      notifyError(t("appointment.msgError"));
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];

    if (selectedTimeframe === "all") return appointments;

    const now = new Date();
    const todayStr = now.toDateString();

    return appointments.filter((appt) => {
      // appt.date ya es un objeto Date según tu hook, no hace falta hacer new Date()
      const apptDate = appt.date;

      if (selectedTimeframe === "today") {
        return apptDate.toDateString() === todayStr;
      }

      if (selectedTimeframe === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return apptDate >= startOfWeek && apptDate <= endOfWeek;
      }

      if (selectedTimeframe === "month") {
        return apptDate.getMonth() === now.getMonth() && apptDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [appointments, selectedTimeframe]);

  const AppointmentSkeleton = () => (
    <div className="flex items-center justify-between p-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        {/* Círculo del Avatar */}
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          {/* Nombre del paciente */}
          <Skeleton className="h-4 w-32" />
          {/* Tratamiento/Razón */}
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        {/* Hora */}
        <Skeleton className="h-4 w-16" />
        {/* Duración */}
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <GracePeriodBanner />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
              {t("home.welcome", { name: fullname })}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("home.overview")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeframe === "today" ? "default" : "tertiary"}
              size="sm"
              onClick={() => setSelectedTimeframe("today")}
            >
              {t("timeFrame.today")}
            </Button>
            <Button
              variant={selectedTimeframe === "week" ? "default" : "tertiary"}
              size="sm"
              onClick={() => setSelectedTimeframe("week")}
            >
              {t("timeFrame.thisWeek")}
            </Button>
            <Button
              variant={selectedTimeframe === "month" ? "default" : "tertiary"}
              size="sm"
              onClick={() => setSelectedTimeframe("month")}
            >
              {t("timeFrame.thisMonth")}
            </Button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats?.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
                  {t(`appointment.timeFrame.${selectedTimeframe}`)}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTimeframe("all")}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  {t("appointment.viewAll")}
                </Button>
              </div>
              <div className="space-y-4">
                {isSavingAppt ? (
                  <>
                    <AppointmentSkeleton />
                    <AppointmentSkeleton />
                    <AppointmentSkeleton />
                    <AppointmentSkeleton />
                  </>
                ) : filteredAppointments.length === 0 ? (
                  <p className="text-muted-foreground p-4 text-center">
                    {t(`appointment.noAppointments.${selectedTimeframe}`)}
                  </p>
                ) : (
                  filteredAppointments?.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onViewDetails={handleViewAppointmentDetails}
                      onReschedule={handleRescheduleAppointment}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
                  {t("dashboard.treatmentProgress.title")}
                </h2>
                <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
                  {t("dashboard.treatmentProgress.export")}
                </Button>
              </div>
              <TreatmentProgressChart data={treatmentData} t={t} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="clinical-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground mb-4">
                {t("dashboard.quickActions.title")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions?.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    icon={action?.icon}
                    label={t(`dashboard.quickActions.${action?.label}`)}
                    color={action?.color}
                    onClick={() => handleQuickAction(action?.label)}
                  />
                ))}
              </div>
            </div>
            <div className="clinical-card p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
                  {t("dashboard.recentActivity.title")}
                </h2>
                <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
                  {t("dashboard.recentActivity.refresh")}
                </Button>
              </div>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Cargando actividad reciente...</p>
                ) : error ? (
                  <p className="text-sm text-destructive">Error cargando actividad.</p>
                ) : !activities.length ? (
                  <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
                ) : (
                  activities.map((activity) => <RecentActivityItem key={activity?.id} activity={activity} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseModal}
        onSave={selectedAppointment ? handleUpdate : handleSaveAppointment}
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
