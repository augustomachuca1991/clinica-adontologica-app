// src/components/BackupRestore.jsx
import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useTranslation } from "react-i18next";
import { useBackup, DATA_CATEGORIES } from "@/hooks/BackupHooks";
import RestoreModal from "@/pages/settings-panel/components/RestoreModal";
import DeleteBackupModal from "@/pages/settings-panel/components/DeleteBackupModal";

function formatDuration(ms) {
  if (!ms) return "-";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(0)} segundos`;
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
}

const BackupRestore = () => {
  const { t } = useTranslation();
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [retentionPeriod, setRetentionPeriod] = useState("30");

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const [backupToDelete, setBackupToDelete] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState(DATA_CATEGORIES.map((c) => c.id));

  const {
    createManualBackup,
    isCreatingBackup,
    backupError,
    backupHistory,
    loadingHistory,
    fetchBackupHistory,
    deleteBackupRecord,
    formatSize,
    restoreFromFile,
    isRestoring,
    restoreProgress,
    restoreError,
    restoreSuccess,
    setRestoreSuccess,
    isDeleting,
  } = useBackup();

  // Cargar historial al montar
  useEffect(() => {
    fetchBackupHistory();
  }, [fetchBackupHistory]);

  const lastBackup = backupHistory.find((b) => b.status === "completed");
  const lastBackupFormatted = lastBackup ? formatDate(lastBackup.created_at) : null;

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

  const dataCategories = [
    { id: "patient-records", label: t("backup.categories.labels.patient-records"), size: "1.2 GB", checked: true },
    { id: "clinical-notes", label: t("backup.categories.labels.clinical-notes"), size: "450 MB", checked: true },
    { id: "images", label: t("backup.categories.labels.images"), size: "600 MB", checked: true },
    { id: "appointments", label: t("backup.categories.labels.appointments"), size: "80 MB", checked: true },
    { id: "billing", label: t("backup.categories.labels.billing"), size: "120 MB", checked: true },
    { id: "settings", label: t("backup.categories.labels.settings"), size: "5 MB", checked: true },
  ];

  const handleCloseRestoreModal = () => {
    if (isRestoring) return; // no cerrar mientras restaura
    setShowRestoreModal(false);
    setRestoreSuccess(false);
  };

  const handleConfirmDelete = async (id) => {
    const { success } = await deleteBackupRecord(id);
    if (success) setBackupToDelete(null);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

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

        {/* Estado actual — ahora con datos reales */}
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
              <span className="text-sm font-medium text-foreground">
                {lastBackupFormatted ? `${lastBackupFormatted.date} ${lastBackupFormatted.time}` : "Sin backups aún"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("backup.status.size")}</span>
              <span className="text-sm font-medium text-foreground">
                {lastBackup ? formatSize(lastBackup.size_bytes) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("backup.status.next_scheduled")}</span>
              <span className="text-sm font-medium text-foreground">-</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{t("backup.status.total_backups")}</span>
              <span className="text-sm font-medium text-foreground">{backupHistory.length}</span>
            </div>

            {backupError && <p className="text-xs text-red-500 font-medium">{backupError}</p>}

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                iconName={isCreatingBackup ? "Loader" : "Download"}
                onClick={() => createManualBackup(selectedCategories)}
                disabled={isCreatingBackup || selectedCategories.length === 0}
              >
                {isCreatingBackup ? t("backup.status.creating") : t("backup.status.manual_btn")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías — sin cambios funcionales por ahora */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-headline font-semibold text-base text-foreground mb-4">{t("backup.categories.title")}</h4>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategories(DATA_CATEGORIES.map((c) => c.id))}
              className="text-xs text-primary hover:underline"
            >
              {t("backup.categories.selectAll")}
            </button>
            <button onClick={() => setSelectedCategories([])} className="text-xs text-muted-foreground hover:underline">
              {t("backup.categories.clear")}
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{t("backup.categories.subtitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataCategories.map((category) => {
            const categoryConfig = DATA_CATEGORIES.find((c) => c.id === category.id);
            const isSelected = selectedCategories.includes(category.id);

            return (
              <div
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-transparent hover:border-border"
                }`}
              >
                <Checkbox checked={isSelected} onChange={() => handleCategoryToggle(category.id)} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <label className="font-medium text-sm text-foreground cursor-pointer block">{category.label}</label>
                  <p className="text-xs text-muted-foreground">{category.size}</p>
                  {categoryConfig && (
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">
                      {categoryConfig.tables.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-xs text-red-500 mt-3">{t("backup.categories.minSelection")}</p>
        )}
      </div>

      {/* Historial — ahora con datos reales de Supabase */}
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
          {loadingHistory ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t("backup.history.loading")}</div>
          ) : backupHistory.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t("backup.history.empty")}</div>
          ) : (
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
                {backupHistory.map((backup) => {
                  const isAutomatic = backup.type === "automatic";
                  const isCompleted = backup.status === "completed";
                  const { date, time } = formatDate(backup.created_at);

                  return (
                    <tr key={backup.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{date}</div>
                        <div className="text-xs text-muted-foreground">{time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatSize(backup.size_bytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            isAutomatic ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {isAutomatic ? t("common.labels.automatic") : t("common.labels.manual")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDuration(backup.duration_ms)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            isCompleted ? "bg-success/10 text-success" : "bg-error/10 text-error"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-success" : "bg-error"}`} />
                          {isCompleted ? t("common.status.completed") : t("common.status.failed")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {isCompleted && <Button variant="ghost" size="icon" iconName="Download" />}
                          <Button
                            variant="ghost"
                            size="icon"
                            iconName="Trash2"
                            onClick={() => setBackupToDelete(backup)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Alerta de restauración */}
      <div className="bg-error/10 border border-error/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm text-foreground mb-1">{t("backup.warning.title")}</h5>
            <p className="text-xs text-muted-foreground mb-3">{t("backup.warning.description")}</p>
            <Button variant="outline" size="sm" iconName="RotateCcw" onClick={() => setShowRestoreModal(true)}>
              {t("backup.warning.restore_btn")}
            </Button>
          </div>
        </div>
      </div>

      {showRestoreModal && (
        <RestoreModal
          onClose={handleCloseRestoreModal}
          onConfirm={restoreFromFile}
          isRestoring={isRestoring}
          restoreProgress={restoreProgress}
          restoreError={restoreError}
          restoreSuccess={restoreSuccess}
        />
      )}

      {backupToDelete && (
        <DeleteBackupModal
          backup={backupToDelete}
          onClose={() => setBackupToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
          formatSize={formatSize}
        />
      )}
    </div>
  );
};

export default BackupRestore;
