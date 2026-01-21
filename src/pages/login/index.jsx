import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import FooterLogin from "./components/FooterLogin";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, isLoggedIn, hasActiveSubscription } = useAuth();
  const { t } = useTranslation();
  const APP_NAME = import.meta.env.VITE_APP_NAME || "Dental Care";

  useEffect(() => {
    if (isLoggedIn) {
      if (hasActiveSubscription) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/subscription-expired", { replace: true });
      }
    }
  }, [isLoggedIn, hasActiveSubscription]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      notifyError(t("login.errors.missingFields"));
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      notifyError(error.message);
      return;
    }

    notifySuccess(t("login.welcome"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="Stethoscope" size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-foreground">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              name="email"
              placeholder={"email@ejemplo.com"}
              className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">{t("login.password")}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <Button variant="default" className="w-full" onClick={handleLogin}>
            {t("login.submit")}
          </Button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{t("login.continueWith")}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social login */}
        {/* <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" iconName="Mail">
            Google
          </Button>
          <Button variant="outline" className="w-full" iconName="Facebook">
            Facebook
          </Button>
        </div> */}

        {/* Footer */}
        <FooterLogin />
      </div>
    </div>
  );
};

export default Login;
