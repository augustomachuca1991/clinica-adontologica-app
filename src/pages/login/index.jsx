import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import FooterLogin from "@/pages/login/components/FooterLogin";
import { useTranslation } from "react-i18next";
import Spinner from "@/components/ui/Spinner";
import Image from "@/components/AppImage";
import logo from "@/assets/images/logo-orion-software.svg";
import { useAuth } from "@/contexts/AuthContext";
import { notifyError, notifySuccess } from "@/utils/notifications";

const Login = () => {
  const { signIn, loading } = useAuth();
  const { t } = useTranslation();
  const APP_NAME = import.meta.env?.VITE_APP_NAME || "Dental Care";

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await signIn(form.email, form.password);

    if (error) {
      notifyError(error.message);
    } else {
      notifySuccess(t("welcome"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40">
        <Spinner size={56} />
        <p className="mt-4 text-muted-foreground animate-pulse">{t("workspace")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex items-center justify-center rounded-xl bg-primary/10">
            <Image src={logo} alt="App Logo" className="h-14 md:h-18 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-headline font-bold tracking-[-0.015em] text-foreground">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <section>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="email@ejemplo.com"
                className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary tracking-[-0.015em]"
                value={form.email}
                onChange={handleChange}
                required
              />
            </section>

            <section>
              <Input
                label={t("login.password")}
                type="password"
                name="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary tracking-[-0.015em]"
                value={form.password}
                onChange={handleChange}
                required
              />
            </section>

            <div className="flex items-center justify-between">
              <Checkbox
                label={t("login.rememberMe")}
                id="rememberMe"
                name="rememberMe"
                checked={form.rememberMe}
                className="mt-1 focus:ring-2 focus:ring-primary tracking-[-0.015em]"
                onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
              />
            </div>

            <Button variant="default" className="w-full" type="submit" disabled={loading}>
              {t("login.submit")}
            </Button>
          </div>
        </form>
        <FooterLogin />
      </div>
    </div>
  );
};

export default Login;
