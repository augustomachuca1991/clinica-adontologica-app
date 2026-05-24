import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useAppointments } from "@/hooks/AppointmentsHooks";
import ScheduleAppointmentModal from "@/pages/dashboard/components/ScheduleAppointmentModal";
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
    { label: t("appointment.status.scheduled"), status: "scheduled" },
    { label: t("appointment.status.confirmed"), status: "confirmed" },
    { label: t("appointment.status.pending"), status: "pending" },
    { label: t("appointment.status.in-progress"), status: "in-progress" },
    { label: t("appointment.status.completed"), status: "completed" },
    { label: t("appointment.status.cancelled"), status: "cancelled" },
    { label: t("appointment.status.no-show"), status: "no-show" },
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
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              isTouchDevice() ? setActiveMenu(appointment) : handleReschedule(e, appointment);
                            }}
                            className={`absolute inset-x-1 top-1 rounded-md border-l-4 p-1.5 overflow-hidden shadow-md animate-in fade-in zoom-in duration-200 group/appt ${getStatusStyles(appointment.status)}`}
                            style={{ height: `${(parseInt(appointment.duration) / 15) * 48 - 4}px`, zIndex: 20 }}
                          >
                            <div className="absolute right-1 top-1 hidden lg:flex flex-col gap-1 opacity-0 group-hover/appt:opacity-100 transition-opacity z-30">
                              <button
                                onClick={(e) => handleReschedule(e, appointment)}
                                className="p-1 bg-white/80 hover:bg-white rounded shadow-sm text-blue-600 transition-colors"
                              >
                                <Icon name="CalendarClock" size={12} />
                              </button>
                              <button
                                onClick={(e) => handleDeleteAppointment(e, appointment.id)}
                                className="p-1 bg-white/80 hover:bg-red-50 rounded shadow-sm text-red-600 transition-colors"
                              >
                                <Icon name="Trash2" size={12} />
                              </button>
                            </div>
                            <div className="flex flex-col h-full pr-4">
                              <div className="flex items-center gap-1 mb-0.5">
                                <Icon name="Clock" size={8} />
                                <span className="text-[8px] font-bold uppercase tracking-wider italic">
                                  {appointment.time}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold truncate leading-tight">{appointment.patientName}</p>
                              <p className="text-[9px] opacity-90 truncate leading-tight italic">
                                {appointment.treatment}
                              </p>
                              {parseInt(appointment.duration) > 30 && (
                                <div className="mt-auto pt-1 border-t border-current/10 flex justify-between items-center">
                                  <span className="text-[8px] font-medium">{appointment.duration} min</span>
                                  <Icon name="CheckCircle" size={10} className="opacity-50" />
                                </div>
                              )}
                            </div>
                          </div>
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

      {/* Mobile action sheet */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setActiveMenu(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="User" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black leading-tight">{activeMenu.patientName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeMenu.time} - {activeMenu.treatment}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <Button
                variant="outline"
                className="justify-start h-14 text-base font-medium border-gray-200"
                onClick={() => {
                  handleReschedule(null, activeMenu);
                  setActiveMenu(null);
                }}
              >
                <Icon name="CalendarClock" size={20} className="mr-3 text-blue-600" />
                {t("appointment.reschedule") || "Reprogramar Cita"}
              </Button>
              <Button
                variant="outline"
                className="justify-start h-14 text-base font-medium text-red-600 border-red-100 hover:bg-red-50"
                onClick={() => {
                  handleDeleteAppointment({ stopPropagation: () => {} }, activeMenu.id);
                  setActiveMenu(null);
                }}
              >
                <Icon name="Trash2" size={20} className="mr-3" />
                {t("delete") || "Eliminar Cita"}
              </Button>
              <button
                className="w-full py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setActiveMenu(null)}
              >
                {t("cancel") || "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyCalendar;
