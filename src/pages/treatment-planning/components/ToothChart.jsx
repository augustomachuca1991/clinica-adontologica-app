import React from "react";
import { useTranslation } from "react-i18next";

const ToothChart = ({ selectedTeeth, onToothSelect, treatments }) => {
  const { t } = useTranslation();

  const upperTeeth = [
    { number: 18, position: "upper-right" },
    { number: 17, position: "upper-right" },
    { number: 16, position: "upper-right" },
    { number: 15, position: "upper-right" },
    { number: 14, position: "upper-right" },
    { number: 13, position: "upper-right" },
    { number: 12, position: "upper-right" },
    { number: 11, position: "upper-right" },
    { number: 21, position: "upper-left" },
    { number: 22, position: "upper-left" },
    { number: 23, position: "upper-left" },
    { number: 24, position: "upper-left" },
    { number: 25, position: "upper-left" },
    { number: 26, position: "upper-left" },
    { number: 27, position: "upper-left" },
    { number: 28, position: "upper-left" },
  ];

  const lowerTeeth = [
    { number: 48, position: "lower-right" },
    { number: 47, position: "lower-right" },
    { number: 46, position: "lower-right" },
    { number: 45, position: "lower-right" },
    { number: 44, position: "lower-right" },
    { number: 43, position: "lower-right" },
    { number: 42, position: "lower-right" },
    { number: 41, position: "lower-right" },
    { number: 31, position: "lower-left" },
    { number: 32, position: "lower-left" },
    { number: 33, position: "lower-left" },
    { number: 34, position: "lower-left" },
    { number: 35, position: "lower-left" },
    { number: 36, position: "lower-left" },
    { number: 37, position: "lower-left" },
    { number: 38, position: "lower-left" },
  ];

  const getToothStatus = (toothNumber) => {
    const treatment = treatments?.find((t) => String(t?.toothNumber) === String(toothNumber));
    if (treatment) {
      return treatment?.status;
    }
    return selectedTeeth?.map(String).includes(String(toothNumber)) ? "selected" : "normal";
  };

  const getToothColor = (toothNumber) => {
    const toothTreatments = treatments?.filter((t) => String(t.toothNumber) === String(toothNumber)) || [];

    const isSelected = selectedTeeth?.map(String).includes(String(toothNumber));

    if (toothTreatments.some((t) => t.status === "completed")) return "bg-success text-success-foreground";
    if (toothTreatments.some((t) => t.status === "inProgress")) return "bg-warning text-warning-foreground";
    if (toothTreatments.some((t) => t.status === "planned")) return "bg-primary text-primary-foreground";

    if (isSelected) return "bg-primary text-primary-foreground";

    return "bg-muted text-muted-foreground hover:bg-muted/80";
  };

  const ToothButton = ({ tooth }) => {
    const status = getToothStatus(tooth?.number);
    const colorClass = getToothColor(tooth?.number);
    const isSelected = selectedTeeth?.includes(tooth?.number);
    const treatment = treatments?.find((t) => String(t?.toothNumber) === String(tooth?.number));

    return (
      <button
        onClick={() => onToothSelect(tooth?.number)}
        className={`relative group w-8 h-10 md:w-10 md:h-12 lg:w-12 lg:h-14 rounded-md transition-all duration-base hover:scale-110 hover:z-10 ${colorClass} ${isSelected ? "ring-2 ring-ring ring-offset-2" : ""} focus-clinical`}
        aria-label={`${t("tooth")} ${tooth?.number}`}
      >
        <span className="text-xs md:text-sm font-medium">{tooth?.number}</span>
        {status !== "normal" && status !== "selected" && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-background border-2 border-current" />}

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none z-20 shadow-clinical-md">
          {t("tooth")} #{tooth?.number}
          {treatment && <span className="text-background/70"> — {treatment.procedure}</span>}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-headline font-semibold text-foreground">{t("treatment.toothChart")}</h3>
        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-muted-foreground">{t("common.status.completed")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">{t("common.status.inProgress")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">{t("common.status.planned")}</span>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 lg:p-8">
        <div className="space-y-6 md:space-y-8">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">{t("treatment.upperJaw")}</div>
            <div className="flex justify-center gap-1 md:gap-2">
              {upperTeeth?.map((tooth) => (
                <ToothButton key={tooth?.number} tooth={tooth} />
              ))}
            </div>
          </div>

          <div className="border-t border-border" />

          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">{t("treatment.lowerJaw")}</div>
            <div className="flex justify-center gap-1 md:gap-2">
              {lowerTeeth?.map((tooth) => (
                <ToothButton key={tooth?.number} tooth={tooth} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToothChart;
