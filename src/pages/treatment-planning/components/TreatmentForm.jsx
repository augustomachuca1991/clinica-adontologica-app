import React, { useState, useMemo, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useTranslation } from "react-i18next";
/* import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks"; */

const TreatmentForm = ({ services, loading, selectedTooth, onSubmit, onCancel, editingTreatment, isEditingHistory }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(
    editingTreatment || {
      toothNumber: selectedTooth,
      procedure: "",
      cost: "",
      duration: "",
      priority: "medium",
      status: "planned",
      notes: "",
    }
  );

  const priorityOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const statusOptions = [
    { value: "planned", label: t("records.card.status.planned") },
    { value: "inProgress", label: t("records.card.status.inProgress") },
    { value: "completed", label: t("records.card.status.completed") },
  ];

  useEffect(() => {
    if (editingTreatment) {
      // Normalizamos los datos: si viene de la DB trae service_id,
      // pero el formulario usa la propiedad 'procedure'
      setFormData({
        ...editingTreatment,
        procedure: (editingTreatment.procedure || editingTreatment.service_id)?.toString() || "",
        // También nos aseguramos de que el status coincida con el formato de tus statusOptions
        // (Si en la DB es 'in-progress', convertirlo a 'inProgress' si es necesario)
        status: editingTreatment.status === "in-progress" ? "inProgress" : editingTreatment.status,
      });
    } else {
      setFormData({
        toothNumber: selectedTooth,
        procedure: "",
        cost: "",
        duration: "",
        priority: "medium",
        status: "planned",
        notes: "",
      });
    }
  }, [editingTreatment, selectedTooth]);

  const procedureOptions = useMemo(() => {
    return services.map((s) => ({
      value: s.id.toString(), // El valor será el ID del servicio
      label: s.name, // La etiqueta será el nombre del tratamiento
    }));
  }, [services]);

  const handleProcedureChange = (serviceId) => {
    const idStr = serviceId.toString(); // Forzamos string
    const selectedService = services.find((s) => s.id.toString() === idStr);

    setFormData({
      ...formData,
      procedure: idStr,
      cost: selectedService ? selectedService.base_cost : "",
      duration: selectedService ? `${selectedService.estimated_duration_min}` : "",
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit({
      ...formData,
      id: editingTreatment?.id || Date.now(),
      cost: parseFloat(formData?.cost),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label={t("treatment.formLabel.toothNumber")} type="text" value={formData?.toothNumber} disabled required />

        <Select
          label={loading ? t("loading") : t("treatment.formLabel.procedure")}
          options={procedureOptions}
          value={formData?.procedure}
          onChange={handleProcedureChange}
          disabled={loading || isEditingHistory}
          required
        />

        <Input
          label={t("treatment.formLabel.estimatedCost")}
          type="number"
          placeholder={t("treatment.formPlaceholder.estimatedCost")}
          value={formData?.cost}
          disabled={isEditingHistory}
          onChange={(e) => setFormData({ ...formData, cost: e?.target?.value })}
          required
        />
        <Input
          label={t("treatment.formLabel.duration")}
          type="text"
          placeholder={t("treatment.formPlaceholder.duration")}
          value={formData?.duration}
          onChange={(e) => setFormData({ ...formData, duration: e?.target?.value })}
          required
        />

        <Select
          label={t("treatment.formLabel.priority")}
          options={priorityOptions}
          value={formData?.priority}
          onChange={(value) => setFormData({ ...formData, priority: value })}
          required
        />

        <Select
          label={t("treatment.formLabel.status")}
          options={statusOptions}
          value={formData?.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          required
        />
      </div>
      <Input
        label={t("treatment.formLabel.notes")}
        type="text"
        placeholder={t("treatment.formPlaceholder.notes")}
        value={formData?.notes}
        onChange={(e) => setFormData({ ...formData, notes: e?.target?.value })}
      />
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="default" fullWidth>
          {editingTreatment ? t("treatment.updateTreatment") : t("treatment.addTreatment")}
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
};

export default TreatmentForm;
