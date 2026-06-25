// hooks/useDashboard.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { usePatients } from "@/hooks/PatientsHooks";
import { useAppointments } from "@/hooks/AppointmentsHooks";
import { useRecentActivity } from "@/hooks/RecentActivityHooks";
import { notifyError, notifySuccess } from "@/utils/notifications";

export const useDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { t } = useTranslation();

  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    loading: isSavingAppt,
  } = useAppointments();

  const { addPatient } = usePatients();
  const { activities, loading: loadingActivities, error: activitiesError } = useRecentActivity(userProfile?.id);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ── Appointment filtering ──────────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    if (!appointments?.length) return [];
    if (selectedTimeframe === "all") return appointments;

    const now = new Date();
    const todayStr = now.toDateString();

    return appointments.filter((appt) => {
      const apptDate = appt.date;

      if (selectedTimeframe === "today") return apptDate.toDateString() === todayStr;

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

  // ── Navigation handlers ────────────────────────────────────────────────────
  const handleViewAppointmentDetails = useCallback(() => {
    navigate("/treatment-planning");
  }, [navigate]);

  const handleViewPatient = useCallback(() => {
    navigate("/patient-profile");
  }, [navigate]);

  const handleRescheduleAppointment = useCallback(
    (appointmentId) => {
      const apptToEdit = appointments.find((a) => a.id === appointmentId);
      setSelectedAppointment(apptToEdit);
      setIsScheduleModalOpen(true);
    },
    [appointments]
  );

  const handleQuickAction = useCallback(
    (action) => {
      const routes = {
        addNote: "/clinical-notes",
        weekly: "/weekly-calendar",
      };
      if (action === "newPatient") return setIsAddPatientModalOpen(true);
      if (action === "scheduleAppointment") return setIsScheduleModalOpen(true);
      navigate(routes[action] ?? "/dashboard");
    },
    [navigate]
  );

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const handleCloseScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(false);
    setSelectedAppointment(null);
  }, []);

  const handleDismissAlert = useCallback((alertId) => {
  }, []);

  const handleToggleTaskComplete = useCallback((taskId, completed) => {
  }, []);

  const handleViewTaskDetails = useCallback((taskId) => {
  }, []);

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleAddPatient = useCallback(
    async (formData, imageFile) => {
      const result = await addPatient(formData, imageFile);
      if (result.success) {
        setIsAddPatientModalOpen(false);
        notifySuccess(t("patient.created"));
      } else {
        notifyError("Error: " + result.error);
      }
    },
    [addPatient, t]
  );

  const handleSaveAppointment = useCallback(
    async (appointmentData) => {
      try {
        const result = await addAppointment(appointmentData);
        if (result.success) {
          setIsScheduleModalOpen(false);
          notifySuccess(t("appointment.msgSuccess"));
          await fetchAppointments();
        } else {
          notifyError(t("appointment.msgError") + ": " + (result.error || "Unknown error"));
        }
      } catch (err) {
        notifyError(t("appointment.msgError"));
      }
    },
    [addAppointment, fetchAppointments, t]
  );

  const handleUpdateAppointment = useCallback(
    async (appointmentData) => {
      try {
        const result = await updateAppointment(selectedAppointment.id, appointmentData);
        if (result.success) {
          handleCloseScheduleModal();
          notifySuccess(t("appointment.msgUpdateSuccess") || "Cita actualizada correctamente");
          await fetchAppointments();
        } else {
          notifyError(result.error || t("appointment.msgError"));
        }
      } catch (err) {
        notifyError(t("appointment.msgError"));
      }
    },
    [updateAppointment, selectedAppointment, handleCloseScheduleModal, fetchAppointments, t]
  );

  return {
    // State
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
    // Handlers
    handleViewAppointmentDetails,
    handleRescheduleAppointment,
    handleViewPatient,
    handleQuickAction,
    handleCloseScheduleModal,
    handleDismissAlert,
    handleToggleTaskComplete,
    handleViewTaskDetails,
    handleAddPatient,
    handleSaveAppointment,
    handleUpdateAppointment,
  };
};
