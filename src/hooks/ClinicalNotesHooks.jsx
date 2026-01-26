import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase"; // Ajusta la ruta a tu cliente
import { useAuth } from "../contexts/AuthContext"; // Asumiendo que tienes un contexto de auth

export const useClinicalNotes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addNote = async (recordId, content, type = "progress") => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("clinical_notes")
        .insert([
          {
            record_id: recordId,
            provider_id: user.id,
            content: content.trim(),
            type: type,
          },
        ])
        .select(
          `
          *,
          providers (
            user_profiles (full_name)
          )
        `
        )
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err) {
      console.error("Error in addNote:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    addNote,
    loading,
    error,
  };
};
