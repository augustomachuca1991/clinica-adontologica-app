export const STATUS_CONFIG = {
  scheduled: { label: "Programado", bg: "bg-indigo-50", border: "border-l-indigo-500", text: "text-indigo-700" },
  confirmed: { label: "Confirmado", bg: "bg-emerald-50", border: "border-l-emerald-500", text: "text-emerald-700" },
  pending: { label: "Pendiente", bg: "bg-amber-50", border: "border-l-amber-500", text: "text-amber-700" },
  in_progress: { label: "En curso", bg: "bg-violet-50", border: "border-l-violet-500", text: "text-violet-700" },
  completed: { label: "Completado", bg: "bg-slate-100", border: "border-l-slate-400", text: "text-slate-600" },
  cancelled: { label: "Cancelado", bg: "bg-red-50", border: "border-l-red-500", text: "text-red-700" },
  no_show: { label: "Ausente", bg: "bg-gray-100", border: "border-l-gray-400", text: "text-gray-500" },
};

export const ALLOWED_TRANSITIONS = {
  scheduled: ["confirmed", "pending", "cancelled"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "no_show"],
  completed: [],
  cancelled: [],
  no_show: [],
};
