import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        const { data, error } = await supabase?.from("user_profiles")?.select("*")?.eq("id", userId)?.single();
        if (!error) setUserProfile(data);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setProfileLoading(false);
      }
    },

    clear() {
      setUserProfile(null);
      setProfileLoading(false);
    },
  };

  const subscriptionOperations = {
    async load(userId) {
      if (!userId) return;
      setSubscriptionLoading(true);

      try {
        const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();

        if (!error) setSubscription(data);
      } catch (error) {
        console.error("Subscription load error:", error);
      } finally {
        setSubscriptionLoading(false);
      }
    },

    clear() {
      setSubscription(null);
      setSubscriptionLoading(false);
    },
  };

  const hasActiveSubscription = subscription && subscription.status === "active" && new Date(subscription.current_period_end) > new Date();

  const isUserActive = userProfile?.status === "active";
  const isLoggedIn = !!user && isUserActive;

  const canAccessApp = !!user && isUserActive && hasActiveSubscription;

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        profileOperations.load(session.user.id);
        subscriptionOperations.load(session.user.id);
      } else {
        profileOperations.clear();
        subscriptionOperations.clear();
      }
    },
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      authStateHandlers.onChange(null, session);
    });

    // CRITICAL: This must remain synchronous
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(authStateHandlers.onChange);

    return () => subscription?.unsubscribe();
  }, []);

  // Auth methods
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({ email, password });
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (!error) {
        setUser(null);
        profileOperations.clear();
      }
      return { error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };

    try {
      const { data, error } = await supabase?.from("user_profiles")?.update(updates)?.eq("id", user?.id)?.select()?.single();
      if (!error) setUserProfile(data);
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const sendPasswordResetEmail = async (email) => {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase?.auth?.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (error) {
      return { error: { message: "Network error. Please try again." } };
    }
  };

  const value = {
    user,
    userProfile,
    subscription,
    loading: loading || profileLoading || subscriptionLoading,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: canAccessApp,
    hasActiveSubscription,
    isLoggedIn,
    sendPasswordResetEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
