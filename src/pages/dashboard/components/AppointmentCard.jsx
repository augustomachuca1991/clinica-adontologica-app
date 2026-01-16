import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const AppointmentCard = ({ appointment, onViewDetails, onReschedule }) => {
  const getStatusColor = () => {
    switch (appointment?.status) {
      case "confirmed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = () => {
    switch (appointment?.priority) {
      case "urgent":
        return "border-l-4 border-error";
      case "high":
        return "border-l-4 border-warning";
      default:
        return "border-l-4 border-primary";
    }
  };

  return (
    <div className={`clinical-card p-4 ${getPriorityColor()}`}>
      <div className="flex items-start gap-3 md:gap-4 mb-3">
        <Image src={appointment?.patientImage} alt={appointment?.patientImageAlt} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-headline font-semibold text-sm md:text-base text-foreground truncate">{appointment?.patientName}</h4>
            <span className={`status-indicator text-xs px-2 py-1 ${getStatusColor()}`}>{appointment?.status}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{appointment?.treatment}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              <span>{appointment?.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span>{appointment?.date}</span>
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
        <Button variant="outline" size="sm" onClick={() => onViewDetails(appointment?.id)} iconName="Eye" iconPosition="left" className="flex-1">
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onReschedule(appointment?.id)} iconName="Calendar" iconPosition="left" className="flex-1">
          Reschedule
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;
