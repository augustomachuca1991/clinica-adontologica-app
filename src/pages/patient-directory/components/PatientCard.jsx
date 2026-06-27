// pages/patient-directory/components/PatientCard.jsx
import React, { memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Image from "@/components/AppImage";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { formatDateForUI } from "@/utils/formatters/date";
import { cn } from "@/utils/cn";

// ── Colores tonales para avatares de iniciales ────────────────────────────────
const AVATAR_COLORS = [
  { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-700 dark:text-teal-300" },
  { bg: "bg-violet-100 dark:bg-violet-900/40", text: "text-violet-700 dark:text-violet-300" },
  { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
  { bg: "bg-rose-100 dark:bg-rose-900/40", text: "text-rose-700 dark:text-rose-300" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Badges de estado ─────────────────────────────────────────────────────────
const STATUS_BADGE = {
  active: "bg-success/10 text-success border border-success/20",
  pending: "bg-warning/10 text-warning border border-warning/20",
  inactive: "bg-muted text-muted-foreground border border-border",
};

// ── Estilos de próxima cita ──────────────────────────────────────────────────
const APPOINTMENT_STYLE = {
  scheduled: { wrapper: "bg-primary/5 border border-primary/15", icon: "text-primary", text: "text-primary" },
  confirmed: { wrapper: "bg-primary/5 border border-primary/15", icon: "text-primary", text: "text-primary" },
  in_progress: {
    wrapper: "bg-warning/5 border border-warning/15",
    icon: "text-warning",
    text: "text-warning",
  },
  completed: { wrapper: "bg-success/5 border border-success/15", icon: "text-success", text: "text-success" },
  cancelled: {
    wrapper: "bg-muted/50 border border-border",
    icon: "text-muted-foreground",
    text: "text-muted-foreground",
  },
  no_show: {
    wrapper: "bg-destructive/5 border border-destructive/15",
    icon: "text-destructive",
    text: "text-destructive",
  },
  default: {
    wrapper: "bg-muted/50 border border-border",
    icon: "text-muted-foreground",
    text: "text-muted-foreground",
  },
};

// ── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = memo(({ src, alt, name }) => {
  const initials = useMemo(() => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  }, [name]);

  const color = useMemo(() => getAvatarColor(name), [name]);

  if (src) {
    return (
      <div className="w-11 h-11 rounded-xl flex-shrink-0 border border-border overflow-hidden">
        <Image src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-11 h-11 rounded-xl flex-shrink-0 border border-border flex items-center justify-center text-sm font-semibold select-none",
        color.bg,
        color.text
      )}
    >
      {initials}
    </div>
  );
});
Avatar.displayName = "Avatar";

// ── MetaItem ─────────────────────────────────────────────────────────────────
const MetaItem = memo(({ icon, value }) => (
  <div className="flex items-center gap-1.5 min-w-0">
    <Icon name={icon} size={13} className="text-muted-foreground/60 flex-shrink-0" />
    <span className="text-xs text-muted-foreground truncate">{value || "N/A"}</span>
  </div>
));
MetaItem.displayName = "MetaItem";

// ── Componente principal ──────────────────────────────────────────────────────
const PatientCard = memo(({ patient, onQuickAction }) => {
  const { t } = useTranslation();

  const badgeClass = STATUS_BADGE[patient?.status] ?? STATUS_BADGE.inactive;
  const apptStyle = APPOINTMENT_STYLE[patient?.appointmentStatus] ?? APPOINTMENT_STYLE.default;

  const handleCall = useCallback(() => onQuickAction("call", patient), [onQuickAction, patient]);
  const handleMessage = useCallback(() => onQuickAction("message", patient), [onQuickAction, patient]);

  return (
    <div className="clinical-card overflow-hidden fade-in-up flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 p-4 md:p-5">
        <Avatar src={patient?.avatar} alt={patient?.avatarAlt} name={patient?.name} />

        <div className="flex-1 min-w-0">
          {/* nombre + badge + tags en la misma fila */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <Link
              to={`/patient-profile/${patient?.id}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate capitalize"
            >
              {patient?.name}
            </Link>
            <span
              className={cn(
                "inline-flex items-center h-[18px] px-2 rounded-full text-[10px] font-semibold",
                badgeClass
              )}
            >
              {t(`common.status.${patient?.status}`)}
            </span>
            {patient?.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center h-[18px] px-2 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground/70">ID: {patient?.patientId}</span>
        </div>

        {/* acciones */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={handleCall}
            aria-label={t("patientCard.call")}
            className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
          >
            <Icon name="Phone" size={14} />
          </button>
          <button
            onClick={handleMessage}
            aria-label={t("patientCard.email")}
            className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
          >
            <Icon name="Mail" size={14} />
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border mx-4 md:mx-5" />

      {/* ── Metadata ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 md:px-5 py-3.5">
        <MetaItem icon="Calendar" value={formatDateForUI(patient?.dateOfBirth)} />
        <MetaItem icon="Phone" value={patient?.phone} />
        <MetaItem icon="Mail" value={patient?.email} />
        <MetaItem icon="CreditCard" value={patient?.insurance} />
      </div>

      {/* ── Footer: próxima cita ── */}
      {patient?.nextAppointmentData ? (
        <div className="px-4 md:px-5 pb-4 md:pb-5 mt-auto">
          <div className={cn("px-3 py-2.5 rounded-lg", apptStyle.wrapper)}>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={13} className={cn("flex-shrink-0", apptStyle.icon)} />
              <span className={cn("text-xs font-medium flex-1", apptStyle.text)}>
                {formatDateForUI(patient.nextAppointmentData.date)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center h-[18px] px-2 rounded-full text-[10px] font-semibold",
                  apptStyle.text === "text-primary" && "bg-primary/10 text-primary",
                  apptStyle.text === "text-warning" && "bg-warning/10 text-warning",
                  apptStyle.text === "text-success" && "bg-success/10 text-success",
                  apptStyle.text === "text-destructive" && "bg-destructive/10 text-destructive",
                  apptStyle.text === "text-muted-foreground" && "bg-muted/50 text-muted-foreground"
                )}
              >
                {t(`appointment.status.${patient.nextAppointmentData.status.replace(/_/g, "-")}`)}
              </span>
            </div>
            {patient.nextAppointmentData.reason && (
              <div className="mt-1.5 text-xs font-medium text-foreground/80 leading-tight">
                {patient.nextAppointmentData.reason}
              </div>
            )}
            {patient.nextAppointmentData.treatment && (
              <div className="mt-0.5 text-[11px] text-muted-foreground/60 leading-tight">
                {patient.nextAppointmentData.treatment}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 md:px-5 pb-4 md:pb-5 mt-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
            <Icon name="CalendarOff" size={13} className="text-muted-foreground/50 flex-shrink-0" />
            <span className="text-xs text-muted-foreground/60">{t("patientCard.noAppointmentScheduled")}</span>
          </div>
        </div>
      )}
    </div>
  );
});

PatientCard.displayName = "PatientCard";
export default PatientCard;
