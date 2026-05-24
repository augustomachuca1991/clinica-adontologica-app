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
        .from("provider_services")
        .select(
          `
            id,
            provider_id,
            service:treatment_services (
              id,
              name,
              base_cost,
              estimated_duration_min,
              description,
              is_active,
              category:service_categories(id, name)
            )
          `
        )
        .eq("provider_id", user.id);

      if (error) throw error;
      const flatServices = data.map((item) => item.service).filter((service) => service !== null); // Evita problemas si hay filas huérfanas

      // 3. Ordenamos alfabéticamente por nombre en JavaScript (ya que Supabase no ordena sub-tablas plano M:M directamente de forma limpia)
      flatServices.sort((a, b) => a.name.localeCompare(b.name));

      setServices(flatServices);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 2. Agregar un nuevo servicio
  const addService = async (formData) => {
    try {
      const { data: newServiceData, error: serviceError } = await supabase
        .from("treatment_services")
        .insert([
          {
            category_id: formData.categoryId,
            name: formData.name,
            base_cost: formData.baseCost,
            estimated_duration_min: formData.duration || 30,
            // Eliminado: provider_id ya no va aquí
          },
        ])
        .select()
        .single(); // .single() nos devuelve el objeto directo en lugar de un array

      if (serviceError) throw serviceError;
      const { error: relationError } = await supabase.from("provider_services").insert([
        {
          provider_id: user.id,
          service_id: newServiceData.id, // El ID numérico que se acaba de generar en el Paso 1
        },
      ]);

      if (relationError) throw relationError;
      setServices((prev) => [newServiceData, ...prev]);

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
