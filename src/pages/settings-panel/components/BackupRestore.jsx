import React, { useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useTranslation } from "react-i18next";

const BackupRestore = () => {
  const { t } = useTranslation();
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [retentionPeriod, setRetentionPeriod] = useState("30");

  const frequencyOptions = [
    { value: "hourly", label: t("backup.frequencies.hourly") },
    { value: "daily", label: t("backup.frequencies.daily") },
    { value: "weekly", label: t("backup.frequencies.weekly") },
    { value: "monthly", label: t("backup.frequencies.monthly") },
  ];

  const retentionOptions = [
    { value: "7", label: t("backup.retention.days_7") },
    { value: "30", label: t("backup.retention.days_30") },
    { value: "90", label: t("backup.retention.days_90") },
    { value: "365", label: t("backup.retention.year_1") },
  ];

  const backupHistory = [
    {
      id: 1,
      date: "01/16/2026",
      time: "02:00 AM",
      size: "2.4 GB",
      status: "Completed",
      type: "Automatic",
      duration: "12 minutes",
    },
    {
      id: 2,
      date: "01/15/2026",
      time: "02:00 AM",
      size: "2.3 GB",
      status: "Completed",
      type: "Automatic",
      duration: "11 minutes",
    },
    {
      id: 3,
      date: "01/14/2026",
      time: "10:30 AM",
      size: "2.3 GB",
      status: "Completed",
      type: "Manual",
      duration: "10 minutes",
    },
    {
      id: 4,
      date: "01/14/2026",
      time: "02:00 AM",
      size: "2.2 GB",
      status: "Completed",
      type: "Automatic",
      duration: "11 minutes",
    },
    {
      id: 5,
      date: "01/13/2026",
      time: "02:00 AM",
      size: "2.2 GB",
      status: "Failed",
      type: "Automatic",
      duration: "2 minutes",
    },
  ];

  const dataCategories = [
    { id: "patient-records", label: t("backup.categories.labels.patient-records"), size: "1.2 GB", checked: true },
    { id: "clinical-notes", label: t("backup.categories.labels.clinical-notes"), size: "450 MB", checked: true },
    { id: "images", label: t("backup.categories.labels.images"), size: "600 MB", checked: true },
    { id: "appointments", label: t("backup.categories.labels.appointments"), size: "80 MB", checked: true },
    { id: "billing", label: t("backup.categories.labels.billing"), size: "120 MB", checked: true },
    { id: "settings", label: t("backup.categories.labels.settings"), size: "5 MB", checked: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-base text-foreground">{t("backup.config.title")}</h4>
              <p className="text-xs text-muted-foreground">{t("backup.config.subtitle")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <Select
              label={t("backup.config.frequency_label")}
              options={frequencyOptions}
              value={backupFrequency}
              onChange={setBackupFrequency}
              description={t("backup.config.frequency_desc")}
            />
            <Select
              label={t("backup.config.retention_label")}
              options={retentionOptions}
              value={retentionPeriod}
              onChange={setRetentionPeriod}
              description={t("backup.config.retention_desc")}
            />
            <div className="pt-2">
              <Button variant="default" className="w-full" iconName="Save">
                {t("backup.config.save_btn")}
              </Button>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-base text-foreground">{t("backup.status.title")}</h4>
              <p className="text-xs text-muted-foreground">{t("backup.status.subtitle")}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("backup.status.last_backup")}</span>
              <span className="text-sm font-medium text-foreground">01/16/2026 02:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("backup.status.size")}</span>
              <span className="text-sm font-medium text-foreground">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("backup.status.next_scheduled")}</span>
              <span className="text-sm font-medium text-foreground">01/17/2026 02:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{t("backup.status.storage_used")}</span>
              <span className="text-sm font-medium text-foreground">68.5 GB / 100 GB</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full" iconName="Download">
                {t("backup.status.manual_btn")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías de datos */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-headline font-semibold text-base text-foreground mb-4">{t("backup.categories.title")}</h4>
        <p className="text-sm text-muted-foreground mb-4">{t("backup.categories.subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCategories?.map((category) => (
            <div key={category?.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox checked={category?.checked} onChange={() => {}} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <label className="font-medium text-sm text-foreground cursor-pointer block">{category?.label}</label>
                <p className="text-xs text-muted-foreground">{category?.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historial */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">{t("backup.history.title")}</h4>
            <Button variant="outline" size="sm" iconName="Download">
              {t("backup.history.export_btn")}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_date_time")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_size")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_type")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_duration")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("backup.history.th_actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {backupHistory?.map((backup) => {
                const isAutomatic = backup?.type === "Automatic";
                const isCompleted = backup?.status === "Completed";

                return (
                  <tr key={backup?.id} className="hover:bg-muted/30 transition-colors duration-base">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{backup?.date}</div>
                      <div className="text-xs text-muted-foreground">{backup?.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{backup?.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          isAutomatic ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {isAutomatic ? t("backup.types.automatic") : t("backup.types.manual")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{backup?.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          isCompleted ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-success" : "bg-error"}`} />
                        {isCompleted ? t("backup.states.completed") : t("backup.states.failed")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {isCompleted && (
                          <>
                            <Button variant="ghost" size="icon" iconName="Download" />
                            <Button variant="ghost" size="icon" iconName="RotateCcw" />
                          </>
                        )}
                        <Button variant="ghost" size="icon" iconName="Trash2" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerta de restauración */}
      <div className="bg-error/10 border border-error/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">{t("backup.warning.title")}</h5>
            <p className="text-xs text-muted-foreground mb-3">{t("backup.warning.description")}</p>
            <Button variant="outline" size="sm" iconName="RotateCcw">
              {t("backup.warning.restore_btn")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
