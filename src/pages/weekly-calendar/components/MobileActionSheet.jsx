import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { STATUS_CONFIG, ALLOWED_TRANSITIONS } from "@/utils/appointmentStatuses";

const MobileActionSheet = ({ appointment, onReschedule, onDelete, onStatusChange, onClose }) => {
  const { t } = useTranslation();
  if (!appointment) return null;

  const status = appointment.status ?? "scheduled";
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.scheduled;
  const transitions = ALLOWED_TRANSITIONS[status] ?? [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="p-5 border-b border-white/10 bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="User" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base font-headline text-foreground leading-tight truncate">{appointment.patientName}</h3>
              <p className="text-xs text-muted-foreground">
                {appointment.time} · {appointment.treatment}
              </p>
            </div>
            <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.text} flex-shrink-0`}>
              {cfg.label}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          {transitions.length > 0 && (
            <div className="mb-1">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-cyber">Cambiar estado</p>
              <div className="flex flex-wrap gap-2">
                {transitions.map((s) => {
                  const tcfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        onStatusChange?.(appointment.id, s);
                        onClose();
                      }}
                      className={`
                        text-sm font-medium px-3 py-2 rounded-lg flex-1 font-body
                        border-l-[3px] ${tcfg.border} ${tcfg.bg} ${tcfg.text}
                        active:scale-95 transition-transform
                      `}
                    >
                      {tcfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {transitions.length > 0 && <div className="border-t border-white/10 my-1" />}

          <Button
            variant="outline"
            className="justify-start h-12 text-sm font-medium"
            onClick={() => {
              onReschedule(null, appointment);
              onClose();
            }}
          >
            <Icon name="CalendarClock" size={18} className="mr-3 text-primary" />
            {t("appointment.reschedule")}
          </Button>

          <Button
            variant="outline"
            className="justify-start h-12 text-sm font-medium text-accent"
            onClick={() => {
              onDelete({ stopPropagation: () => {} }, appointment.id);
              onClose();
            }}
          >
            <Icon name="Trash2" size={18} className="mr-3" />
            {t("common.actions.delete")}
          </Button>

          <button
            className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            {t("common.actions.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileActionSheet;
