// pages/patient-directory/components/PatientCard.jsx
import React, { memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Image from "@/components/AppImage";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { formatDateForUI } from "@/utils/formatters/date";
import { cn } from "@/utils/cn";

// ── Constantes estáticas ──────────────────────────────────────────────────────

const STATUS_BADGE = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
};

const APPOINTMENT_STYLE = {
  upcoming: { wrapper: "bg-primary/5", icon: "text-primary", text: "text-primary" },
  overdue: { wrapper: "bg-error/10", icon: "text-error", text: "text-error" },
  completed: { wrapper: "bg-success/10", icon: "text-success", text: "text-success" },
  default: { wrapper: "bg-muted/50", icon: "text-muted-foreground", text: "text-muted-foreground" },
};

// ── Avatar con fallback a iniciales ──────────────────────────────────────────

const Avatar = memo(({ src, alt, name }) => {
  const initials = useMemo(() => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  }, [name]);

  if (src) {
    return (
      <div className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-border overflow-hidden">
        <Image src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-border bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground select-none">
      {initials}
    </div>
  );
});
Avatar.displayName = "Avatar";

// ── Fila de metadato ─────────────────────────────────────────────────────────

const MetaItem = memo(({ icon, value }) => (
  <div className="flex items-center gap-1.5 min-w-0">
    <Icon name={icon} size={14} className="text-muted-foreground flex-shrink-0" />
    <span className="text-xs text-muted-foreground truncate">{value || "N/A"}</span>
  </div>
));
MetaItem.displayName = "MetaItem";

// ── Bloque de próxima cita ────────────────────────────────────────────────────

const AppointmentRow = memo(({ nextAppointment, appointmentStatus, t }) => {
  const style = APPOINTMENT_STYLE[appointmentStatus] ?? APPOINTMENT_STYLE.default;

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", style.wrapper)}>
      <Icon name="Clock" size={14} className={cn("flex-shrink-0", style.icon)} />
      <span className={cn("text-xs font-medium flex-1", style.text)}>
        {t("next")}: {nextAppointment}
      </span>
      {appointmentStatus === "overdue" && (
        <span className="text-xs font-medium text-error">{t("appointment.overdue")}</span>
      )}
    </div>
  );
});
AppointmentRow.displayName = "AppointmentRow";

// ── Componente principal ──────────────────────────────────────────────────────

const PatientCard = memo(({ patient, onQuickAction }) => {
  const { t } = useTranslation();

  const badgeClass = STATUS_BADGE[patient?.status] ?? STATUS_BADGE.inactive;

  const handleCall = useCallback(() => onQuickAction("call", patient), [onQuickAction, patient]);
  const handleMessage = useCallback(() => onQuickAction("message", patient), [onQuickAction, patient]);

  return (
    <div className="clinical-card p-4 md:p-5 fade-in-up flex flex-col gap-3">
      {/* ── Header ── */}
      <div className="flex items-start gap-3.5">
        <Avatar src={patient?.avatar} alt={patient?.avatarAlt} name={patient?.name} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <Link
              to={`/patient-profile/${patient?.id}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate capitalize"
            >
              {patient?.name}
            </Link>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", badgeClass)}>
              {t(`patient.status.${patient?.status}`)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">ID: {patient?.patientId}</span>
        </div>

        <div className="flex gap-1.5 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCall}
            iconName="Phone"
            aria-label={t("patientCard.call")}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMessage}
            iconName="Mail"
            aria-label={t("patientCard.email")}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border" />

      {/* ── Metadata 2x2 ── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <MetaItem icon="Calendar" value={formatDateForUI(patient?.dateOfBirth)} />
        <MetaItem icon="Phone" value={patient?.phone} />
        <MetaItem icon="Mail" value={patient?.email} />
        <MetaItem icon="CreditCard" value={patient?.insurance} />
      </div>

      {/* ── Próxima cita ── */}
      {patient?.nextAppointment && (
        <AppointmentRow nextAppointment={patient.nextAppointment} appointmentStatus={patient.appointmentStatus} t={t} />
      )}

      {/* ── Tags ── */}
      {patient?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {patient.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] rounded-full bg-muted text-muted-foreground border border-border font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

PatientCard.displayName = "PatientCard";
export default PatientCard;
