// src/hooks/ServiceCategoriesHooks.js
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useServices = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from("service_categories").select("*").order("name");
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching categories:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async ({ name, description }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("service_categories")
        .insert({ name: name.trim(), description: description.trim() })
        .select()
        .single();
      if (error) throw error;
      await fetchCategories();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async (id, { name, description }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("service_categories")
        .update({ name: name.trim(), description: description.trim(), updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await fetchCategories();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    setIsDeleting(true);
    setError(null);
    try {
      const { error } = await supabase.from("service_categories").delete().eq("id", id);
      if (error) throw error;
      await fetchCategories();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    categories,
    loading,
    isSubmitting,
    isDeleting,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
