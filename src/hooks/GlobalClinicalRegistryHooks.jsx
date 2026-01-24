import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { formatDateForUI } from "../utils/formatters/date";
import { formatCurrency } from "../utils/formatters/currency";

export const useGlobalClinicalRegistry = (filters) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clinical_records")
        .select(
          `
          *,
          patients (name, patient_id),
          treatment_services (name),
          providers (
            specialty,
           user_profiles (full_name)
          )
        `
        )
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map((item) => {
        // Extraemos provider (array [0])
        const providerData = Array.isArray(item.providers) ? item.providers[0] : item.providers;

        // Extraemos el perfil (array [0])
        const profileData = Array.isArray(providerData?.user_profiles) ? providerData.user_profiles[0] : providerData?.user_profiles;

        return {
          ...item,
          patientName: item.patients?.name || "patient not found",
          patientId: item.patients?.patient_id || "N/A",
          treatmentName: item.treatment_services?.name || "treatment",
          formattedCost: formatCurrency(item.actual_cost),
          formattedDate: formatDateForUI(item.created_at),
          provider: profileData?.full_name || "not found",
          toothNumber: item.tooth_number || "N/A",
          date: item.created_at ? item.created_at.split("T")[0] : "",
          attachments: item.attachments || [],
        };
      });

      setAllData(normalized);
    } catch (err) {
      console.error("Error en useGlobalClinicalRegistry:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRecords = useMemo(() => {
    return allData.filter((record) => {
      const searchLower = filters.searchQuery?.toLowerCase();
      const matchesSearch =
        !searchLower || record.patientName?.toLowerCase().includes(searchLower) || record.patientId?.toLowerCase().includes(searchLower) || record.treatmentName?.toLowerCase().includes(searchLower);

      const matchesType = filters.treatmentType === "all" || record.category === filters.treatmentType;
      const matchesStatus = filters.status === "all" || record.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allData, filters]);

  const stats = useMemo(
    () => ({
      totalRecords: filteredRecords.length,
      completed: filteredRecords.filter((r) => r.status === "completed").length,
      inProgress: filteredRecords.filter((r) => r.status === "in-progress" || r.status === "inProgress").length,
      planned: filteredRecords.filter((r) => r.status === "planned").length,
    }),
    [filteredRecords]
  );

  return {
    records: filteredRecords,
    loading,
    stats,
    refresh: fetchData,
  };
};
