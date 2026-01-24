import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

const TreatmentSequence = ({ treatments, services, onReorder, onRemove, onEdit }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const { t } = useTranslation();

  // Separación de datos
  const currentPlan = treatments.filter((t) => !t.isPersisted);
  const history = treatments.filter((t) => t.isPersisted);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e?.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newCurrentPlan = [...currentPlan];
    const draggedTreatment = newCurrentPlan[draggedItem];
    newCurrentPlan.splice(draggedItem, 1);
    newCurrentPlan.splice(index, 0, draggedTreatment);

    // Reconstruimos la lista total para el padre
    onReorder([...newCurrentPlan, ...history]);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getProcedureName = (procedureId) => {
    // Si es un string (dato viejo/mock), mostrarlo.
    // Si es un ID, buscar el nombre en la lista de servicios.
    const service = services?.find((s) => s.id.toString() === procedureId.toString());
    return service ? service.name : procedureId;
  };

  const getStatusIconLabel = (status) => {
    switch (status) {
      case "completed":
        return { icon: "Check", label: t("treatment.status.completed"), classIcon: "text-success" };
      case "inProgress":
        return { icon: "Clock", label: t("treatment.status.inProgress"), classIcon: "text-warning" };
      case "planned":
        return { icon: "Calendar", label: t("treatment.status.planned"), classIcon: "text-primary" };
      default:
        return { icon: "Circle" };
    }
  };

  const statusBorderStyles = {
    completed: "border-l-4 border-l-success bg-success/5",
    inProgress: "border-l-4 border-l-warning bg-warning/5", // Por compatibilidad
    planned: "border-l-4 border-l-primary bg-primary/5",
  };

  const priorityBadgeStyles = {
    urgent: "text-destructive border-destructive",
    high: "text-red-400 border-red-400",
    medium: "text-warning border-warning",
    low: "text-success border-success",
  };

  const TreatmentCard = ({ treatment, isDraggable, index }) => (
    <div className="flex items-start gap-3">
      {isDraggable && (
        <div className="flex-shrink-0 mt-1">
          <Icon name="GripVertical" size={20} className="text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm md:text-base font-medium text-foreground">{getProcedureName(treatment?.procedure)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${priorityBadgeStyles[treatment?.priority] || ""}`}>{treatment?.priority}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-muted-foreground">
              <span>
                {t("tooth")} #{treatment?.toothNumber}
              </span>
              <span>•</span>
              <span>{treatment?.duration ? `${treatment?.duration} min` : "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => onEdit(treatment)} iconName="Edit2" />
            {!treatment.isPersisted && <Button variant="outline" size="icon" onClick={() => onRemove(treatment?.id)} iconName="Trash2" />}
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name={getStatusIconLabel(treatment?.status)?.icon} size={16} className={getStatusIconLabel(treatment?.status)?.classIcon} />
            <span className={`text-xs md:text-sm ${getStatusIconLabel(treatment?.status)?.classIcon}`}>{getStatusIconLabel(treatment?.status)?.label}</span>
          </div>
          <div className="text-sm md:text-base font-semibold text-foreground">${treatment?.cost?.toLocaleString()}</div>
        </div>
        {treatment?.notes && <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 italic">"{treatment?.notes}"</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* SECCIÓN 1: PLAN ACTUAL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="text-sm md:text-base font-headline font-bold text-primary uppercase tracking-tight">{t("treatment.currentPlan")}</h3>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{currentPlan.length}</span>
        </div>

        {currentPlan.length === 0 ? (
          <div className="text-center py-8 md:py-12 bg-muted/50 rounded-lg border-2 border-dashed border-border">
            <Icon name="Calendar" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm md:text-base text-muted-foreground">{t("treatment.noTreatments")}</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">{t("treatment.selectTeethToAddTreatments")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentPlan.map((treatment, index) => (
              <div
                key={treatment.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={() => setDraggedItem(null)}
                className={`bg-card border border-border rounded-lg p-3 md:p-4 transition-all cursor-move ${statusBorderStyles[treatment.status]} ${draggedItem === index ? "opacity-50 scale-95" : ""}`}
              >
                <TreatmentCard treatment={treatment} isDraggable={true} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN 2: HISTORIAL */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm md:text-base font-headline font-bold text-muted-foreground uppercase tracking-tight">{t("treatment.patientHistory")}</h3>
            <Icon name="History" size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-3 opacity-90">
            {history.map((treatment) => (
              <div key={treatment.id} className={`bg-muted/40 border border-border/50 rounded-lg p-3 md:p-4 ${statusBorderStyles[treatment.status]}`}>
                <TreatmentCard treatment={treatment} isDraggable={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentSequence;
