import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { notifyError } from "@/utils/notifications";
import { useAuth } from "@/contexts/AuthContext";

const ATTEMPT_KEY = "login_attempts";

const getAttempts = () => {
  try {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    if (!raw) return { count: 0, blockedUntil: 0 };
    return JSON.parse(raw);
  } catch { return { count: 0, blockedUntil: 0 }; }
};

const saveAttempts = (attempts) => {
  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts));
};

const getBlockDuration = (count) => {
  if (count <= 3) return 0;
  return Math.min(30 * Math.pow(2, count - 4), 600) * 1000; // 30s, 60s, 120s… max 10min
};

export const useAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const [blockedSeconds, setBlockedSeconds] = useState(0);
  const timerRef = useRef(null);
  const { signIn } = useAuth();

  const login = useCallback(async (email, password) => {
    const attempts = getAttempts();
    const now = Date.now();

    if (now < attempts.blockedUntil) {
      const remaining = Math.ceil((attempts.blockedUntil - now) / 1000);
      notifyError(`Demasiados intentos. Esperá ${remaining}s.`);
      return { success: false, blocked: true };
    }

    setLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        const newCount = attempts.count + 1;
        const duration = getBlockDuration(newCount);
        const state = { count: newCount, blockedUntil: now + duration };
        saveAttempts(state);

        if (duration > 0) {
          setBlockedSeconds(duration / 1000);
          notifyError(`Demasiados intentos. Reintentá en ${Math.ceil(duration / 1000)}s.`);
        } else {
          notifyError(error.message);
        }

        setLoading(false);
        return { success: false };
      }

      saveAttempts({ count: 0, blockedUntil: 0 });
      setBlockedSeconds(0);

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
  }, [signIn]);

  return { login, loading, blockedSeconds };
};
