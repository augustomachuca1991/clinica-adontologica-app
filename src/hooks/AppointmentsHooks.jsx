import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "i18next";

export const useAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();

  const mapAppointments = (data) => {
    return data.map((appt) => {
      const pureDateString = appt.appointment_date
        .substring(0, 19)
        .replace(" ", "T");

      // 3. Creamos la fecha. Al no tener "+00" ni "Z", JS la toma como LOCAL
      const appointmentDate = new Date(pureDateString);

      return {
        id: appt.id,
        patientName: appt.patients?.name || "Paciente desconocido",
        // Si el avatar es null, usamos ui-avatars como fallback
        patientImage:
          appt.patients?.avatar ||
          `https://ui-avatars.com/api/?background=b97beb&color=fff&name=${encodeURIComponent(appt.patients?.name || "P")}`,
        patientImageAlt: `Retrato de ${appt.patients?.name}`,
        patientId: appt.patient_id,
        treatment: appt.reason, // O appt.treatment_services?.name si hiciste el join
        time: `${String(appointmentDate.getHours()).padStart(2, "0")}:${String(appointmentDate.getMinutes()).padStart(2, "0")}`,
        date: appointmentDate,
        duration: `${appt.duration_min} min`,
        status: appt.status || "confirmed",
        priority: appt.priority || "medium", // Asumiendo que tienes esta columna o lógica
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
      const formattedData = mapAppointments(data);
      setAppointments(formattedData);
    } catch (err) {
      console.error("Error fetching appointments:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("No hay un usuario autenticado.");

      /* const dateToSave = appointmentData.date.replace("Z", ""); */

      const { data, error } = await supabase.from("appointments").insert([
        {
          patient_id: appointmentData.patientId, // ID del paciente seleccionado
          provider_id: user.id, // El dentista actual
          appointment_date: appointmentData.date, // ISO String (2026-01-26T10:00:00)
          duration_min: parseInt(appointmentData.duration) || 30,
          reason: appointmentData.reason,
          status: "scheduled", // Valor por defecto según nuestro script SQL
          notes: appointmentData.notes || "",
        },
      ]).select(`
          *,
          patients (name, avatar)
        `);

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error al agendar cita:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id, updatedData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          appointment_date: updatedData.date,
          duration_min: parseInt(updatedData.duration),
          reason: updatedData.reason,
          status: updatedData.status,
          notes: updatedData.notes || t("appointment.rescheduled") || "",
        })
        .eq("id", id)
        .eq("provider_id", user.id) // SEGURIDAD: Solo el dueño puede editar
        .select();

      if (error) throw error;
      await fetchAppointments(); // Recargamos la lista
      return { success: true };
    } catch (err) {
      console.error("Error updating:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .eq("provider_id", user.id); // Seguridad: solo el dueño borra

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
    loading,
  };
};
