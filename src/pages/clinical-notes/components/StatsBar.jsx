import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import { computeStats } from "@/utils/notesUtils/notes";

// Factorizamos la estructura de items pasando 't' y resolviendo la traducción del valor dinámico
const getStatItems = (stats, t) => {
  // Resolvemos la traducción del tipo más frecuente si existe, sino usamos un fallback
  const translatedTopType = stats.topType
    ? t(`clinicalNotes.form.types.${stats.topType}`, { defaultValue: stats.topType })
    : t("clinicalNotes.stats.noType");

  return [
    { id: "total", label: t("clinicalNotes.stats.total"), value: stats.total, icon: "FileText" },
    { id: "private", label: t("clinicalNotes.stats.private"), value: stats.privadas, icon: "Lock" },
    { id: "public", label: t("clinicalNotes.stats.public"), value: stats.publicas, icon: "Unlock" },
    { id: "frequent", label: t("clinicalNotes.stats.frequentType"), value: translatedTopType, icon: "Stethoscope" },
  ];
};

const StatsBar = ({ notes }) => {
  const { t } = useTranslation();

  // Memoiza el cómputo matemático de las notas
  const stats = useMemo(() => computeStats(notes), [notes]);

  // Memoiza el renderizado de los paneles atado al idioma 't' y a los cambios de 'stats'
  const items = useMemo(() => getStatItems(stats, t), [stats, t]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {items.map((item) => (
        <div key={item.id} className="bg-card border border-border rounded-lg p-4 shadow-clinical-sm">
          <div className="flex items-center gap-2 mb-1">
            <Icon name={item.icon} size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
          <p className="text-2xl font-headline font-bold text-foreground truncate">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
