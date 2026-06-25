import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const MobileActionSheet = ({ appointment, onReschedule, onDelete, onClose }) => {
  const { t } = useTranslation();
  if (!appointment) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="User" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black leading-tight">{appointment.patientName}</h3>
              <p className="text-xs text-muted-foreground">
                {appointment.time} - {appointment.treatment}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <Button
            variant="outline"
            className="justify-start h-14 text-base font-medium border-gray-200"
            onClick={() => {
              onReschedule(null, appointment);
              onClose();
            }}
          >
            <Icon name="CalendarClock" size={20} className="mr-3 text-blue-600" />
            {t("appointment.reschedule")}
          </Button>
          <Button
            variant="outline"
            className="justify-start h-14 text-base font-medium text-red-600 border-red-100 hover:bg-red-50"
            onClick={() => {
              onDelete({ stopPropagation: () => {} }, appointment.id);
              onClose();
            }}
          >
            <Icon name="Trash2" size={20} className="mr-3" />
            {t("delete")}
          </Button>
          <button
            className="w-full py-4 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileActionSheet;
