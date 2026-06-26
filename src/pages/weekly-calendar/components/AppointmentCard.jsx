import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import { STATUS_CONFIG, ALLOWED_TRANSITIONS } from "@/utils/appointmentStatuses";

const getStatusStyles = (status) => {
  const styles = {
    scheduled: "bg-blue-100 border-blue-500 text-blue-700",
    confirmed: "bg-emerald-100 border-emerald-500 text-emerald-700",
    pending: "bg-amber-100 border-amber-500 text-amber-700",
    in_progress: "bg-purple-100 border-purple-500 text-purple-700",
    completed: "bg-slate-100 border-slate-400 text-slate-600",
    cancelled: "bg-red-100 border-red-500 text-red-700",
    no_show: "bg-gray-100 border-gray-400 text-gray-500",
    default: "bg-primary/15 border-primary text-primary-dark",
  };
  return styles[status] || styles.default;
};

const AppointmentCard = ({ appointment, onReschedule, onDelete, onStatusChange, isTouchDevice, setActiveMenu }) => {
  const { t } = useTranslation();
  const status = (appointment?.status || "scheduled").replace(/-/g, "_");
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.scheduled;
  const transitions = ALLOWED_TRANSITIONS[status] ?? [];
  const isTerminal = transitions.length === 0;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  const handleStatusChange = (newStatus) => {
    setShowMenu(false);
    onStatusChange?.(appointment.id, newStatus);
  };

  const handleRescheduleClick = (e) => {
    e.stopPropagation();
    onReschedule(e, appointment);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(e, appointment.id);
  };

  const handleBadgeClick = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        isTouchDevice ? setActiveMenu(appointment) : onReschedule(e, appointment);
      }}
      className={`absolute inset-x-1 top-1 rounded-md border-l-4 p-1.5 overflow-hidden shadow-md animate-in fade-in zoom-in duration-200 group/appt ${getStatusStyles(status)}`}
      style={{ height: `${(parseInt(appointment.duration) / 15) * 48 - 4}px`, zIndex: 20 }}
    >
      <div className="absolute right-1 top-1 hidden lg:flex flex-col gap-1 opacity-0 group-hover/appt:opacity-100 transition-opacity z-30">
        <button
          onClick={handleRescheduleClick}
          className="p-1 bg-white/80 hover:bg-white rounded shadow-sm text-blue-600 transition-colors"
        >
          <Icon name="CalendarClock" size={12} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1 bg-white/80 hover:bg-red-50 rounded shadow-sm text-red-600 transition-colors"
        >
          <Icon name="Trash2" size={12} />
        </button>
      </div>
      <div className="flex flex-col h-full pr-4">
        <div className="flex items-center gap-1 mb-0.5">
          <Icon name="Clock" size={8} />
          <span className="text-[8px] font-bold uppercase tracking-wider italic">{appointment.time}</span>
        </div>
        <p className="text-[10px] font-bold truncate leading-tight">{appointment.patientName}</p>
        <p className="text-[9px] opacity-90 truncate leading-tight italic">{appointment.treatment}</p>
        {parseInt(appointment.duration) > 30 && (
          <div className="mt-auto pt-1 border-t border-current/10 flex justify-between items-center" ref={menuRef}>
            <span className="text-[8px] font-medium">{appointment.duration} min</span>
            {!isTerminal ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleBadgeClick}
                  className={`flex items-center gap-0.5 text-[8px] font-medium rounded-sm px-1 py-0.5 cursor-pointer border-none ${cfg.bg} ${cfg.text} hover:opacity-80 transition-opacity`}
                >
                  {t(`common.status.${status}`)}
                  <Icon name="ChevronDown" size={8} />
                </button>
                {showMenu && (
                  <div className="absolute bottom-full right-0 mb-1 min-w-[90px] bg-white border border-border rounded-md shadow-lg py-1 z-50">
                    {transitions.map((s) => {
                      const tcfg = STATUS_CONFIG[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(s); }}
                          className={`w-full text-left text-[11px] font-medium px-2.5 py-1.5 hover:bg-accent transition-colors ${tcfg.text}`}
                        >
                          {t(`common.status.${s}`)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <span className={`text-[8px] font-medium ${cfg.text}`}>{t(`common.status.${status}`)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
