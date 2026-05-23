// src/hooks/ClinicalNotesHooks.js
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/**
 * useClinicalNotes
 *
 * Gestiona todas las operaciones CRUD sobre `clinical_notes`.
 * La visibilidad de notas privadas la maneja Supabase automáticamente
 * vía RLS — el hook no necesita filtrar nada manualmente.
 *
 * Columnas esperadas en clinical_notes:
 *   id, record_id, provider_id, content, type,
 *   is_private (boolean, default false),
 *   created_at, updated_at
 */
export const useClinicalNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProviderId, setCurrentProviderId] = useState(null);

  // ─── Obtener el provider_id del usuario logueado ─────────────────────────────
  // Lo cacheamos para saber si una nota es "propia" en el frontend.
  const fetchCurrentProvider = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("providers").select("id").eq("user_id", user.id).single();

    if (data) setCurrentProviderId(data.id);
    return data?.id ?? null;
  }, []);

  // ─── Fetch notas de un registro clínico ──────────────────────────────────────
  // RLS filtra automáticamente las notas privadas de otros providers.
  const fetchNotes = useCallback(async (recordId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clinical_notes")
        .select("*")
        .eq("record_id", recordId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error("useClinicalNotes.fetchNotes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Crear nota ───────────────────────────────────────────────────────────────
  const createNote = async ({ recordId, providerId, content, type = "treatment", isPrivate = false }) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("clinical_notes")
        .insert([
          {
            record_id: recordId,
            provider_id: providerId,
            content: content.trim(),
            type,
            is_private: isPrivate,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setNotes((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error("useClinicalNotes.createNote:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Actualizar nota ──────────────────────────────────────────────────────────
  // RLS rechaza silenciosamente si intentás editar nota ajena.
  const updateNote = async (id, { content, type, isPrivate }) => {
    setIsSubmitting(true);
    try {
      const payload = {};
      if (content !== undefined) payload.content = content.trim();
      if (type !== undefined) payload.type = type;
      if (isPrivate !== undefined) payload.is_private = isPrivate;

      const { data, error } = await supabase.from("clinical_notes").update(payload).eq("id", id).select().single();

      if (error) throw error;

      setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
      return { success: true, data };
    } catch (err) {
      console.error("useClinicalNotes.updateNote:", err);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Toggle is_private ────────────────────────────────────────────────────────
  // Atajo rápido para cambiar privacidad sin abrir el formulario.
  const togglePrivate = async (note) => {
    try {
      const { data, error } = await supabase
        .from("clinical_notes")
        .update({ is_private: !note.is_private })
        .eq("id", note.id)
        .select()
        .single();

      if (error) throw error;

      setNotes((prev) => prev.map((n) => (n.id === note.id ? data : n)));
      return { success: true, data };
    } catch (err) {
      console.error("useClinicalNotes.togglePrivate:", err);
      return { success: false, error: err.message };
    }
  };

  // ─── Eliminar nota ────────────────────────────────────────────────────────────
  const deleteNote = async (id) => {
    try {
      const { error } = await supabase.from("clinical_notes").delete().eq("id", id);

      if (error) throw error;

      setNotes((prev) => prev.filter((n) => n.id !== id));
      return { success: true };
    } catch (err) {
      console.error("useClinicalNotes.deleteNote:", err);
      return { success: false, error: err.message };
    }
  };

  // ─── Helper: ¿esta nota es del provider actual? ───────────────────────────────
  // Útil para condicionar botones de edición/eliminación en el componente.
  const isOwnNote = (note) => note.provider_id === currentProviderId;

  return {
    notes,
    loading,
    isSubmitting,
    currentProviderId,
    fetchNotes,
    fetchCurrentProvider,
    createNote,
    updateNote,
    togglePrivate,
    deleteNote,
    isOwnNote,
  };
};
