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

  const createSubscription = async (values) => {
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    const { error } = await supabase.from("subscriptions").insert([
      {
        user_id: values.userId,
        status: "active",
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
      },
    ]);

    if (error) throw error;

    await refresh();
  };

  const renewSubscription = async (subscriptionId, startDateString, amountPaid = 0) => {
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
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // Suma 1 mes exacto

      const { data: currentSub, error: subError } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("id", subscriptionId)
        .single();

      if (subError) throw subError;

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "active", // Vuelve a estar activo al renovar
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
        })
        .eq("id", subscriptionId);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase.from("subscription_history").insert({
        subscription_id: subscriptionId,
        user_id: currentSub.user_id,
        amount: amountPaid, // Podés pasarle el monto desde el formulario del AdminPanel
        period_start: startDate.toISOString(),
        period_end: endDate.toISOString(),
      });

      if (historyError) throw historyError;

      await fetchSubscriptions();
      return { success: true };
    } catch (err) {
      console.error("Error al renovar suscripción con historial:", err);
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
    createSubscription,
    renewSubscription,
  };
};

export const getSubscriptionStats = (subscriptions) => {
  const hoy = new Date();
  const en30Dias = new Date(hoy.getTime() + 30 * 86400000);

  let active = 0;
  let expiringSoon = 0;
  let expired = 0;

  (subscriptions || []).forEach((sub) => {
    const fin = new Date(sub.current_period_end);
    if (hoy <= fin) {
      active++;
      if (fin <= en30Dias) expiringSoon++;
    } else {
      expired++;
    }
  });

  return { total: subscriptions?.length || 0, active, expiringSoon, expired };
};
