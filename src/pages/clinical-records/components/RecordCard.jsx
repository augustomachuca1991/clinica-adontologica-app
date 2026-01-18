import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

const RecordCard = ({ record, onViewDetails, onAddNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  const { t } = useTranslation();
  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-warning/10 text-warning border-warning/20",
      planned: "bg-primary/10 text-primary border-primary/20",
      cancelled: "bg-muted text-muted-foreground border-border",
    };
    return colors?.[status] || colors?.planned;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % record.attachments.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + record.attachments.length) % record.attachments.length);
  };

  const getTreatmentIcon = (type) => {
    const icons = {
      preventive: "Shield",
      restorative: "Wrench",
      endodontic: "Activity",
      periodontic: "Heart",
      orthodontic: "Smile",
      prosthodontic: "Crown",
      "oral-surgery": "Scissors",
    };
    return icons?.[type] || "FileText";
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical-sm hover:shadow-clinical-md transition-all duration-base overflow-hidden h-fit">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={getTreatmentIcon(record?.treatmentType)} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-headline font-semibold text-foreground mb-1 truncate">{record?.treatmentName}</h4>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                {t("records.card.patient")}: {record?.patientName} • {t("records.card.idPatient")}: {record?.patientId}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record?.status)}`}>
                  <Icon name="Circle" size={8} className="fill-current" />
                  {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)?.replace("-", " ")}
                </span>
                <span className="text-xs text-muted-foreground">{record?.date}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} iconName={isExpanded ? "ChevronUp" : "ChevronDown"} aria-label={isExpanded ? "Collapse" : "Expand"} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="User" size={16} />
            <span>
              {t("records.card.provider")}: {record?.provider}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span>
              {t("records.card.tooth")}: {record?.toothNumber}
            </span>
          </div>
          {record?.cost && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Icon name="DollarSign" size={16} />
              <span>
                {t("records.card.cost")}: ${record?.cost?.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4 fade-in-up">
            <div>
              <h5 className="text-xs md:text-sm font-medium text-foreground mb-2">{t("records.card.treatmentNotes")}</h5>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{record?.notes}</p>
            </div>

            {record?.attachments && record?.attachments?.length > 0 && (
              <div>
                <h5 className="text-xs md:text-sm font-medium text-foreground mb-3">{t("records.card.clinicalImages")}</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {record?.attachments?.map((attachment, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg border border-border">
                      <div className="aspect-[4/3]">
                        <Image src={attachment?.url} alt={attachment?.alt} className="w-full h-full object-cover transition-transform duration-base group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-base flex items-center justify-center">
                        <Button variant="secondary" size="sm" iconName="Eye" iconPosition="left" onClick={() => setSelectedImageIndex(index)}>
                          {t("records.card.button.view")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record?.followUp && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Icon name="Calendar" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-warning mb-1">{t("records.card.followUp")}</p>
                    <p className="text-xs text-muted-foreground">{record?.followUp}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(record)} iconName="Eye" iconPosition="left">
            {t("records.card.button.viewDetails")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAddNote(record)} iconName="Plus" iconPosition="left">
            {t("records.card.button.addNote")}
          </Button>
        </div>
      </div>
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 transition-all animate-in fade-in">
          {/* Botón Cerrar */}
          <button onClick={() => setSelectedImageIndex(null)} className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110]">
            <Icon name="X" size={32} />
          </button>

          {/* Botón Anterior */}
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full">
            <Icon name="ChevronLeft" size={40} />
          </button>

          {/* Imagen Principal */}
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <img src={record.attachments[selectedImageIndex].url} alt={record.attachments[selectedImageIndex].alt} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />

            {/* Información de la imagen (Pie de foto) */}
            <div className="mt-6 text-center text-white">
              <p className="text-lg font-medium">{record.attachments[selectedImageIndex].alt || `Imagen ${selectedImageIndex + 1}`}</p>
              <p className="text-sm text-white/60 mt-1">
                {selectedImageIndex + 1} / {record.attachments.length}
              </p>
            </div>
          </div>

          {/* Botón Siguiente */}
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-3 rounded-full">
            <Icon name="ChevronRight" size={40} />
          </button>

          {/* Miniaturas (Opcional, para navegación rápida) */}
          <div className="absolute bottom-8 flex gap-2">
            {record.attachments.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === selectedImageIndex ? "w-8 bg-primary" : "w-2 bg-white/30"}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordCard;
