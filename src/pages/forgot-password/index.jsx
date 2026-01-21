import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import LanguageSwitch from "../../components/ui/LanguageSwitch";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendPasswordResetEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await sendPasswordResetEmail(email);

    setIsLoading(false);
    if (error) notifyError(t("forgotPassword.error"));
    else notifySuccess(t("forgotPassword.success"));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/40 px-4 font-sans">
      {/* Selector de idiomas */}
      <div className="absolute top-6 left-6">
        <LanguageSwitch />
      </div>

      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header con temática clínica */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="Key" size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-foreground">{t("forgotPassword.title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("forgotPassword.subtitle")}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">{t("forgotPassword.emailLabel")}</label>
            <div className="relative mt-1">
              <Icon name="Mail" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder={t("forgotPassword.emailPlaceholder")}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="default" className="w-full py-6" disabled={isLoading}>
            {isLoading ? "..." : t("forgotPassword.submit")}
          </Button>
        </form>

        {/* Footer del card */}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            <Icon name="ArrowLeft" size={16} />
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
