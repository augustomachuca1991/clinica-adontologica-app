import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import {
  STATUSES,
  getNextStatus,
  getStatusIndex,
  isTerminal,
} from "@/utils/treatmentStatus";

const STEPS = [
  { key: STATUSES.PLANNED, icon: "Calendar" },
  { key: STATUSES.IN_PROGRESS, icon: "Clock" },
  { key: STATUSES.COMPLETED, icon: "CheckCircle" },
];

const StatusStepper = ({ currentStatus, onChange, isNew = false }) => {
  const { t } = useTranslation();
  const currentIdx = getStatusIndex(currentStatus);
  const nextStatus = getNextStatus(currentStatus);

  const handleAdvance = () => {
    if (nextStatus) onChange(nextStatus);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {t("treatment.formLabel.status")}
      </label>

      <div className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isDisabled = isNew ? idx > 0 : idx > currentIdx;
          const isLast = idx === STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onChange(step.key)}
                  className={`
                    relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-base
                    ${isCompleted ? "bg-success text-success-foreground shadow-clinical-sm" : ""}
                    ${isCurrent && !isCompleted ? "bg-primary text-primary-foreground shadow-clinical-md ring-2 ring-primary/20" : ""}
                    ${!isCompleted && !isCurrent && isDisabled ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : ""}
                    ${!isCompleted && !isCurrent && !isDisabled ? "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer" : ""}
                  `}
                  aria-label={t(`common.status.${step.key}`)}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step.icon} size={16} />
                  )}
                </button>
                <span
                  className={`
                    mt-1.5 text-[11px] font-medium whitespace-nowrap
                    ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                    ${isCompleted ? "text-success" : ""}
                  `}
                >
                  {t(`common.status.${step.key}`)}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1.5 mb-5
                    ${idx < currentIdx ? "bg-success" : "bg-muted"}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!isNew && nextStatus && (
        <button
          type="button"
          onClick={handleAdvance}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-clinical-sm"
        >
          <Icon name="ArrowRight" size={15} />
          {t("treatment.status.advanceTo", {
            status: t(`common.status.${nextStatus}`).toLowerCase(),
          })}
        </button>
      )}

      {!isNew && isTerminal(currentStatus) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">
          <Icon name="CheckCircle" size={16} />
          {t("treatment.status.completedLabel")}
        </div>
      )}
    </div>
  );
};

export default StatusStepper;
