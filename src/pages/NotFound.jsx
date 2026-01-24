import { useTranslation } from "react-i18next";
import Button from "../components/ui/Button"; // Ajusta la ruta
import Icon from "../components/AppIcon";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-6">
      <div className="text-center max-w-lg animate-in fade-in zoom-in duration-300">
        {/* ILUSTRACIÓN / ICONO */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative bg-card border border-border w-24 h-24 rounded-3xl shadow-clinical-md flex items-center justify-center text-primary">
            <Icon name="Search" size={48} strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">404</div>
          </div>
        </div>

        {/* TEXTO */}
        <h1 className="text-4xl font-headline font-bold text-foreground mb-3">{t("error.404_title")}</h1>
        <p className="text-muted-foreground mb-10 max-w-xs mx-auto">{t("error.404_description")}</p>

        {/* ACCIONES */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="px-6">
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            {t("error.go_back")}
          </Button>

          <Button variant="default" onClick={() => navigate("/")} className="px-8 shadow-lg shadow-primary/20">
            <Icon name="Home" size={18} className="mr-2" />
            {t("error.go_home")}
          </Button>
        </div>
      </div>

      {/* DECORACIÓN DISCRETA */}
      <p className="absolute bottom-8 text-xs text-muted-foreground/50 font-medium tracking-widest uppercase">Orion Software Systems</p>
    </div>
  );
};

export default NotFound;
