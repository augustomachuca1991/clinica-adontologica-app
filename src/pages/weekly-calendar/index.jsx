import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useAppointments } from "@/hooks/AppointmentsHooks";
import ScheduleAppointmentModal from "@/pages/dashboard/components/ScheduleAppointmentModal";
import AppointmentCard from "@/pages/weekly-calendar/components/AppointmentCard";
import MobileActionSheet from "@/pages/weekly-calendar/components/MobileActionSheet";
import { notifyError, notifySuccess, notifyConfirm } from "@/utils/notifications";

const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

const WeeklyCalendar = () => {
  const { t } = useTranslation();
  const {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    loading: isSaving,
  } = useAppointments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const timeSlots = [
    ...Array.from({ length: 17 }, (_, i) => {
      const h = Math.floor(i / 4) + 9;
      const m = (i % 4) * 15;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }),
    ...Array.from({ length: 17 }, (_, i) => {
      const h = Math.floor(i / 4) + 17;
      const m = (i % 4) * 15;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }),
  ];

  const daysOfWeek = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];

  const dayMap = useMemo(
    () => ({
      [t("days.monday")]: 1,
      [t("days.tuesday")]: 2,
      [t("days.wednesday")]: 3,
      [t("days.thursday")]: 4,
      [t("days.friday")]: 5,
      [t("days.saturday")]: 6,
    }),
    [t]
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const appointmentsMap = useMemo(() => {
    const map = {};
    if (!appointments || appointments.length === 0) return map;
    appointments.forEach((appt) => {
      const d = appt.date;
      if (isNaN(d.getTime())) return;
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const timeKey = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      map[`${dateKey}-${timeKey}`] = appt;
    });
    return map;
  }, [appointments]);

  const getCellDate = (day) => {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const targetDayIndex = dayMap[day];
    const diff = targetDayIndex - (currentDayIndex === 0 ? 7 : currentDayIndex);
    const cellDate = new Date(today);
    cellDate.setDate(today.getDate() + diff);
    const y = cellDate.getFullYear();
    const m = String(cellDate.getMonth() + 1).padStart(2, "0");
    const d = String(cellDate.getDate()).padStart(2, "0");
    return { cellDate, dateKey: `${y}-${m}-${d}` };
  };

  const handleCellClick = (dayName, time) => {
    const { dateKey } = getCellDate(dayName);
    setSelectedSlot({ date: dateKey, time, status: "scheduled" });
    setIsModalOpen(true);
  };

  // ─── handleSaveAppointment ────────────────────────────────────────────────────
  // La validación de solapamiento la hace el hook con operadores estrictos (< y >)
  // lo que permite citas consecutivas. No hay validación local redundante.
  const handleSaveAppointment = async (appointmentData) => {
    const d = new Date(appointmentData.date);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const datePart = `${y}-${mo}-${day}`;
    const timePart =
      appointmentData.time || `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    const isEditing = !!appointmentData.id;

    const payload = {
      ...appointmentData,
      date: `${datePart}T${timePart}:00`,
    };

    const res = isEditing ? await updateAppointment(appointmentData.id, payload) : await addAppointment(payload);

    if (res.success) {
      setIsModalOpen(false);
      setSelectedSlot(null);
      notifySuccess(isEditing ? t("appointment.msgSaveSuccess") : t("appointment.msgSuccess"));
      await fetchAppointments();
      return;
    }

    // El hook devuelve conflict: true cuando hay solapamiento real
    // y un mensaje con el nombre del paciente y el horario exacto
    notifyError(res.error || t("appointment.msgError"));
  };

  const handleAddAppointment = () => {
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = async (e, id) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    notifyConfirm(t("appointment.confirmDeleteTitle"), t("appointment.confirmDeleteDescription"), async () => {
      const res = await deleteAppointment(id);
      if (res.success) {
        notifySuccess(t("appointment.msgDeleteSuccess"));
        setActiveMenu(null);
      } else {
        notifyError(t("appointment.msgErrorDelete"));
      }
    });
  };

  const handleReschedule = (e, appointment) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    const d = new Date(appointment.date);
    const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setSelectedSlot({
      ...appointment,
      id: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientImage: appointment.patientImage,
      date: localDate,
      time: appointment.time,
      duration: String(appointment.duration).replace(" min", ""),
      treatment: appointment.treatment,
    });
    setIsModalOpen(true);
  };

  const statusLegend = [
    { label: t("common.status.scheduled"), status: "scheduled" },
    { label: t("common.status.confirmed"), status: "confirmed" },
    { label: t("common.status.pending"), status: "pending" },
    { label: t("common.status.inProgress"), status: "in-progress" },
    { label: t("common.status.completed"), status: "completed" },
    { label: t("common.status.cancelled"), status: "cancelled" },
    { label: t("common.status.noShow"), status: "no-show" },
  ];

  const getStatusStyles = (status) => {
    const styles = {
      scheduled: "bg-blue-100 border-blue-500 text-blue-700",
      confirmed: "bg-emerald-100 border-emerald-500 text-emerald-700",
      pending: "bg-amber-100 border-amber-500 text-amber-700",
      "in-progress": "bg-purple-100 border-purple-500 text-purple-700",
      completed: "bg-slate-100 border-slate-400 text-slate-600",
      cancelled: "bg-red-100 border-red-500 text-red-700",
      "no-show": "bg-gray-100 border-gray-400 text-gray-500",
      default: "bg-primary/15 border-primary text-primary-dark",
    };
    return styles[status] || styles.default;
  };

  const touchDevice = isTouchDevice();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-headline font-bold text-foreground">{t("calendar.title")}</h1>
            <p className="text-muted-foreground">{t("calendar.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="tertiary" size="sm" iconName="ChevronLeft" />
            <Button variant="tertiary" size="sm" iconName="ChevronRight" />
            <Button variant="default" size="sm" iconName="Plus" onClick={handleAddAppointment}>
              {t("calendar.newAppointment")}
            </Button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="w-full bg-muted/5 border-y border-border px-6 py-3">
          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3">
            {statusLegend.map((item) => (
              <div key={item.status} className="flex items-center gap-2 group">
                <span
                  className={`w-3 h-3 rounded-full border shadow-sm transition-transform group-hover:scale-110
                    ${getStatusStyles(item.status).split(" ")[1]}
                    ${getStatusStyles(item.status).split(" ")[0]}`}
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grilla */}
        <div className="clinical-card overflow-hidden border-none shadow-xl">
          <div className="overflow-x-auto">
            {/* Cabecera días */}
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(6,1fr)] border-b border-border bg-muted/30">
              <div className="p-4 border-r border-border" />
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-4 text-center font-semibold text-sm text-foreground border-r border-border last:border-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Cuerpo */}
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(6,1fr)]">
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div
                    className={`p-2 text-xs font-medium text-muted-foreground text-right pr-4 border-r border-border flex items-center justify-end ${time.endsWith(":00") ? "bg-muted/20" : ""}`}
                  >
                    {time.endsWith(":00") || time.endsWith(":30") ? time : ""}
                  </div>

                  {daysOfWeek.map((day) => {
                    const { dateKey } = getCellDate(day);
                    const appointment = appointmentsMap[`${dateKey}-${time}`];

                    return (
                      <div
                        key={`${day}-${time}`}
                        onClick={() => !appointment && handleCellClick(day, time)}
                        className={`h-12 border-r border-b border-border relative group transition-all
                          ${appointment ? "z-10" : "hover:bg-primary/5 cursor-pointer"}
                          ${time.endsWith(":00") ? "border-b-muted-foreground/20" : "border-b-border/50"}`}
                      >
                        {appointment && (
                          <AppointmentCard
                            appointment={appointment}
                            onReschedule={handleReschedule}
                            onDelete={handleDeleteAppointment}
                            isTouchDevice={touchDevice}
                            setActiveMenu={setActiveMenu}
                          />
                        )}
                        {!appointment && (
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center">
                            <Icon name="Plus" size={14} className="text-primary/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScheduleAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSave={handleSaveAppointment}
        initialData={selectedSlot}
        isLoading={isSaving}
      />

      <MobileActionSheet
        appointment={activeMenu}
        onReschedule={handleReschedule}
        onDelete={handleDeleteAppointment}
        onClose={() => setActiveMenu(null)}
      />
    </>
  );
};

export default WeeklyCalendar;
