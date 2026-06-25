import React from "react";
import Icon from "@/components/AppIcon";

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

const AppointmentCard = ({ appointment, onReschedule, onDelete, isTouchDevice, setActiveMenu }) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      isTouchDevice ? setActiveMenu(appointment) : onReschedule(e, appointment);
    }}
    className={`absolute inset-x-1 top-1 rounded-md border-l-4 p-1.5 overflow-hidden shadow-md animate-in fade-in zoom-in duration-200 group/appt ${getStatusStyles(appointment.status)}`}
    style={{ height: `${(parseInt(appointment.duration) / 15) * 48 - 4}px`, zIndex: 20 }}
  >
    <div className="absolute right-1 top-1 hidden lg:flex flex-col gap-1 opacity-0 group-hover/appt:opacity-100 transition-opacity z-30">
      <button
        onClick={(e) => onReschedule(e, appointment)}
        className="p-1 bg-white/80 hover:bg-white rounded shadow-sm text-blue-600 transition-colors"
      >
        <Icon name="CalendarClock" size={12} />
      </button>
      <button
        onClick={(e) => onDelete(e, appointment.id)}
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
        <div className="mt-auto pt-1 border-t border-current/10 flex justify-between items-center">
          <span className="text-[8px] font-medium">{appointment.duration} min</span>
          <Icon name="CheckCircle" size={10} className="opacity-50" />
        </div>
      )}
    </div>
  </div>
);

export default AppointmentCard;
