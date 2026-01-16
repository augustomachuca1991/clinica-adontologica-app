import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const PatientAlertCard = ({ alert, onDismiss, onViewPatient }) => {
  const getAlertIcon = () => {
    switch (alert?.type) {
      case "critical":
        return "AlertCircle";
      case "warning":
        return "AlertTriangle";
      case "info":
        return "Info";
      default:
        return "Bell";
    }
  };

  const getAlertColor = () => {
    switch (alert?.type) {
      case "critical":
        return "bg-error/10 border-error/20";
      case "warning":
        return "bg-warning/10 border-warning/20";
      case "info":
        return "bg-primary/10 border-primary/20";
      default:
        return "bg-muted border-border";
    }
  };

  const getIconColor = () => {
    switch (alert?.type) {
      case "critical":
        return "var(--color-error)";
      case "warning":
        return "var(--color-warning)";
      case "info":
        return "var(--color-primary)";
      default:
        return "var(--color-muted-foreground)";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Icon name={getAlertIcon()} size={20} color={getIconColor()} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Image src={alert?.patientImage} alt={alert?.patientImageAlt} className="w-8 h-8 rounded-full object-cover" />
              <h4 className="font-headline font-semibold text-sm text-foreground">{alert?.patientName}</h4>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{alert?.time}</span>
          </div>
          <p className="text-sm text-foreground mb-3">{alert?.message}</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="xs" onClick={() => onViewPatient(alert?.patientId)} iconName="ExternalLink" iconPosition="left">
              View Patient
            </Button>
            <Button variant="ghost" size="xs" onClick={() => onDismiss(alert?.id)} iconName="X">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAlertCard;
