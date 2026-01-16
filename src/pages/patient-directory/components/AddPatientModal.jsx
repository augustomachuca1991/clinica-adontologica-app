import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const INSURANCE_OPTIONS = ["Ioscor", "Swiss Medical", "OSDE", "Omint", "Otros"];
const QUICK_TAGS = ["VIP", "Recomendado", "Nuevo", "Familiar", "Otros"];

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    insurance: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag) => {
    const currentTags = form.tags ? form.tags.split(",").map((t) => t.trim()) : [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setForm((prev) => ({ ...prev, tags: newTags.join(", ") }));
    }
  };

  const handleSubmit = () => {
    onSave(form);
    setForm({
      name: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      insurance: "",
      tags: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-clinical-md w-full max-w-lg p-6 md:p-8 relative">
        {/* Botón cerrar */}
        <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" onClick={onClose}>
          <Icon name="X" size={20} />
        </button>

        {/* Título con icono */}
        <div className="flex items-center gap-2 mb-4">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Alta de Paciente</h3>
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="relative">
            <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="relative">
            <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              placeholder="Fecha de nacimiento"
              className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Icon name="Phone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Obra social (select) */}
          <div className="relative">
            <Icon name="Shield" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              name="insurance"
              value={form.insurance}
              onChange={handleChange}
              className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            >
              <option value="">Seleccionar obra social</option>
              {INSURANCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <div className="relative">
              <Icon name="Tag" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Etiquetas (separadas por coma)"
                className="w-full pl-10 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="text-xs px-2 py-1 rounded-lg border border-border bg-muted text-foreground hover:bg-primary hover:text-white transition-colors"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
