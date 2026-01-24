import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FooterLogin = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Obtiene el nombre de la clínica desde el .env o usa uno por defecto
  const appName = import.meta.env.VITE_APP_NAME || "App Name";

  return (
    <div className="mt-8 space-y-4 text-center">
      {/* Enlace de Olvido de contraseña */}
      <div className="mb-2">
        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          {t("login.footerLogin.forgotPassword")}
        </Link>
      </div>
      <div className="h-px w-full bg-border/50" /> {/* Divisor sutil */}
      <div className="text-[11px] text-muted-foreground space-y-2">
        {/* Derechos y Desarrollador */}
        <p>{t("login.footerLogin.rights", { currentYear, appName })}</p>

        {/* Términos y Condiciones */}
        <p>
          <Link to="/terms" className="hover:text-foreground transition-colors underline underline-offset-2">
            {t("login.footerLogin.privacy")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FooterLogin;
