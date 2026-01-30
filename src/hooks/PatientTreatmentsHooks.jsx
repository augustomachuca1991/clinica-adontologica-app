import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { formatDuration } from "@/utils/formatters/minToHours";

export const usePatientTreatments = (patientId) => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatments = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("clinical_records")
        .select(
          `
          *,
          treatment_services (
            name, 
            estimated_duration_min
          ),
          providers (
            user_profiles (full_name)
          ),
          clinical_notes (
            id,
            content,
            type,
            created_at
          )
        `
        )
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // MAPEADO DE DATOS REALES AL FORMATO DE TU OBJETO
      const mappedData = (data || []).map((item) => {
        // Buscamos si hay una nota tipo 'followUp'
        const followUpNote = item.clinical_notes?.find(
          (n) => n.type === "followUp"
        );

        // Obtenemos el nombre del dentista
        const dentistName = Array.isArray(item.providers)
          ? item.providers[0]?.user_profiles?.full_name
          : item.providers?.user_profiles?.full_name;

        return {
          id: item.id,
          procedure: item.treatment_services?.name || "Treatment",
          date: item.created_at ? item.created_at.split("T")[0] : "",
          status: item.status || "Completed",
          dentist: dentistName || "N/A",
          location: item.location || "Main Clinic", // Valor por defecto si no existe en BD
          duration: formatDuration(
            item.treatment_services?.estimated_duration_min
          ),
          toothNumber: item.tooth_number
            ? `#${item.tooth_number}`
            : "Full mouth",
          cost: item.actual_cost || 0,
          // Prioridad de notas: 1. Notas clínicas recientes, 2. Notas generales del registro
          notes:
            item.clinical_notes?.length > 0
              ? item.clinical_notes[0].content
              : "Sin observaciones",
          followUp: followUpNote ? followUpNote.created_at : null,
          // Mapeamos los adjuntos al formato de imágenes
          images: (item.attachments || []).map((img) => ({
            url: img.url,
            alt: img.alt || item.treatment_services?.name,
          })),
        };
      });

      setTreatments(mappedData);
    } catch (err) {
      console.error("Error fetching patient treatments:", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  return { treatments, loading, refresh: fetchTreatments };
};
