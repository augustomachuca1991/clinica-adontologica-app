import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

const PracticeCustomization = () => {
  const { t } = useTranslation();
  const [practiceName, setPracticeName] = useState("DentalCare Clinic");
  const [timezone, setTimezone] = useState("america-new-york");
  const [dateFormat, setDateFormat] = useState("mm-dd-yyyy");
  const [appointmentDuration, setAppointmentDuration] = useState("30");

  const timezoneOptions = [
    { value: "america-new-york", label: t("practice.timezones.eastern") },
    { value: "america-chicago", label: t("practice.timezones.central") },
    { value: "america-denver", label: t("practice.timezones.mountain") },
    { value: "america-los-angeles", label: t("practice.timezones.pacific") },
  ];

  const dateFormatOptions = [
    { value: "mm-dd-yyyy", label: "MM/DD/YYYY" },
    { value: "dd-mm-yyyy", label: "DD/MM/YYYY" },
    { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
  ];

  const durationOptions = [
    { value: "15", label: t("practice.durations.15min") },
    { value: "30", label: t("practice.durations.30min") },
    { value: "45", label: t("practice.durations.45min") },
    { value: "60", label: t("practice.durations.60min") },
  ];

  const workflowSettings = [
    { id: "auto-save", label: t("practice.workflow.autoSave"), description: t("practice.workflow.autoSaveDesc"), checked: true },
    {
      id: "appointment-reminders",
      label: t("practice.workflow.reminders"),
      description: t("practice.workflow.remindersDesc"),
      checked: true,
    },
    {
      id: "treatment-alerts",
      label: t("practice.workflow.treatmentAlerts"),
      description: t("practice.workflow.treatmentAlertsDesc"),
      checked: true,
    },
    { id: "billing-notifications", label: t("practice.workflow.billingNotifications"), description: t("practice.workflow.billingNotificationsDesc"), checked: false },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label={t("practice.labels.practiceName")}
          type="text"
          value={practiceName}
          onChange={(e) => setPracticeName(e?.target?.value)}
          description={t("practice.labels.practiceNameDesc")}
        />
        <Input label={t("practice.labels.practicePhone")} type="tel" placeholder="(555) 123-4567" description={t("practice.labels.practicePhoneDesc")} />
        <Input
          label={t("practice.labels.practiceEmail")}
          type="email"
          placeholder="contact@dentalcare.com"
          description={t("practice.labels.practiceEmailDesc")}
        />
        <Input
          label={t("practice.labels.practiceAddress")}
          type="text"
          placeholder="123 Main Street, City, State"
          description={t("practice.labels.practiceAddressDesc")}
        />
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">{t("practice.regionalSettings")}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label={t("practice.labels.timezone")}
            options={timezoneOptions}
            value={timezone}
            onChange={setTimezone}
            description={t("practice.labels.timezoneDesc")}
          />
          <Select
            label={t("practice.labels.dateFormat")}
            options={dateFormatOptions}
            value={dateFormat}
            onChange={setDateFormat}
            description={t("practice.labels.dateFormatDesc")}
          />
          <Select
            label={t("practice.labels.appointmentDuration")}
            options={durationOptions}
            value={appointmentDuration}
            onChange={setAppointmentDuration}
            description={t("practice.labels.appointmentDurationDesc")}
          />
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">{t("practice.workflowAutomation")}</h4>
        <div className="space-y-4">
          {workflowSettings?.map((setting) => (
            <div key={setting?.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
              <Checkbox checked={setting?.checked} onChange={() => {}} className="mt-0.5" />
              <div className="flex-1">
                <label className="font-medium text-sm text-foreground cursor-pointer">{setting?.label}</label>
                <p className="text-xs text-muted-foreground mt-0.5">{setting?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">{t("practice.treatmentProtocols")}</h4>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">{t("practice.customTemplates")}</p>
              <p className="text-xs text-muted-foreground">{t("practice.customTemplatesDesc")}</p>
            </div>
            <Button variant="outline" size="sm" iconName="Plus">
              {t("practice.addTemplate")}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-foreground">{t("practice.clinicalGuidelines")}</p>
              <p className="text-xs text-muted-foreground">{t("practice.clinicalGuidelinesDesc")}</p>
            </div>
            <Button variant="outline" size="sm" iconName="Upload">
              {t("practice.upload")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">{t("practice.resetDefaults")}</Button>
        <Button variant="default" iconName="Save">
          {t("practice.saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default PracticeCustomization;
