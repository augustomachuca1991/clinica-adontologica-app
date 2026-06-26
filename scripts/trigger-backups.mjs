// src/lib/functions/trigger-backups.mjs
// Ejecutado por GitHub Actions en cada tick del cron.
// Lee backup_config de Supabase y ejecuta backup si now() >= next_run.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Duplicado de DATA_CATEGORIES para no depender de Vite
const DATA_CATEGORIES = [
  { id: "patient-records", tables: ["patients", "clinical_records"] },
  { id: "clinical-notes", tables: ["clinical_notes"] },
  { id: "images", tables: ["treatment_services", "service_categories", "provider_services", "providers"] },
  { id: "appointments", tables: ["appointments"] },
  { id: "billing", tables: ["subscriptions", "subscription_history"] },
  { id: "settings", tables: ["roles", "user_profiles", "user_roles", "backup_history"] },
];

const ORDERED_TABLES = [
  "roles", "user_profiles", "user_roles", "patients", "providers",
  "service_categories", "treatment_services", "appointments",
  "clinical_records", "clinical_notes", "subscriptions",
  "subscription_history", "backup_history", "provider_services",
];

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

function formatTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

async function run() {
  console.log("Checking backup schedule...");

  // 1. Leer config
  const { data: configs, error: configError } = await supabase
    .from("backup_config")
    .select("*")
    .limit(1);

  if (configError) {
    console.error("Error reading backup_config:", configError.message);
    process.exit(1);
  }

  const config = configs?.[0];
  if (!config) {
    console.log("No backup_config found. Skipping.");
    return;
  }

  const now = new Date();
  const nextRun = config.next_run ? new Date(config.next_run) : null;

  if (nextRun && now < nextRun) {
    console.log(`Next backup not due yet. Next run: ${config.next_run}`);
    return;
  }

  console.log("Backup due. Starting...");
  const startTime = Date.now();
  const snapshot = {};
  const errors = [];

  // 2. Queryear tablas según categorías + siempre incluir backup_history
  const tablesToBackup = [...getOrderedTables(config.selected_categories || []), "backup_history"];

  for (const table of tablesToBackup) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Error reading ${table}:`, error.message);
      errors.push({ table, error: error.message });
    } else {
      snapshot[table] = data;
    }
  }

  const duration = Date.now() - startTime;

  // 3. Construir JSON
  const jsonStr = JSON.stringify(
    {
      _meta: {
        created_at: new Date().toISOString(),
        type: "automatic",
        categories: config.selected_categories,
      },
      ...snapshot,
    },
    null,
    2
  );

  const sizeBytes = new Blob([jsonStr]).size;
  const success = errors.length === 0;

  // 4. Subir a Storage
  const timestamp = formatTimestamp();
  const storagePath = `backups/backup_${timestamp}.json`;

  const { error: uploadError } = await supabase.storage
    .from("backups")
    .upload(storagePath, jsonStr, {
      contentType: "application/json",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading to storage:", uploadError.message);
  }

  // 5. Registrar en backup_history
  const { error: insertError } = await supabase.from("backup_history").insert({
    type: "automatic",
    status: success ? "completed" : "failed",
    size_bytes: sizeBytes,
    duration_ms: duration,
    tables_included: tablesToBackup,
    error_detail: errors.length ? JSON.stringify(errors) : null,
    storage_path: uploadError ? null : storagePath,
  });

  if (insertError) {
    console.error("Error inserting history record:", insertError.message);
  }

  // 6. Actualizar next_run
  const newNextRun = calculateNextRun(config.frequency || "daily");
  const { error: updateError } = await supabase
    .from("backup_config")
    .update({
      last_run: new Date().toISOString(),
      next_run: newNextRun,
      updated_at: new Date().toISOString(),
    })
    .eq("id", config.id);

  if (updateError) {
    console.error("Error updating backup_config:", updateError.message);
  }

  // 7. Limpiar backups viejos según retention
  const retentionDays = config.retention_days || 30;
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const { data: oldBackups, error: fetchOldError } = await supabase
    .from("backup_history")
    .select("id, storage_path")
    .lt("created_at", cutoff)
    .eq("type", "automatic");

  if (!fetchOldError && oldBackups?.length > 0) {
    // Borrar de Storage
    const oldPaths = oldBackups.map((b) => b.storage_path).filter(Boolean);
    if (oldPaths.length > 0) {
      const { error: storageDeleteError } = await supabase.storage.from("backups").remove(oldPaths);
      if (storageDeleteError) {
        console.error("Error deleting old backup files:", storageDeleteError.message);
      }
    }

    // Borrar del historial
    const oldIds = oldBackups.map((b) => b.id);
    const { error: historyDeleteError } = await supabase
      .from("backup_history")
      .delete()
      .in("id", oldIds);

    if (historyDeleteError) {
      console.error("Error deleting old history records:", historyDeleteError.message);
    }

    console.log(`Cleaned up ${oldBackups.length} old backup(s) ( > ${retentionDays} days)`);
  }

  console.log(
    `Backup ${success ? "completed" : "completed with errors"} — ${(sizeBytes / 1024).toFixed(1)} KB — ${duration}ms`
  );
  if (errors.length > 0) {
    console.error("Tables with errors:", errors.map((e) => e.table).join(", "));
  }
}

run().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
