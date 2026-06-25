import React from "react";
import { useTranslation } from "react-i18next";
import { STATUS_CONFIG, ALLOWED_TRANSITIONS } from "@/utils/appointmentStatuses";

const AppointmentCard = ({ appointment, onReschedule, onDelete, onStatusChange, isTouchDevice, setActiveMenu }) => {
  const { t } = useTranslation();

  const status = appointment?.status ?? "scheduled";
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.scheduled;
  const transitions = ALLOWED_TRANSITIONS[status] ?? [];
  const isTerminal = transitions.length === 0;

  // Altura en celdas: cada celda = 15 min = 48px
  const durationMin = appointment?.duration ?? 30;
  const cellsSpanned = Math.max(1, Math.round(durationMin / 15));
  const cardHeight = cellsSpanned * 48 - 4; // -4 para el gap visual

  const stop = (e) => e.stopPropagation();

  const handleStatusChange = (e) => {
    stop(e);
    onStatusChange?.(appointment.id, e.target.value);
  };

  const handleCardClick = (e) => {
    if (isTouchDevice) {
      stop(e);
      setActiveMenu?.(appointment);
    }
  };

  const showActions = !isTouchDevice && !isTerminal && cardHeight >= 72;

  return (
    <div
      onClick={handleCardClick}
      className={`
        absolute left-0.5 right-0.5 top-0.5 rounded overflow-hidden z-10
        border-l-[3px] ${cfg.border} ${cfg.bg}
        ${status === "cancelled" ? "opacity-60" : ""}
        ${status === "no-show" ? "opacity-50" : ""}
        transition-all duration-150
        ${!isTerminal ? "cursor-pointer group/card" : "cursor-default"}
      `}
      style={{ height: `${cardHeight}px` }}
    >
      {/* ── Fila superior: nombre + estado ── */}
      <div className="flex items-start justify-between gap-1 px-2 pt-1">
        <span className={`text-[11px] font-semibold leading-tight truncate ${cfg.text}`}>
          {appointment?.patientName ?? "—"}
        </span>

        {!isTerminal ? (
          <select
            value={status}
            onClick={stop}
            onChange={handleStatusChange}
            className={`
              text-[10px] font-medium rounded px-1 py-0.5 flex-shrink-0
              border-none outline-none cursor-pointer
              ${cfg.bg} ${cfg.text}
            `}
          >
            <option value={status}>{cfg.label}</option>
            {transitions.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        ) : (
          <span className={`text-[10px] font-medium flex-shrink-0 ${cfg.text}`}>{cfg.label}</span>
        )}
      </div>

      {/* ── Tratamiento ── */}
      {cardHeight >= 64 && (
        <div className={`px-2 mt-0.5 text-[10px] leading-tight truncate ${cfg.text} opacity-75`}>
          {appointment?.treatment}
          {appointment?.duration ? ` · ${appointment.duration} min` : ""}
        </div>
      )}

      {/* ── Hora (solo si hay espacio suficiente) ── */}
      {cardHeight >= 96 && <div className={`px-2 mt-1 text-[10px] ${cfg.text} opacity-60`}>{appointment?.time}</div>}

      {/* ── Acciones: solo desktop, solo si hay altura suficiente ── */}
      {showActions && (
        <div
          className={`
            absolute bottom-0 inset-x-0 flex gap-1 px-1.5 pb-1.5
            opacity-0 group-hover/card:opacity-100
            transition-opacity duration-150
          `}
        >
          <button
            onClick={(e) => {
              stop(e);
              onReschedule(e, appointment);
            }}
            className={`
              flex-1 text-[10px] font-medium rounded px-1.5 py-1 text-center
              ${cfg.text} bg-white/70 hover:bg-white transition-colors
            `}
          >
            {t("appointment.reschedule")}
          </button>
          <button
            onClick={(e) => {
              stop(e);
              onDelete(e, appointment.id);
            }}
            className="text-[10px] font-medium rounded px-2 py-1 text-red-600 bg-white/70 hover:bg-red-50 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
