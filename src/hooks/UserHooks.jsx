import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { sanitizeText } from "@/utils/sanitize";

export const useUserRegistration = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", roleId: "", phone: "" });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NUEVOS ESTADOS PARA LISTAR USUARIOS ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // --- NUEVA FUNCIÓN PARA TRAER LOS USUARIOS ---
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      // 1. Buscamos en 'user_roles' en lugar de 'role_users'
      // (Cambiá el 1 si el ID de tu rol Admin es un UUID o un texto)
      const { data: adminRelations, error: adminError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role_id", 1);

      if (adminError) throw adminError;

      // Creamos el Set con los IDs de los admins
      const adminIdsSet = new Set(adminRelations?.map((row) => row.user_id) || []);

      // 2. Traemos todos los perfiles de usuario
      const { data: allProfiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("id, full_name, email, username");

      if (profilesError) throw profilesError;

      // 3. Filtramos para dejar solo a los clientes comunes (no admins)
      const clientesNoAdmin = (allProfiles || []).filter((profile) => !adminIdsSet.has(profile.id));

      setUsers(clientesNoAdmin);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Trae los usuarios automáticamente cuando se monta el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRegisterUser = async (e) => {
    if (e) e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    let cleanName = sanitizeText(formData.fullName);
    let cleanEmail = formData.email.trim().toLowerCase();

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'\-\.]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let cleanPhone = formData.phone ? sanitizeText(formData.phone) : null;

    if (cleanName.length < 3 || !nameRegex.test(cleanName)) {
      setFormError("El nombre no es válido (debe tener al menos 3 letras, sin números ni símbolos).");
      setIsSubmitting(false);
      return { success: false };
    }

    if (!emailRegex.test(cleanEmail)) {
      setFormError("El formato del email profesional no es válido.");
      setIsSubmitting(false);
      return { success: false };
    }

    try {
      const generatedPassword = Array.from({ length: 16 }, () =>
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$".charAt(
          Math.floor(Math.random() * 58)
        )
      ).join("");

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: generatedPassword,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
          },
        },
      });

      if (authError) throw authError;

      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setFormData({ fullName: "", email: "", roleId: "", phone: "" });
      setSelectedRoles([]);
      fetchUsers();

      return { success: true };
    } catch (err) {
      console.error(err);
      setFormError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedRoles,
    setSelectedRoles,
    formError,
    setFormError,
    isSubmitting,
    handleRoleChange,
    handleRegisterUser,
    users,
    loadingUsers,
    fetchUsers,
  };
};

export const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("user_profiles").select(`
          id,
          full_name,
          email,
          status,
          created_at,
          user_roles (
            roles ( name )
          )
        `);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, fetchUsers, setUsers };
};
