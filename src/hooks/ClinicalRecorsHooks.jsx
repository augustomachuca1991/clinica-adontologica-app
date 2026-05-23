import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useClinicalRecords = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    planned: 0,
    inProgress: 0,
    completed: 0,
  });
  const [records, setRecords] = useState([]);

  const fetchPatientSummary = useCallback(async (patientId) => {
    if (!patientId) return;

    try {
      const { data, error } = await supabase.from("clinical_records").select("status").eq("patient_id", patientId);

      if (error) throw error;

      const stats = data.reduce(
        (acc, curr) => {
          const key = curr.status === "in-progress" ? "inProgress" : curr.status;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        { planned: 0, inProgress: 0, completed: 0 }
      );

      setSummary(stats);
    } catch (err) {
      console.error("Error fetching summary:", err.message);
    }
  }, []);

  const fetchPatientRecords = useCallback(async (patientId) => {
    if (!patientId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clinical_records")
        .select(
          `
          id,
          tooth_number,
          service_id,
          actual_cost,
          status,
          notes,
          date,
          created_at,
          estimated_duration,
          priority,
          patient_id,
          patients (
            patient_id,
            name
          ),
          treatment_services (name),
          providers!provider_id (
            license_number,
            specialty,
            first_name,
            last_name
          ),
          clinical_notes (
            id,
            content,
            type,
            is_private,
            created_at,
            providers (
              first_name,
              last_name
            )
          )
          `
        )
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedRecords = data.map((r) => {
        const providerFirstName = r.providers?.first_name || "";
        const providerLastName = r.providers?.last_name || "";
        const providerName = [providerFirstName, providerLastName].filter(Boolean).join(" ") || "N/A";

        return {
          id: r.id,
          toothNumber: r.tooth_number,
          procedure: r.service_id,
          cost: r.actual_cost,
          status: r.status,
          notes: r.notes,
          isPersisted: true,
          duration: r.estimated_duration,
          priority: r.priority,
          date: r.date,
          patientId: r.patients?.patient_id,
          patientName: r.patients?.name || "Name Patient",
          treatmentName: r.treatment_services?.name || "N/A",
          provider: {
            license: r.providers?.license_number || "N/A",
            name: providerName,
            especialidad: r.providers?.specialty || "N/A",
          },
          clinical_notes: (r.clinical_notes || []).map((note) => ({
            ...note,
            providerName: [note.providers?.first_name, note.providers?.last_name].filter(Boolean).join(" ") || "N/A",
          })),
        };
      });

      setRecords(formattedRecords);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTreatmentPlan = async (patientId, treatments) => {
    if (!user?.id || !patientId || treatments.length === 0) return { success: false, error: "Missing data" };

    setLoading(true);
    try {
      const recordsToSave = treatments.map((t) => ({
        patient_id: patientId,
        provider_id: user.id,
        service_id: t.procedure,
        tooth_number: t.toothNumber,
        actual_cost: t.cost,
        notes: t.notes || "",
        status: t.status,
        date: new Date().toISOString(),
        estimated_duration: t.duration,
        priority: t.priority,
      }));

      const { data, error } = await supabase.from("clinical_records").insert(recordsToSave).select();

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error("Error saving clinical records:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateClinicalRecord = async (recordId, updatedData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("clinical_records")
        .update({
          service_id: updatedData.procedure,
          tooth_number: updatedData.toothNumber,
          actual_cost: updatedData.cost,
          status: updatedData.status,
          notes: updatedData.notes,
          estimated_duration: updatedData.duration,
          priority: updatedData.priority,
        })
        .eq("id", recordId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error("Error updating record:", err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveTreatmentPlan,
    fetchPatientSummary,
    fetchPatientRecords,
    updateClinicalRecord,
    records,
    summary,
    loading,
  };
};
