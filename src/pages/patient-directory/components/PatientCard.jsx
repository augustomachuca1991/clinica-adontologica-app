import React from "react";
import { Link } from "react-router-dom";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { formatDateForUI } from "../../../utils/formatters/date";

const PatientCard = ({ patient, onQuickAction }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-primary";
      case "overdue":
        return "text-error";
      case "completed":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="clinical-card p-4 md:p-5 lg:p-6 fade-in-up">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-primary/20">
            <Image src={patient?.avatar} alt={patient?.avatarAlt} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                to={`/patient-profile?id=${patient?.id}`}
                className="text-base md:text-lg font-headline font-semibold text-foreground hover:text-primary transition-colors duration-base truncate block"
              >
                {patient?.name}
              </Link>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs md:text-sm text-muted-foreground">ID: {patient?.patientId}</span>
                <span className={`status-indicator text-xs ${getStatusColor(patient?.status)}`}>{t(`patientCard.status.${patient?.status}`)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onQuickAction("call", patient)} iconName="Phone" aria-label="Call patient" className="flex-shrink-0" />
              <Button variant="ghost" size="icon" onClick={() => onQuickAction("message", patient)} iconName="Mail" aria-label="Email patient" className="flex-shrink-0" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Icon name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">
                {t("patientCard.dob")}: {formatDateForUI(patient?.dateOfBirth)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{patient?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Icon name="Mail" size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{patient?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Icon name="CreditCard" size={16} className="text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{patient?.insurance}</span>
            </div>
          </div>

          {patient?.nextAppointment && (
            <div className={`flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/50 ${getAppointmentStatusColor(patient?.appointmentStatus)}`}>
              <Icon name="Clock" size={16} className="flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium">
                {t("next")}: {patient?.nextAppointment}
              </span>
              {patient?.appointmentStatus === "overdue" && <span className="ml-auto text-xs font-medium">{t("appointment.overdue")}</span>}
            </div>
          )}

          {patient?.tags && patient?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {patient?.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-400 text-gray-50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
