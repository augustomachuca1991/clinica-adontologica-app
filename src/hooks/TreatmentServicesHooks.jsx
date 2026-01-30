import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useTreatmentServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 1. Cargar servicios del profesional logueado
  const fetchServices = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("treatment_services")
        .select(
          `
          *,
          category:service_categories(id, name)
        `
        )
        .eq("provider_id", user.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setServices(data);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. Agregar un nuevo servicio
  const addService = async (formData) => {
    try {
      const { data, error } = await supabase
        .from("treatment_services")
        .insert([
          {
            provider_id: user.id,
            category_id: formData.categoryId,
            name: formData.name,
            base_cost: formData.baseCost,
            estimated_duration_min: formData.duration || 30,
          },
        ])
        .select();

      if (error) throw error;
      setServices((prev) => [...data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // 3. Actualizar un servicio existente
  const updateService = async (id, formData) => {
    try {
      const { error } = await supabase
        .from("treatment_services")
        .update({
          name: formData.name,
          base_cost: formData.baseCost,
          category_id: formData.categoryId,
          estimated_duration_min: formData.duration,
        })
        .eq("id", id);

      if (error) throw error;
      fetchServices(); // Recargamos para ver los cambios
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    loading,
    addService,
    updateService,
    refresh: fetchServices,
  };
};
