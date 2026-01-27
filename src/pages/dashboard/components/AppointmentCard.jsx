import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AppointmentCard = ({ appointment, onViewDetails, onReschedule }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getStatusColor = () => {
    switch (appointment?.status) {
      case "confirmed":
        return "bg-green-50 text-green-700 inset-ring-green-600/20";
      case "cancelled":
        return "bg-red-50 text-red-700 inset-ring-red-600/10";
      default:
        return "bg-gray-50 text-gray-600 inset-ring-green-500/10";
    }
  };

  const getPriorityColor = () => {
    switch (appointment?.priority) {
      case "urgent":
        return "border-l-4 border-gray-400";
      case "high":
        return "border-l-4 border-gray-400";
      default:
        return "border-l-4 border-gray-400";
    }
  };

  return (
    <div className={`clinical-card p-4 ${getPriorityColor()}`}>
      <div className="flex items-start gap-3 md:gap-4 mb-3">
        {/* <Image src={appointment?.patientImage} alt={appointment?.patientImageAlt} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0" /> */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-headline font-semibold text-sm md:text-base text-foreground truncate">{appointment?.patientName}</h4>

            <span className={`inline-flex items-center rounded-xl px-2 py-1 text-xs font-medium inset-ring ${getStatusColor()}`}>{t(`appointment.status.${appointment?.status}`)}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{appointment?.treatment}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              <span>{appointment?.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span>{appointment.date instanceof Date ? appointment.date.toLocaleDateString() : appointment.date}</span>
            </div>
            {appointment?.duration && (
              <div className="flex items-center gap-1">
                <Icon name="Timer" size={14} />
                <span>{appointment?.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-border">
        <Button variant="tertiary" size="sm" onClick={() => navigate("/weekly-calendar")} iconName="Eye" iconPosition="left" className="flex-1">
          {t("appointment.viewDetails")}
        </Button>
        <Button variant="default" size="sm" onClick={() => onReschedule(appointment?.id)} iconName="Calendar" iconPosition="left" className="flex-1">
          {t("appointment.reschedule")}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;
