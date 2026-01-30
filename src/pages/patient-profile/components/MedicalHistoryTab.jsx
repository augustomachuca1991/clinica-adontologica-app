import React from "react";
import Icon from "@/components/AppIcon";

const MedicalHistoryTab = ({ medicalHistory }) => {
  const getConditionSeverity = (severity) => {
    switch (severity) {
      case "High":
        return "bg-error/10 text-error";
      case "Medium":
        return "bg-warning/10 text-warning";
      case "Low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Allergies & Sensitivities</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {medicalHistory?.allergies?.map((allergy, index) => (
            <div key={index} className="flex items-start gap-3 p-3 md:p-4 bg-error/5 rounded-lg border border-error/20">
              <Icon name="AlertCircle" size={18} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-foreground mb-1">{allergy?.allergen}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Reaction: {allergy?.reaction}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getConditionSeverity(allergy?.severity)}`}>
                  {allergy?.severity} Severity
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Activity" size={20} color="var(--color-warning)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Medical Conditions</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          {medicalHistory?.conditions?.map((condition, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 md:p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm md:text-base font-medium text-foreground">{condition?.name}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionSeverity(condition?.severity)}`}>
                    {condition?.severity}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Diagnosed: {new Date(condition.diagnosedDate)?.toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                </p>
                {condition?.notes && <p className="text-xs md:text-sm text-muted-foreground">Notes: {condition?.notes}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Icon
                  name={condition?.status === "Active" ? "CheckCircle" : "Circle"}
                  size={18}
                  className={condition?.status === "Active" ? "text-success" : "text-muted-foreground"}
                />
                <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">{condition?.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Pill" size={20} color="var(--color-primary)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Current Medications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {medicalHistory?.medications?.map((medication, index) => (
            <div key={index} className="p-3 md:p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm md:text-base font-medium text-foreground">{medication?.name}</p>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium whitespace-nowrap">
                  {medication?.frequency}
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Dosage: {medication?.dosage}</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Started: {new Date(medication.startDate)?.toLocaleDateString("en-US", { year: "numeric", month: "short" })}
              </p>
              {medication?.prescribedBy && <p className="text-xs text-muted-foreground mt-2">Prescribed by: {medication?.prescribedBy}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Stethoscope" size={20} color="var(--color-secondary)" />
          </div>
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Previous Surgeries</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          {medicalHistory?.surgeries?.map((surgery, index) => (
            <div key={index} className="p-3 md:p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <p className="text-sm md:text-base font-medium text-foreground">{surgery?.procedure}</p>
                <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(surgery.date)?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Surgeon: {surgery?.surgeon}</p>
              <p className="text-xs md:text-sm text-muted-foreground">Hospital: {surgery?.hospital}</p>
              {surgery?.notes && <p className="text-xs md:text-sm text-muted-foreground mt-2">Notes: {surgery?.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryTab;
