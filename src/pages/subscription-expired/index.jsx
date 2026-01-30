import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitch from "@/components/ui/LanguageSwitch";

const SubscriptionExpired = () => {
  const { signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fullname = userProfile?.full_name || "no especified";

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    /* Añadimos 'relative' al padre para que el absolute se posicione respecto a la pantalla */
    <div className="relative min-h-screen flex items-center justify-center bg-muted/40 px-4">
      {/* Selector de idiomas en la esquina superior derecha */}
      <div className="absolute top-6 right-6">
        <LanguageSwitch />
      </div>

      <div className="max-w-md w-full bg-background shadow-lg rounded-xl p-8 text-center space-y-6">
        <h1 className="text-2xl font-semibold text-destructive">{t("subscriptionExpired.title")}</h1>

        <p className="text-muted-foreground">{t("subscriptionExpired.message", { fullname })}</p>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">{t("subscriptionExpired.instructions")}</div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground py-2 hover:opacity-90 transition"
        >
          <LogOut size={18} />
          {t("subscriptionExpired.logout")}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionExpired;
