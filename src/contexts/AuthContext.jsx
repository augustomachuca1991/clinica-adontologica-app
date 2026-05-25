import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});
const TIMEOUT_MS = 30 * 60 * 1000;

// ─── Hook de inactividad ────────────────────────────────────────────────────
const useSessionTimeout = (isLoggedIn, onTimeout) => {
  const timerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!isLoggedIn) {
      clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onTimeoutRef.current(), TIMEOUT_MS);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= TIMEOUT_MS) onTimeoutRef.current();
      }
    };

    const EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    EVENTS.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    document.addEventListener("visibilitychange", handleVisibility);
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isLoggedIn]);
};

// ─── Hook público ────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // ── Perfil ──────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async (userId) => {
    if (!userId) return;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(`*, user_roles ( roles ( name ) )`)
        .eq("id", userId)
        .single();
      if (!error) setUserProfile(data);
      else console.error("❌ Error cargando perfil:", error);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setUserProfile(null);
    setProfileLoading(false);
  }, []);

  // ── Suscripción ─────────────────────────────────────────────────────────
  const loadSubscription = useCallback(async (userId) => {
    if (!userId) return;
    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
      if (!error) setSubscription(data);
    } catch (err) {
      console.error("Subscription load error:", err);
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  const clearSubscription = useCallback(() => {
    setSubscription(null);
    setSubscriptionLoading(false);
  }, []);

  // ── Auth state change — UNA sola definición, UNA sola subscripción ──────
  const handleAuthChange = useCallback(
    (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        loadProfile(session.user.id);
        loadSubscription(session.user.id);
      } else {
        clearProfile();
        clearSubscription();
      }
    },
    [loadProfile, loadSubscription, clearProfile, clearSubscription]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(null, session);
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => authListener?.unsubscribe();
  }, [handleAuthChange]);

  // ── Derivados ────────────────────────────────────────────────────────────
  const roles = userProfile?.user_roles?.map((ur) => ur.roles?.name) || [];
  const isAdmin = roles.includes("admin");
  const isUserActive = userProfile?.status === "active";
  const isLoggedIn = !!user && isUserActive;

  const hasActiveSubscription = (() => {
    if (!subscription) return false;
    const hoy = new Date();
    const finPeriodo = new Date(subscription.current_period_end);
    if (hoy <= finPeriodo) return true;
    const diasVencido = Math.floor((hoy - finPeriodo) / (1000 * 60 * 60 * 24));
    return diasVencido <= 5;
  })();

  const daysWithGrace = (() => {
    if (!subscription) return 0;
    const hoy = new Date();
    const finPeriodo = new Date(subscription.current_period_end);
    if (hoy <= finPeriodo) return 5;
    const diasVencido = Math.floor((hoy - finPeriodo) / (1000 * 60 * 60 * 24));
    return Math.max(0, 5 - diasVencido);
  })();

  const canAccessApp = isLoggedIn && (isAdmin || hasActiveSubscription);

  const isResolvingAuth = loading || (!!user && (profileLoading || subscriptionLoading));

  // ── Acciones ─────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        clearProfile();
        clearSubscription();
      }
      return { error };
    } catch {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };
    try {
      const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", user.id).select().single();
      if (!error) setUserProfile(data);
      return { data, error };
    } catch {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      return { data, error };
    } catch {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  // ── Timeout de inactividad ───────────────────────────────────────────────
  const handleSessionTimeout = useCallback(async () => {
    await signOut();
    window.location.href = "/login";
  }, []);

  useSessionTimeout(isLoggedIn, handleSessionTimeout);

  // ── Contexto ─────────────────────────────────────────────────────────────
  const value = {
    user,
    userProfile,
    subscription,
    loading: isResolvingAuth, // ← compuesto: sesión + perfil
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isAuthenticated: canAccessApp,
    hasActiveSubscription,
    isLoggedIn,
    daysWithGrace,
    sendPasswordResetEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
