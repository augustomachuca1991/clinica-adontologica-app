import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();

  const mapAppointments = (data) => {
    return data.map((appt) => {
      const pureDateString = appt.appointment_date.substring(0, 19).replace(" ", "T");
      const appointmentDate = new Date(pureDateString);

      return {
        id: appt.id,
        patientName: appt.patients?.name || "Paciente desconocido",
        patientImage:
          appt.patients?.avatar ||
          `https://ui-avatars.com/api/?background=b97beb&color=fff&name=${encodeURIComponent(appt.patients?.name || "P")}`,
        patientImageAlt: `Retrato de ${appt.patients?.name}`,
        patientId: appt.patient_id,
        treatment: appt.reason,
        time: `${String(appointmentDate.getHours()).padStart(2, "0")}:${String(appointmentDate.getMinutes()).padStart(2, "0")}`,
        date: appointmentDate,
        duration: appt.duration_min,
        status: appt.status || "confirmed",
        priority: appt.priority || "medium",
        serviceId: appt.service_id,
        notes: appt.notes,
      };
    });
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          duration_min,
          reason,
          status,
          notes,
          patient_id,
          service_id,
          patients (
            id,
            name,
            avatar,
            patient_id
          )
        `
        )
        .eq("provider_id", user?.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(mapAppointments(data));
    } catch (err) {
      console.error("Error fetching appointments:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ─── Validación de solapamiento ───────────────────────────────────────────────
  // Lógica: hay solapamiento solo si:
  //   inicio_nueva  < fin_existente
  //   Y fin_nueva   > inicio_existente
  //
  // Esto permite citas consecutivas: si una termina a las 12:00
  // y la nueva empieza a las 12:00 → NO hay solapamiento.
  //
  // excludeId: para excluir la cita actual al editar (no chocar consigo misma)
  const checkOverlap = useCallback(
    async (startDate, durationMin, excludeId = null) => {
      try {
        const newStart = new Date(startDate);
        const newEnd = new Date(newStart.getTime() + durationMin * 60 * 1000);

        // Traemos las citas del mismo día del provider
        const dayStart = new Date(newStart);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(newStart);
        dayEnd.setHours(23, 59, 59, 999);

        let query = supabase
          .from("appointments")
          .select("id, appointment_date, duration_min, patients(name)")
          .eq("provider_id", user?.id)
          .not("status", "in", '("cancelled","no_show")') // ignorar canceladas
          .gte("appointment_date", dayStart.toISOString())
          .lte("appointment_date", dayEnd.toISOString());

        if (excludeId) query = query.neq("id", excludeId);

        const { data, error } = await query;
        if (error) throw error;

        const conflicts = (data || []).filter((appt) => {
          const existStart = new Date(appt.appointment_date.substring(0, 19).replace(" ", "T"));
          const existEnd = new Date(existStart.getTime() + appt.duration_min * 60 * 1000);

          // Solapamiento real — citas consecutivas quedan permitidas (< estricto, no <=)
          return newStart < existEnd && newEnd > existStart;
        });

        return {
          hasConflict: conflicts.length > 0,
          conflicts: conflicts.map((c) => ({
            id: c.id,
            patientName: c.patients?.name || "Paciente",
            start: new Date(c.appointment_date.substring(0, 19).replace(" ", "T")),
            end: new Date(
              new Date(c.appointment_date.substring(0, 19).replace(" ", "T")).getTime() + c.duration_min * 60 * 1000
            ),
          })),
        };
      } catch (err) {
        console.error("Error checking overlap:", err.message);
        return { hasConflict: false, conflicts: [] };
      }
    },
    [user]
  );

  // ─── Agregar ──────────────────────────────────────────────────────────────────
  const addAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("No hay un usuario autenticado.");

      const duration = parseInt(appointmentData.duration) || 30;

      // Validar solapamiento antes de insertar
      const { hasConflict, conflicts } = await checkOverlap(appointmentData.date, duration);
      if (hasConflict) {
        const conflict = conflicts[0];
        const h = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return {
          success: false,
          conflict: true,
          error: `Conflicto con la cita de ${conflict.patientName} (${h(conflict.start)} – ${h(conflict.end)})`,
        };
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: appointmentData.patientId,
            provider_id: user.id,
            appointment_date: appointmentData.date,
            duration_min: duration,
            reason: appointmentData.reason,
            status: "scheduled",
            notes: appointmentData.notes || "",
            service_id: appointmentData.serviceId,
          },
        ])
        .select(`*, patients (name, avatar)`);

      if (error) throw error;

      const [newAppt] = mapAppointments(data);
      setAppointments((prev) => [...prev, newAppt].sort((a, b) => a.date - b.date));

      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error al agendar cita:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Actualizar ───────────────────────────────────────────────────────────────
  const updateAppointment = async (id, updatedData) => {
    setLoading(true);
    try {
      const duration = parseInt(updatedData.duration) || 30;

      // Validar solapamiento excluyendo la cita que se edita
      const { hasConflict, conflicts } = await checkOverlap(updatedData.date, duration, id);
      if (hasConflict) {
        const conflict = conflicts[0];
        const h = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        return {
          success: false,
          conflict: true,
          error: `Conflicto con la cita de ${conflict.patientName} (${h(conflict.start)} – ${h(conflict.end)})`,
        };
      }

      const { error } = await supabase
        .from("appointments")
        .update({
          appointment_date: updatedData.date,
          duration_min: duration,
          reason: updatedData.reason,
          status: updatedData.status,
          notes: updatedData.notes || "",
        })
        .eq("id", id)
        .eq("provider_id", user.id);

      if (error) throw error;

      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.error("Error updating:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ─── Eliminar ─────────────────────────────────────────────────────────────────
  const deleteAppointment = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id).eq("provider_id", user.id);

      if (error) throw error;
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error al eliminar:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    checkOverlap,
    loading,
  };
};
