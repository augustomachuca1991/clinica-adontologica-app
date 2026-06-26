// src/hooks/BackupHooks.jsx
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// Orden importante: primero las tablas sin FK, después las que dependen de ellas
export const DATA_CATEGORIES = [
  {
    id: "patient-records",
    tables: ["patients", "clinical_records"],
  },
  {
    id: "clinical-notes",
    tables: ["clinical_notes"],
  },
  {
    id: "images",
    tables: ["treatment_services", "service_categories", "provider_services", "providers"],
  },
  {
    id: "appointments",
    tables: ["appointments"],
  },
  {
    id: "billing",
    tables: ["subscriptions", "subscription_history"],
  },
  {
    id: "settings",
    tables: ["roles", "user_profiles", "user_roles", "backup_history"],
  },
];

const ORDERED_TABLES = [
  "roles",
  "user_profiles",
  "user_roles",
  "patients",
  "providers",
  "service_categories",
  "treatment_services",
  "appointments",
  "clinical_records",
  "clinical_notes",
  "subscriptions",
  "subscription_history",
  "backup_history",
  "provider_services",
];

// Tablas que solo necesitan INSERT (no upsert) porque sus datos raramente cambian
const INSERT_ONLY_TABLES = ["roles"];

function getOrderedTables(selectedCategories) {
  const selectedTables = new Set(
    DATA_CATEGORIES.filter((c) => selectedCategories.includes(c.id)).flatMap((c) => c.tables)
  );
  return ORDERED_TABLES.filter((t) => selectedTables.has(t));
}

