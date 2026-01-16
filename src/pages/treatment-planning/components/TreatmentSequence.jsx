import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const TreatmentSequence = ({ treatments, onReorder, onRemove, onEdit }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e?.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newTreatments = [...treatments];
    const draggedTreatment = newTreatments?.[draggedItem];
    newTreatments?.splice(draggedItem, 1);
    newTreatments?.splice(index, 0, draggedTreatment);

    onReorder(newTreatments);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-error/10 text-error border-error/20";
      case "high":
        return "bg-warning/10 text-warning border-warning/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle2";
      case "in-progress":
        return "Clock";
      case "planned":
        return "Calendar";
      default:
        return "Circle";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-headline font-semibold text-foreground">Treatment Sequence</h3>
        <span className="text-xs md:text-sm text-muted-foreground">Drag to reorder</span>
      </div>
      <div className="space-y-3">
        {treatments?.length === 0 ? (
          <div className="text-center py-8 md:py-12 bg-muted/50 rounded-lg border-2 border-dashed border-border">
            <Icon name="Calendar" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm md:text-base text-muted-foreground">No treatments added yet</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">Select teeth from the chart to add treatments</p>
          </div>
        ) : (
          treatments?.map((treatment, index) => (
            <div
              key={treatment?.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-card border border-border rounded-lg p-3 md:p-4 transition-all duration-base cursor-move hover:shadow-clinical-md ${draggedItem === index ? "opacity-50 scale-95" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm md:text-base font-medium text-foreground">{treatment?.procedure}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(treatment?.priority)}`}>{treatment?.priority}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-muted-foreground">
                        <span>Tooth #{treatment?.toothNumber}</span>
                        <span>•</span>
                        <span>{treatment?.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(treatment)} iconName="Edit2" aria-label="Edit treatment" />
                      <Button variant="ghost" size="icon" onClick={() => onRemove(treatment?.id)} iconName="Trash2" aria-label="Remove treatment" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Icon name={getStatusIcon(treatment?.status)} size={16} className="text-muted-foreground" />
                      <span className="text-xs md:text-sm text-muted-foreground capitalize">{treatment?.status?.replace("-", " ")}</span>
                    </div>
                    <div className="text-sm md:text-base font-semibold text-foreground">${treatment?.cost?.toLocaleString()}</div>
                  </div>

                  {treatment?.notes && <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{treatment?.notes}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {treatments?.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 md:p-4 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base font-medium text-foreground">Total Estimated Cost</span>
            <span className="text-lg md:text-xl font-headline font-bold text-primary">${treatments?.reduce((sum, t) => sum + t?.cost, 0)?.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentSequence;
