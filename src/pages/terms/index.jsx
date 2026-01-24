import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Definimos las llaves de las secciones para mapearlas dinámicamente
  const sectionKeys = ["acceptance", "privacy", "responsibility", "data_ownership", "subscription", "backups", "termination"];

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* BOTÓN VOLVER */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
          <Icon name="ArrowLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t("terms.back_to_login")}</span>
        </button>

        <div className="bg-card rounded-3xl shadow-clinical-xl border border-border overflow-hidden">
          {/* HEADER */}
          <div className="p-8 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
                <Icon name="ShieldCheck" size={24} />
              </div>
              <h1 className="text-2xl font-headline font-bold text-foreground">{t("terms.title")}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{t("terms.last_update")}</p>
          </div>

          {/* CUERPO DINÁMICO */}
          <div className="p-8 space-y-8">
            {sectionKeys.map((key) => (
              <section key={key} className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">{t(`terms.sections.${key}.title`)}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{t(`terms.sections.${key}.content`)}</p>
              </section>
            ))}

            <div className="p-4 bg-muted/50 rounded-2xl border border-dashed border-border mt-8">
              <p className="text-xs text-muted-foreground text-center">{t("terms.legal_footer")}</p>
            </div>
          </div>

          {/* ACCIÓN FINAL */}
          <div className="p-6 bg-background border-t border-border flex justify-end">
            <Button variant="default" onClick={() => navigate(-1)} className="px-10 shadow-md">
              {t("terms.accept_button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
