import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // ajustá el path a tu cliente

const LIMIT = 5;

export function useRecentActivity(providerId) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerId) return;
    fetchActivity();
  }, [providerId]);

  async function fetchActivity() {
    setLoading(true);
    setError(null);

    try {
      // Las tres queries en paralelo, todas filtradas por provider_id
      const [apptRes, recordRes, noteRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(
            `
            id, created_at, status, reason, notes,
            patient:patients(id, name, avatar, avatar_alt)
          `
          )
          .eq("provider_id", providerId)
          .order("created_at", { ascending: false })
          .limit(LIMIT),

        supabase
          .from("clinical_records")
          .select(
            `
            id, created_at, status, priority, tooth_number,
            service:treatment_services(name),
            patient:patients(id, name, avatar, avatar_alt)
          `
          )
          .eq("provider_id", providerId)
          .order("created_at", { ascending: false })
          .limit(LIMIT),

        supabase
          .from("clinical_notes")
          .select(
            `
            id, created_at, type, content,
            record:clinical_records(
              id,
              patient:patients(id, name, avatar, avatar_alt)
            )
          `
          )
          .eq("provider_id", providerId)
          .order("created_at", { ascending: false })
          .limit(LIMIT),
      ]);

      if (apptRes.error) throw apptRes.error;
      if (recordRes.error) throw recordRes.error;
      if (noteRes.error) throw noteRes.error;

      // Normalizamos cada fuente al shape que espera RecentActivityItem
      const appointments = (apptRes.data ?? []).map((a) => ({
        id: `appt-${a.id}`,
        type: "appointment",
        created_at: a.created_at,
        time: formatRelative(a.created_at),
        userName: a.patient?.name ?? "Paciente",
        userImage: a.patient?.avatar,
        userImageAlt: a.patient?.avatar_alt ?? a.patient?.name,
        description: `Turno ${translateStatus(a.status)} · ${a.reason}`,
        meta: { status: a.status, patientId: a.patient?.id },
      }));

      const records = (recordRes.data ?? []).map((r) => ({
        id: `rec-${r.id}`,
        type: "treatment",
        created_at: r.created_at,
        time: formatRelative(r.created_at),
        userName: r.patient?.name ?? "Paciente",
        userImage: r.patient?.avatar,
        userImageAlt: r.patient?.avatar_alt ?? r.patient?.name,
        description: `${r.service?.name ?? "Tratamiento"} · Pieza ${r.tooth_number} · ${translateRecordStatus(r.status)}`,
        meta: { priority: r.priority, patientId: r.patient?.id },
      }));

      const notes = (noteRes.data ?? []).map((n) => ({
        id: `note-${n.id}`,
        type: "note",
        created_at: n.created_at,
        time: formatRelative(n.created_at),
        userName: n.record?.patient?.name ?? "Paciente",
        userImage: n.record?.patient?.avatar,
        userImageAlt: n.record?.patient?.avatar_alt ?? n.record?.patient?.name,
        description: `Nota ${translateNoteType(n.type)} · ${truncate(n.content, 60)}`,
        meta: { noteType: n.type, recordId: n.record?.id },
      }));

      // Unificamos, ordenamos por fecha desc y tomamos los últimos 10
      const merged = [...appointments, ...records, ...notes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, LIMIT);

      setActivities(merged);
    } catch (err) {
      console.error("useRecentActivity:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { activities, loading, error, refetch: fetchActivity };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function truncate(str, len) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

function translateStatus(status) {
  const map = { scheduled: "programado", confirmed: "confirmado", completed: "completado", cancelled: "cancelado" };
  return map[status] ?? status;
}

function translateRecordStatus(status) {
  const map = { planned: "planificado", inProgress: "en curso", completed: "completado" };
  return map[status] ?? status;
}

function translateNoteType(type) {
  const map = { followUp: "de seguimiento", progress: "de progreso", treatment: "de tratamiento" };
  return map[type] ?? type;
}
