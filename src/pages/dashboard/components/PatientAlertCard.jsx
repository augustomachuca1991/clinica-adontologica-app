// pages/dashboard/components/PatientAlertCard.jsx
import React, { useCallback, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";

const ALERT_CONFIG = {
  critical: {
    icon: "AlertCircle",
    cardClass: "bg-error/10 border-error/20",
    iconColor: "var(--color-error)",
  },
  warning: {
    icon: "AlertTriangle",
    cardClass: "bg-warning/10 border-warning/20",
    iconColor: "var(--color-warning)",
  },
  info: {
    icon: "Info",
    cardClass: "bg-primary/10 border-primary/20",
    iconColor: "var(--color-primary)",
  },
  default: {
    icon: "Bell",
    cardClass: "bg-muted border-border",
    iconColor: "var(--color-muted-foreground)",
  },
};

const PatientAlertCard = memo(({ alert, onDismiss, onViewPatient }) => {
  const { t } = useTranslation();

  const config = useMemo(() => ALERT_CONFIG[alert?.type] ?? ALERT_CONFIG.default, [alert?.type]);

  const handleViewPatient = useCallback(() => onViewPatient(alert?.patientId), [onViewPatient, alert?.patientId]);

  const handleDismiss = useCallback(() => onDismiss(alert?.id), [onDismiss, alert?.id]);

  return (
    <div className={`p-4 rounded-lg border ${config.cardClass}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Icon name={config.icon} size={20} color={config.iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Image
                src={alert?.patientImage}
                alt={alert?.patientImageAlt}
                className="w-8 h-8 rounded-full object-cover"
              />
              <h4 className="font-headline font-semibold text-sm text-foreground">{alert?.patientName}</h4>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{alert?.time}</span>
          </div>

          <p className="text-sm text-foreground mb-3">{alert?.message}</p>

          <div className="flex gap-2">
            <Button variant="ghost" size="xs" onClick={handleViewPatient} iconName="ExternalLink" iconPosition="left">
              {t("patientAlert.viewPatient") || "View Patient"}
            </Button>
            <Button variant="ghost" size="xs" onClick={handleDismiss} iconName="X">
              {t("patientAlert.dismiss") || "Dismiss"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

PatientAlertCard.displayName = "PatientAlertCard";
export default PatientAlertCard;
