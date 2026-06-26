export const STATUS_CONFIG = {
  scheduled: { label: "Programado", bg: "bg-indigo-500/10", border: "border-l-indigo-400", text: "text-indigo-300" },
  confirmed: { label: "Confirmado", bg: "bg-emerald-500/10", border: "border-l-emerald-400", text: "text-emerald-300" },
  pending: { label: "Pendiente", bg: "bg-amber-500/10", border: "border-l-amber-400", text: "text-amber-300" },
  in_progress: { label: "En curso", bg: "bg-violet-500/10", border: "border-l-violet-400", text: "text-violet-300" },
  completed: { label: "Completado", bg: "bg-slate-500/10", border: "border-l-slate-400", text: "text-slate-300" },
  cancelled: { label: "Cancelado", bg: "bg-red-500/10", border: "border-l-red-400", text: "text-red-300" },
  no_show: { label: "Ausente", bg: "bg-gray-500/10", border: "border-l-gray-500", text: "text-gray-400" },
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
