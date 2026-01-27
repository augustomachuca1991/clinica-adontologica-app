import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useAppointments } from "../../hooks/AppointmentsHooks";
import ScheduleAppointmentModal from "../dashboard/components/ScheduleAppointmentModal";
import { notifyError, notifySuccess } from "../../utils/notifications";

const WeeklyCalendar = () => {
  const { t } = useTranslation();
  const { appointments, addAppointment, fetchAppointments, loading: isSaving } = useAppointments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Definición de bloques horarios
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

  const daysOfWeek = [t("days.monday"), t("days.tuesday"), t("days.wednesday"), t("days.thursday"), t("days.friday"), t("days.saturday")];

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getAvailableTime = (selectedDate, selectedTime) => {
    if (!selectedTime) return 0;

    const [selH, selM] = selectedTime.split(":").map(Number);
    const selectedStart = selH * 60 + selM;

    const dayAppointments = appointments
      .filter((appt) => {
        const d = new Date(appt.date);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        return dateStr === selectedDate;
      })
      .map((appt) => {
        const d = new Date(appt.date);
        const start = d.getHours() * 60 + d.getMinutes();
        return {
          start,
          end: start + (parseInt(appt.duration) || 30),
          patient: appt.patientName,
        };
      })
      .sort((a, b) => a.start - b.start);

    // 1. ¿Hay alguien ocupando ESTE minuto exacto?
    const collision = dayAppointments.find((appt) => selectedStart >= appt.start && selectedStart < appt.end);

    if (collision) {
      // Retornamos un objeto para dar un mensaje más claro
      return { available: 0, conflictWith: collision.patient };
    }

    // 2. ¿Cuánto falta para la siguiente?
    const nextAppt = dayAppointments.find((appt) => appt.start > selectedStart);
    return {
      available: nextAppt ? nextAppt.start - selectedStart : 1440,
      conflictWith: null,
    };
  };

  const appointmentsMap = useMemo(() => {
    const map = {};
    if (!appointments || appointments.length === 0) return map;

    appointments.forEach((appt) => {
      const d = appt.date;

      // Verificamos que la fecha sea válida antes de mapear
      if (isNaN(d.getTime())) {
        console.error("Fecha inválida detectada en appt:", appt);
        return;
      }

      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const timeKey = `${hours}:${minutes}`;

      const fullKey = `${dateKey}-${timeKey}`;
      map[fullKey] = appt;
    });

    return map;
  }, [appointments]);

  const handleCellClick = (dayName, time) => {
    // Calculamos la fecha real basándonos en el día de la semana actual
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 (Dom) a 6 (Sab)

    // Mapeo de tus nombres de días a índices (ajustar según tus daysOfWeek)
    const dayMap = {
      [t("days.monday")]: 1,
      [t("days.tuesday")]: 2,
      [t("days.wednesday")]: 3,
      [t("days.thursday")]: 4,
      [t("days.friday")]: 5,
      [t("days.saturday")]: 6,
    };

    const targetDayIndex = dayMap[dayName];
    const diff = targetDayIndex - (currentDayIndex === 0 ? 7 : currentDayIndex); // Ajuste si hoy es domingo

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    // Seteamos los datos iniciales para el modal
    setSelectedSlot({
      date: targetDate.toISOString().split("T")[0],
      time: time,
      status: "scheduled",
    });

    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (appointmentData) => {
    // En lugar de hacer split al string ISO (que es UTC),
    // creamos un objeto Date para obtener la hora LOCAL
    const localDate = new Date(appointmentData.date);

    // Extraemos año-mes-día local
    const datePart = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

    // Extraemos hora:minuto local
    const timePart = `${String(localDate.getHours()).padStart(2, "0")}:${String(localDate.getMinutes()).padStart(2, "0")}`;

    console.log("Validando Localmente:", datePart, timePart); // Aquí verás que ya no hay desfase

    const resultValidation = getAvailableTime(datePart, timePart);
    const requestedMin = parseInt(appointmentData.duration);

    if (resultValidation.available === 0) {
      notifyError(`Horario ocupado: El paciente ${resultValidation.conflictWith} ya tiene turno a esa hora.`);
      return;
    }

    if (requestedMin > resultValidation.available) {
      notifyError(`Conflicto: Solo tienes ${resultValidation.available} min disponibles antes del siguiente turno.`);
      return;
    }

    try {
      // IMPORTANTE: Antes de enviar al hook, le pasamos la fecha local formateada
      // para que el hook no reciba el string "Z" (UTC)
      const res = await addAppointment({
        ...appointmentData,
        date: `${datePart}T${timePart}:00`,
      });

      if (res.success) {
        setIsModalOpen(false);
        notifySuccess(t("appointment.msgSuccess"));
        await fetchAppointments();
      }
    } catch (error) {
      notifyError("Error al guardar");
    }
  };

  const statusLegend = [
    { label: t("appointment.status.scheduled"), class: "bg-blue-100 border-blue-500 text-blue-700", status: "scheduled" },
    { label: t("appointment.status.confirmed"), class: "bg-emerald-100 border-emerald-500 text-emerald-700", status: "confirmed" },
    { label: t("appointment.status.pending"), class: "bg-amber-100 border-amber-500 text-amber-700", status: "pending" },
    { label: t("appointment.status.in-progress"), class: "bg-purple-100 border-purple-500 text-purple-700", status: "in-progress" },
    { label: t("appointment.status.completed"), class: "bg-slate-100 border-slate-400 text-slate-600", status: "completed" },
    { label: t("appointment.status.cancelled"), class: "bg-red-100 border-red-500 text-red-700", status: "cancelled" },
    { label: t("appointment.status.no-show"), class: "bg-gray-100 border-gray-400 text-gray-500", status: "no-show" },
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

  const statusColors = {
    scheduled: "bg-blue-100 border-blue-500 text-blue-700",
    confirmed: "bg-emerald-100 border-emerald-500 text-emerald-700",
    cancelled: "bg-red-100 border-red-500 text-red-700",
    completed: "bg-slate-100 border-slate-400 text-slate-600",
    default: "bg-primary/15 border-primary text-primary-dark",
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header del Calendario */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-headline font-bold text-foreground">{t("calendar.title")}</h1>
            <p className="text-muted-foreground">{t("calendar.subtitle")}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="tertiary" size="sm" iconName="ChevronLeft" />
            <Button variant="tertiary" size="sm" iconName="ChevronRight" />
            <Button variant="default" size="sm" iconName="Plus">
              {t("calendar.newAppointment")}
            </Button>
          </div>
        </div>

        <div className="w-full bg-muted/5 border-y border-border px-6 py-3">
          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3">
            {statusLegend.map((item) => (
              <div key={item.status} className="flex items-center gap-2 group">
                <span
                  className={`w-3 h-3 rounded-full border shadow-sm transition-transform group-hover:scale-110 
            ${getStatusStyles(item.status).split(" ")[1]} 
            ${getStatusStyles(item.status).split(" ")[0]}`}
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="clinical-card overflow-hidden border-none shadow-xl">
          {/* Grid Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(6,1fr)] border-b border-border bg-muted/30">
              {/* Esquina vacía */}
              <div className="p-4 border-r border-border"></div>
              {/* Cabecera de Días */}
              {daysOfWeek.map((day) => (
                <div key={day} className="p-4 text-center font-semibold text-sm text-foreground border-r border-border last:border-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Cuerpo de la Grilla */}
            <div className="min-w-[800px] grid grid-cols-[80px_repeat(6,1fr)]">
              {timeSlots.map((time, index) => (
                <React.Fragment key={time}>
                  {/* Columna de Horas */}
                  <div className={`p-2 text-xs font-medium text-muted-foreground text-right pr-4 border-r border-border flex items-center justify-end ${time.endsWith(":00") ? "bg-muted/20" : ""}`}>
                    {time.endsWith(":00") || time.endsWith(":30") ? time : ""}
                  </div>

                  {/* Celdas de Días */}
                  {daysOfWeek.map((day, dayIndex) => {
                    const today = new Date();
                    const currentDayIndex = today.getDay();

                    const dayMap = {
                      [t("days.monday")]: 1,
                      [t("days.tuesday")]: 2,
                      [t("days.wednesday")]: 3,
                      [t("days.thursday")]: 4,
                      [t("days.friday")]: 5,
                      [t("days.saturday")]: 6,
                    };

                    const targetDayIndex = dayMap[day];
                    const diff = targetDayIndex - (currentDayIndex === 0 ? 7 : currentDayIndex);

                    const cellDate = new Date(today);
                    cellDate.setDate(today.getDate() + diff);

                    // Formatear manualmente a local YYYY-MM-DD
                    const y = cellDate.getFullYear();
                    const m = String(cellDate.getMonth() + 1).padStart(2, "0");
                    const d = String(cellDate.getDate()).padStart(2, "0");
                    const dateKey = `${y}-${m}-${d}`;

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
                            className={`absolute inset-x-1 top-1 rounded-md border-l-4 p-1.5 overflow-hidden shadow-md animate-in fade-in zoom-in duration-200 
      ${statusColors[appointment.status] || statusColors.default}`}
                            style={{
                              height: `${(parseInt(appointment.duration) / 15) * 48 - 4}px`,
                              zIndex: 20,
                            }}
                          >
                            <div className="flex flex-col h-full">
                              {/* Nueva línea de tiempo: ahora más visible */}
                              <div className="flex items-center gap-1 mb-0.5">
                                <Icon name="Clock" size={8} />
                                <span className="text-[8px] font-bold uppercase tracking-wider italic">{appointment.time}</span>
                              </div>

                              <p className="text-[10px] font-bold truncate leading-tight">{appointment.patientName}</p>

                              <p className="text-[9px] opacity-90 truncate leading-tight italic">{appointment.treatment}</p>

                              {parseInt(appointment.duration) > 30 && (
                                <div className="mt-auto pt-1 border-t border-current/10 flex justify-between items-center">
                                  <span className="text-[8px] font-medium">{appointment.duration}</span>
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
    </>
  );
};

export default WeeklyCalendar;
