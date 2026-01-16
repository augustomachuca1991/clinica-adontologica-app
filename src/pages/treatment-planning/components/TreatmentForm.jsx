import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const TreatmentForm = ({ selectedTooth, onSubmit, onCancel, editingTreatment }) => {
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

  const procedureOptions = [
    { value: "cleaning", label: "Professional Cleaning" },
    { value: "filling", label: "Composite Filling" },
    { value: "crown", label: "Dental Crown" },
    { value: "root-canal", label: "Root Canal Treatment" },
    { value: "extraction", label: "Tooth Extraction" },
    { value: "implant", label: "Dental Implant" },
    { value: "bridge", label: "Dental Bridge" },
    { value: "veneer", label: "Porcelain Veneer" },
  ];

  const priorityOptions = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

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
        <Input label="Tooth Number" type="text" value={formData?.toothNumber} disabled required />

        <Select label="Procedure" options={procedureOptions} value={formData?.procedure} onChange={(value) => setFormData({ ...formData, procedure: value })} required />

        <Input label="Estimated Cost" type="number" placeholder="0.00" value={formData?.cost} onChange={(e) => setFormData({ ...formData, cost: e?.target?.value })} required />

        <Input label="Duration" type="text" placeholder="e.g., 2 weeks, 1 month" value={formData?.duration} onChange={(e) => setFormData({ ...formData, duration: e?.target?.value })} required />

        <Select label="Priority" options={priorityOptions} value={formData?.priority} onChange={(value) => setFormData({ ...formData, priority: value })} required />

        <Select label="Status" options={statusOptions} value={formData?.status} onChange={(value) => setFormData({ ...formData, status: value })} required />
      </div>
      <Input
        label="Treatment Notes"
        type="text"
        placeholder="Additional notes or special considerations"
        value={formData?.notes}
        onChange={(e) => setFormData({ ...formData, notes: e?.target?.value })}
      />
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="default" fullWidth>
          {editingTreatment ? "Update Treatment" : "Add Treatment"}
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TreatmentForm;