function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case "hourly":
      now.setHours(now.getHours() + 1, 0, 0, 0);
      break;
    case "daily":
      now.setDate(now.getDate() + 1);
      now.setHours(2, 0, 0, 0);
      break;
    case "weekly":
      now.setDate(now.getDate() + (7 - now.getDay()));
      now.setHours(2, 0, 0, 0);
      break;
    case "monthly":
      now.setMonth(now.getMonth() + 1, 1);
      now.setHours(2, 0, 0, 0);
      break;
    default:
      now.setDate(now.getDate() + 1);
      now.setHours(2, 0, 0, 0);
  }
  return now.toISOString();
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const useBackup = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupError, setBackupError] = useState(null);
  const [backupHistory, setBackupHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(null);
  const [restoreError, setRestoreError] = useState(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState(null);

  const fetchBackupHistory = useCallback(async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("backup_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error) setBackupHistory(data || []);
    setLoadingHistory(false);
  }, []);

  const restoreFromFile = async (file) => {
    setIsRestoring(true);
    setRestoreError(null);
    setRestoreSuccess(false);
    setRestoreProgress({ step: "Leyendo archivo...", percent: 0 });

    try {
      const text = await file.text();
      const startTime = Date.now();
      const snapshot = JSON.parse(text);

      if (!snapshot._meta) {
        throw new Error("El archivo no es un backup válido generado por esta aplicación.");
      }

      // Restaurar en el orden definido en TABLES_TO_BACKUP (respeta FKs)
      // y excluir backup_history para no pisar el historial actual
      const tablesToRestore = ORDERED_TABLES.filter(
        (t) => t !== "backup_history" && snapshot[t] && snapshot[t].length > 0
      );

      if (tablesToRestore.length === 0) {
        throw new Error("El backup no contiene tablas para restaurar.");
      }

      const errors = [];
      let restored = 0;

      for (const table of tablesToRestore) {
        setRestoreProgress({
          step: `Restaurando ${table}...`,
          percent: Math.round((restored / tablesToRestore.length) * 100),
          current: restored + 1,
          total: tablesToRestore.length,
        });

        const rows = snapshot[table];

        // Limpiar campos que pueden causar conflicto con triggers
        const cleanRows = rows.map((row) => {
          const clean = { ...row };
          delete clean.updated_at;
          return clean;
        });

        const BATCH_SIZE = 100;
        let tableHadError = false;

        for (let i = 0; i < cleanRows.length; i += BATCH_SIZE) {
          const batch = cleanRows.slice(i, i + BATCH_SIZE);
          let queryError;

          if (INSERT_ONLY_TABLES.includes(table)) {
            // Para roles: upsert ignorando duplicados
            const { error } = await supabase.from(table).upsert(batch, {
              onConflict: "id",
              ignoreDuplicates: true, // ← true en lugar de false, no sobreescribe si ya existe
            });
            queryError = error;
          } else {
            const { error } = await supabase.from(table).upsert(batch, {
              onConflict: "id",
              ignoreDuplicates: false,
            });
            queryError = error;
          }

          if (queryError) {
            console.error(`Error en ${table}:`, {
              message: queryError.message,
              details: queryError.details,
              hint: queryError.hint,
              code: queryError.code,
            });
            errors.push({ table, error: queryError.message });
            tableHadError = true;
            break;
          }
        }

        if (!tableHadError) restored++;
      }

      // Registrar el restore en historial
      const { error: insertError } = await supabase.from("backup_history").insert({
        type: "manual",
        status: errors.length === 0 ? "completed" : "failed",
        size_bytes: new Blob([text]).size,
        duration_ms: Date.now() - startTime,
        tables_included: tablesToRestore,
        error_detail: errors.length ? JSON.stringify(errors) : null,
      });

      if (insertError) console.error("Error guardando historial:", insertError);

      await fetchBackupHistory();

      if (errors.length > 0) {
        setRestoreError(`Restore parcial. Tablas con error: ${errors.map((e) => e.table).join(", ")}`);
      } else {
        setRestoreSuccess(true);
      }

      setRestoreProgress({ step: "Completado", percent: 100 });
    } catch (err) {
      setRestoreError(err.message || "Error inesperado al restaurar.");
      setRestoreProgress(null);
    } finally {
      setIsRestoring(false);
    }
  };

  const createManualBackup = async (selectedCategories) => {
    setIsCreatingBackup(true);
    setBackupError(null);
    const startTime = Date.now();
    const snapshot = {};
    const errors = [];

    // Obtener tablas según categorías seleccionadas + siempre incluir backup_history
    const tablesToBackup = [...getOrderedTables(selectedCategories), "backup_history"];

    for (const table of tablesToBackup) {
      const { data, error } = await supabase.from(table).select("*");
      if (error) {
        errors.push({ table, error: error.message });
      } else {
        snapshot[table] = data;
      }
    }

    const duration = Date.now() - startTime;
    const jsonStr = JSON.stringify(
      {
        _meta: {
          created_at: new Date().toISOString(),
          type: "manual",
          categories: selectedCategories,
        },
        ...snapshot,
      },
      null,
      2
    );
    const sizeBytes = new Blob([jsonStr]).size;
    const success = errors.length === 0;

    const { error: insertError } = await supabase.from("backup_history").insert({
      type: "manual",
      status: success ? "completed" : "failed",
      size_bytes: sizeBytes,
      duration_ms: duration,
      tables_included: tablesToBackup,
      error_detail: errors.length ? JSON.stringify(errors) : null,
    });

    if (insertError) console.error("Error guardando historial:", insertError);

    if (success) {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setBackupError(`Backup incompleto. Tablas con error: ${errors.map((e) => e.table).join(", ")}`);
    }

    await fetchBackupHistory();
    setIsCreatingBackup(false);
    return { success, errors, sizeBytes, duration };
  };

  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    setConfigError(null);
    const { data, error } = await supabase.from("backup_config").select("*").limit(1);
    if (error) {
      setConfigError(error.message);
    } else {
      setConfig(data?.[0] || null);
    }
    setConfigLoading(false);
  }, []);

  const saveConfig = useCallback(async (form) => {
    setConfigError(null);
    const payload = {
      frequency: form.frequency,
      retention_days: parseInt(form.retentionDays, 10),
      selected_categories: form.selectedCategories,
      next_run: calculateNextRun(form.frequency),
      updated_at: new Date().toISOString(),
    };

    if (config?.id) {
      const { error } = await supabase.from("backup_config").update(payload).eq("id", config.id);
      if (error) {
        setConfigError(error.message);
        return { success: false, error: error.message };
      }
    } else {
      const { data, error } = await supabase.from("backup_config").insert(payload).select().single();
      if (error) {
        setConfigError(error.message);
        return { success: false, error: error.message };
      }
      setConfig(data);
    }

    await loadConfig();
    return { success: true };
  }, [config, loadConfig]);

  const downloadFromStorage = useCallback(async (storagePath) => {
    const { data, error } = await supabase.storage.from("backups").download(storagePath);
    if (error) {
      console.error("Error downloading backup:", error.message);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = storagePath.split("/").pop();
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const deleteBackupRecord = async (id) => {
    setIsDeleting(true);
    const { error } = await supabase.from("backup_history").delete().eq("id", id);
    if (!error) await fetchBackupHistory();
    setIsDeleting(false);
    return { success: !error };
  };

  return {
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
    config,
    configLoading,
    configError,
    loadConfig,
    saveConfig,
    downloadFromStorage,
  };
};
