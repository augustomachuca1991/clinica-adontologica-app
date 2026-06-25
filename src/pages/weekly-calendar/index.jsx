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

const getWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WeeklyCalendar = () => {
  const { t } = useTranslation();
  const {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
    loading: isSaving,
  } = useAppointments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [weekStart, setWeekStart] = useState(getWeekStart);
  const [mobileDayIndex, setMobileDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 0 : Math.min(today - 1, 5);
  });

  const timeSlots = Array.from({ length: 34 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 15;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });

  const DAY_NAMES_SHORT = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];

  const weekDates = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const appointmentsMap = useMemo(() => {
    const map = {};
    appointments.forEach((appt) => {
      const d = appt.date;
      if (isNaN(d.getTime())) return;
      const dateKey = fmt(d);
      const timeKey = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      map[`${dateKey}-${timeKey}`] = appt;
    });
    return map;
  }, [appointments]);

  const navigateWeek = (dir) => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + dir * 7);
      return d;
    });
  };

  const goToToday = () => {
    setWeekStart(getWeekStart());
    const today = new Date().getDay();
    setMobileDayIndex(today === 0 ? 0 : Math.min(today - 1, 5));
  };

  const handleCellClick = (dateKey, time) => {
    setSelectedSlot({ date: dateKey, time, status: "scheduled" });
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointmentData) => {
    const d = new Date(appointmentData.date);
    const datePart = fmt(d);
    const timePart =
      appointmentData.time || `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const isEditing = !!appointmentData.id;
    const payload = { ...appointmentData, date: `${datePart}T${timePart}:00` };
    const res = isEditing ? await updateAppointment(appointmentData.id, payload) : await addAppointment(payload);
    if (res.success) {
      setIsModalOpen(false);
      setSelectedSlot(null);
      notifySuccess(isEditing ? t("appointment.msgSaveSuccess") : t("appointment.msgSuccess"));
      await fetchAppointments();
      return;
    }
    notifyError(res.error || t("appointment.msgError"));
  };

  const handleDeleteAppointment = async (e, id) => {
    if (e?.stopPropagation) e.stopPropagation();
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
    if (e?.stopPropagation) e.stopPropagation();
    const d = new Date(appointment.date);
    setSelectedSlot({
      ...appointment,
      date: fmt(d),
      duration: String(appointment.duration).replace(" min", ""),
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateStatus(id, newStatus);
    if (res.success) {
      notifySuccess(t("appointment.msgStatusUpdated"));
    } else {
      notifyError(res.error);
    }
  };

  const touchDevice = isTouchDevice();
  const todayKey = fmt(new Date());

  // ── Columna de horas — compartida desktop y mobile ──
  const TimeColumn = () => (
    <div>
      {timeSlots.map((time) => (
        <div key={time} className={`h-12 relative border-r border-border ${time.endsWith(":00") ? "bg-muted/10" : ""}`}>
          {time.endsWith(":00") && (
            <span className="absolute top-0 right-2 -translate-y-1/2 text-[10px] text-muted-foreground tabular-nums bg-background px-0.5 leading-none">
              {time}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  // ── Columna de un día — compartida desktop y mobile ──
  const DayColumn = ({ date }) => {
    const dateKey = fmt(date);
    const isToday = dateKey === todayKey;
    return (
      <div className="flex flex-col">
        {timeSlots.map((time) => {
          const appointment = appointmentsMap[`${dateKey}-${time}`];
          return (
            <div
              key={time}
              onClick={() => !appointment && handleCellClick(dateKey, time)}
              className={`
                h-12 border-b border-r border-border relative
                ${time.endsWith(":00") ? "border-b-muted-foreground/20" : "border-b-border/40"}
                ${appointment ? "z-10" : "hover:bg-primary/5 cursor-pointer group"}
                ${isToday ? "bg-primary/[0.02]" : ""}
              `}
            >
              {appointment && (
                <AppointmentCard
                  appointment={appointment}
                  onReschedule={handleReschedule}
                  onDelete={handleDeleteAppointment}
                  onStatusChange={handleStatusChange}
                  isTouchDevice={touchDevice}
                  setActiveMenu={setActiveMenu}
                />
              )}
              {!appointment && (
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Icon name="Plus" size={14} className="text-primary/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const monthLabel = weekDates[0].toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-headline font-bold text-foreground capitalize">{monthLabel}</h1>
            <p className="text-muted-foreground text-sm">{t("calendar.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="sm" onClick={goToToday}>
              Hoy
            </Button>
            <Button variant="tertiary" size="sm" iconName="ChevronLeft" onClick={() => navigateWeek(-1)} />
            <Button variant="tertiary" size="sm" iconName="ChevronRight" onClick={() => navigateWeek(1)} />
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              onClick={() => {
                setSelectedSlot(null);
                setIsModalOpen(true);
              }}
            >
              {t("calendar.newAppointment")}
            </Button>
          </div>
        </div>

        {/* ── Leyenda ── */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-1">
          {[
            { label: t("common.status.scheduled"), color: "bg-indigo-400" },
            { label: t("common.status.confirmed"), color: "bg-emerald-400" },
            { label: t("common.status.pending"), color: "bg-amber-400" },
            { label: t("common.status.inProgress"), color: "bg-violet-400" },
            { label: t("common.status.completed"), color: "bg-slate-400" },
            { label: t("common.status.cancelled"), color: "bg-red-400" },
            { label: t("common.status.noShow"), color: "bg-gray-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${item.color}`} />
              <span className="text-[11px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP — grilla completa
        ══════════════════════════════════════════ */}
        <div className="hidden md:block clinical-card overflow-hidden border-none shadow-xl">
          <div className="overflow-x-auto">
            {/* Cabecera días */}
            <div className="min-w-[700px] grid grid-cols-[56px_repeat(6,1fr)] border-b border-border bg-muted/20">
              <div className="border-r border-border" />
              {weekDates.map((date, i) => {
                const isToday = fmt(date) === todayKey;
                return (
                  <div
                    key={i}
                    className={`p-3 text-center border-r border-border last:border-0 ${isToday ? "bg-primary/5" : ""}`}
                  >
                    <span
                      className={`block text-[11px] font-medium uppercase tracking-wide ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {DAY_NAMES_SHORT[i]}
                    </span>
                    <span
                      className={`block text-lg font-semibold leading-tight mt-0.5 ${
                        isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cuerpo */}
            <div className="min-w-[700px] grid grid-cols-[56px_repeat(6,1fr)]">
              <TimeColumn />
              {weekDates.map((date, i) => (
                <DayColumn key={i} date={date} />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE — un día a la vez
        ══════════════════════════════════════════ */}
        <div className="md:hidden">
          {/* Selector de día */}
          <div className="grid grid-cols-6 gap-1 mb-3">
            {weekDates.map((date, i) => {
              const isToday = fmt(date) === todayKey;
              const isActive = i === mobileDayIndex;
              return (
                <button
                  key={i}
                  onClick={() => setMobileDayIndex(i)}
                  className={`
                    flex flex-col items-center py-2 px-1 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                    }
                  `}
                >
                  <span className="text-[10px] font-medium uppercase">{DAY_NAMES_SHORT[i].slice(0, 3)}</span>
                  <span className="text-base font-semibold leading-tight">{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          {/* Grilla del día seleccionado */}
          <div className="clinical-card overflow-hidden border-none shadow-md">
            <div className="grid grid-cols-[48px_1fr]">
              <TimeColumn />
              <DayColumn date={weekDates[mobileDayIndex]} />
            </div>
          </div>

          {/* Navegación semana */}
          <div className="flex items-center justify-between mt-3 px-1">
            <button
              onClick={() => navigateWeek(-1)}
              className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Icon name="ChevronLeft" size={16} />
              Semana anterior
            </button>
            <button onClick={goToToday} className="text-sm text-primary font-medium">
              Hoy
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Semana siguiente
              <Icon name="ChevronRight" size={16} />
            </button>
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
        onStatusChange={handleStatusChange}
        onClose={() => setActiveMenu(null)}
      />
    </>
  );
};

export default WeeklyCalendar;
