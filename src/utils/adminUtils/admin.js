// ─── Avatar helpers ───────────────────────────────────────────────
export function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-800",
  "bg-emerald-100 text-emerald-800",
  "bg-orange-100 text-orange-800",
  "bg-blue-100 text-blue-800",
  "bg-pink-100 text-pink-800",
];

export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ─── Date helpers ─────────────────────────────────────────────────
export function daysLeft(iso) {
  return Math.ceil((new Date(iso) - new Date()) / 86400000);
}

export function fmtDate(iso, lng) {
  return new Date(iso).toLocaleDateString(lng, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateTime(iso, lng) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString(lng, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Subscription status ──────────────────────────────────────────
export function getSubscriptionStatus(subscription, t) {
  const hoy = new Date();
  const finPeriodo = new Date(subscription.current_period_end);
  const diferenciaTiempo = hoy - finPeriodo;
  const diasVencido = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

  if (hoy <= finPeriodo) {
    const diasRestantes = Math.ceil((finPeriodo - hoy) / (1000 * 60 * 60 * 24));
    return {
      key: "active",
      texto: t("common.status.active"),
      claseBg: "bg-emerald-100 text-emerald-800",
      claseCirculo: "bg-emerald-500",
      textoDias: t("admin.status.expiresIn", { count: diasRestantes }),
      claseTextoDias: "text-muted-foreground",
    };
  } else if (diasVencido <= 5) {
    return {
      key: "grace",
      texto: t("admin.status.grace"),
      claseBg: "bg-amber-100 text-amber-800",
      claseCirculo: "bg-amber-500",
      textoDias: t("admin.status.expiredAgo", { count: diasVencido }),
      claseTextoDias: "text-amber-500",
    };
  } else {
    return {
      key: "expired",
      texto: t("common.status.inactive"),
      claseBg: "bg-red-100 text-red-700",
      claseCirculo: "bg-red-500",
      textoDias: t("admin.status.expiredAgo", { count: diasVencido }),
      claseTextoDias: "text-red-500",
    };
  }
}

// ─── Validation schema factory ────────────────────────────────────
import * as Yup from "yup";

export const getValidationSchema = (t) =>
  Yup.object({
    userId: Yup.string().required(t("admin.errors.userRequired")),
    userName: Yup.string().required(t("admin.errors.userRequired")),
    duration: Yup.string()
      .oneOf(["1", "3", "6", "12"], t("admin.errors.invalidDuration"))
      .required(t("admin.errors.durationRequired")),
  });
