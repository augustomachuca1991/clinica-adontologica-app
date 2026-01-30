import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { notifyError } from "@/utils/notifications";

export const useAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // Tu context

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        notifyError(error.message);
        setLoading(false);
        return { success: false };
      }

      // Consultamos roles (tu lógica de siempre)
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select(`user_roles ( roles ( name ) )`)
        .eq("id", data.user.id)
        .single();

      const roles = profileData?.user_roles?.map((ur) => ur.roles?.name) || [];
      return { success: true, roles };
    } catch (err) {
      setLoading(false);
      return { success: false };
    }
  };

  return { login, loading };
};
