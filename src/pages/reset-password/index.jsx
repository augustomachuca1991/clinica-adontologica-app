import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import LanguageSwitch from "../../components/ui/LanguageSwitch";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuth } from "../../contexts/AuthContext";
/* import Image from "../../components/AppImage";
import logo from "../../../public/assets/images/logo-orion-software.svg"; */

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await updatePassword(passwords.newPassword);

    setIsLoading(false);
    if (error) notifyError(t("resetPassword.error"));
    else notifySuccess(t("resetPassword.success"));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-muted/40 px-4">
      {/* <div className="absolute top-6 left-6 inline-flex items-center gap-2">
        <Image src={logo} alt="App Logo" className="h-10 md:h-14 w-auto object-contain" />
        <h1 className="text-2xl font-headline font-bold text-foreground tracking-[-0.015em]">Orion Software</h1>
      </div> */}

      <div className="w-full max-w-md bg-card rounded-2xl shadow-clinical-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon name="ShieldCheck" size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-foreground tracking-[-0.015em]">{t("resetPassword.title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("resetPassword.subtitle")}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Nueva Contraseña */}
          <div>
            <label className="text-sm font-medium text-foreground">{t("resetPassword.newPasswordLabel")}</label>
            <input
              type="password"
              name="newPassword"
              required
              placeholder={t("resetPassword.placeholder")}
              className="mt-1 w-full p-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              value={passwords.newPassword}
              onChange={handleChange}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="text-sm font-medium text-foreground">{t("resetPassword.confirmPasswordLabel")}</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder={t("resetPassword.placeholder")}
              className="mt-1 w-full p-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              value={passwords.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" variant="default" className="w-full py-6" disabled={isLoading}>
            {isLoading ? "..." : t("resetPassword.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
