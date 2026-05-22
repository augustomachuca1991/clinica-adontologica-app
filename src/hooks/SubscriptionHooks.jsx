import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("subscriptions").select(
        `id, 
         status, 
         current_period_end, 
         created_at,
         user_profiles (
          id,
          email,
          username,
          full_name,
          profession,
          phone,
          address,
          status
         )`
      );

      if (error) throw error;

      setSubscriptions(data);
    } catch (err) {
      setError(err.message || "Error al cargar suscripciones");
    } finally {
      setLoading(false);
    }
  }, []);

  const renewSubscription = async (subscriptionId, startDateString) => {
    try {
      // 1. Obtener el usuario actual logueado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuario no autenticado.");

      // Traemos el nombre del rol desde la tabla 'roles' usando la relación definida
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select(
          `
        role_id,
        roles ( name )
      `
        )
        .eq("user_id", user.id);

      if (rolesError) throw rolesError;

      const isAdmin = userRoles?.some((ur) => ur.roles?.name === "admin");

      if (!isAdmin) {
        throw new Error("Acción denegada: Se requieren permisos de administrador.");
      }

      const startDate = new Date(startDateString);
      // Calculamos 1 mes después de la fecha elegida
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          current_period_end: endDate.toISOString(),
        })
        .eq("id", subscriptionId);

      if (error) throw error;

      // Refrescamos la lista del componente automáticamente
      await fetchSubscriptions();
      return { success: true };
    } catch (err) {
      console.error("Error al renovar suscripción:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    loading,
    error,
    refresh: fetchSubscriptions,
    renewSubscription,
  };
};
