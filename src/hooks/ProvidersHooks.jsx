// src/hooks/ProvidersHooks.js
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase"; // adjust path to your supabase client

/**
 * useProviders
 *
 * Handles all CRUD operations for the `providers` table.
 *
 * Expected table schema:
 *   id              uuid (PK, auto)
 *   first_name      text
 *   last_name       text
 *   email           text (unique)
 *   phone           text
 *   specialty       text
 *   license_number  text
 *   is_active       boolean (default true)
 *   created_at      timestamptz (auto)
 *   updated_at      timestamptz (auto)
 */
export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch ───────────────────────────────────────────────────────────────────
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("providers").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (err) {
      console.error("useProviders.fetchProviders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Create ───────────────────────────────────────────────────────────────────
  const createProvider = async (payload) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("providers").insert([payload]).select().single();

      if (error) throw error;

      setProviders((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error("useProviders.createProvider:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Update ───────────────────────────────────────────────────────────────────
  const updateProvider = async (id, payload) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("providers")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProviders((prev) => prev.map((p) => (p.id === id ? data : p)));
      return { success: true, data };
    } catch (err) {
      console.error("useProviders.updateProvider:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Toggle active ────────────────────────────────────────────────────────────
  const toggleProviderStatus = async (id, currentStatus) => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setProviders((prev) => prev.map((p) => (p.id === id ? data : p)));
      return { success: true, data };
    } catch (err) {
      console.error("useProviders.toggleProviderStatus:", err);
      return { success: false, error: err.message };
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const deleteProvider = async (id) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("providers").delete().eq("id", id);

      if (error) throw error;

      setProviders((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error("useProviders.deleteProvider:", err);
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    providers,
    loading,
    isSubmitting,
    isDeleting,
    fetchProviders,
    createProvider,
    updateProvider,
    toggleProviderStatus,
    deleteProvider,
  };
};
