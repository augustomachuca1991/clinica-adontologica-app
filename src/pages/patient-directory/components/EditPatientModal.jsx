import React, { useState, useRef } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input"; // Tus componentes existentes
import Select from "../../../components/ui/Select"; // Tus componentes existentes
import { useTranslation } from "react-i18next";

const GENDER_OPTIONS = [
  { value: "Female", label: "Femenino" },
  { value: "Male", label: "Masculino" },
  { value: "Other", label: "Otro" },
];

const BLOOD_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  // Estado inicial con toda la estructura del objeto
  const [form, setForm] = useState({
    ...patient,
    emergencyContact: patient?.emergencyContact || { name: "", relationship: "", phone: "", email: "" },
    allergies: patient?.allergies || [],
  });
  const [previewImage, setPreviewImage] = useState(patient?.profileImage);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        handleInputChange("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6">
      {/* Contenedor Principal: Se define un max-height para habilitar el scroll interno */}
      <div className="bg-card rounded-3xl shadow-clinical-xl w-full max-w-3xl flex flex-col max-h-[90vh] border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="flex flex-col h-full overflow-hidden"
        >
          {/* HEADER (Fijo) */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
            <h3 className="text-xl font-headline font-semibold text-foreground flex items-center gap-2">
              <Icon name="User" className="text-primary" size={20} />
              Perfil de {form.name || "Paciente"}
            </h3>
            <button type="button" onClick={onClose} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* CUERPO CON SCROLL (Clave para que no se corte) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {/* CABECERA: FOTO Y ESTADO */}
            <div className="flex flex-col md:flex-row gap-8 items-center border-b border-border pb-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-card shadow-clinical-md ring-1 ring-border bg-muted">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Icon name="User" size={40} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                >
                  <Icon name="Camera" size={14} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              <div className="space-y-4 flex-1">
                <label className="text-sm font-semibold text-foreground block">Estado del Paciente</label>
                <div className="flex flex-wrap gap-6">
                  {[
                    { id: "active", label: "Activo", color: "bg-emerald-500" },
                    { id: "pending", label: "Pendiente", color: "bg-amber-500" },
                    { id: "inactive", label: "Inactivo", color: "bg-slate-400" },
                  ].map((opt) => (
                    <label key={opt.id} className="inline-flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="radio" name="status" className="sr-only" checked={form.status === opt.id} onChange={() => handleInputChange("status", opt.id)} />
                        <div
                          className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${form.status === opt.id ? `${opt.color} border-transparent shadow-sm shadow-${opt.id}` : "border-border bg-background group-hover:border-primary/50"}`}
                        >
                          {form.status === opt.id && <Icon name="Check" size={12} className="text-white" />}
                        </div>
                      </div>
                      <span className={`ml-2 text-sm font-medium ${form.status === opt.id ? "text-foreground" : "text-muted-foreground"}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: DATOS PERSONALES */}
            <section className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                <Icon name="Info" size={14} /> INFORMACIÓN PERSONAL
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <Input label="Nombre Completo" value={form.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                </div>
                <Input label="Fecha Nacimiento" type="date" value={form.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} />
                <Select
                  label="Género"
                  options={[
                    { value: "Female", label: "Femenino" },
                    { value: "Male", label: "Masculino" },
                  ]}
                  value={form.gender}
                  onChange={(val) => handleInputChange("gender", val)}
                />
                <Select
                  label="Grupo Sanguíneo"
                  options={[
                    { value: "A+", label: "A+" },
                    { value: "O+", label: "O+" },
                  ]}
                  value={form.bloodType}
                  onChange={(val) => handleInputChange("bloodType", val)}
                />
                <Input label="Estado Civil" value={form.maritalStatus} onChange={(e) => handleInputChange("maritalStatus", e.target.value)} />
              </div>
            </section>

            {/* SECCIÓN 2: CONTACTO Y DIRECCIÓN */}
            <section className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                <Icon name="MapPin" size={14} /> CONTACTO Y UBICACIÓN
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Email" type="email" value={form.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                <Input label="Teléfono" value={form.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                <div className="md:col-span-2">
                  <Input label="Dirección" value={form.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                </div>
                <Input label="Ciudad" value={form.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                <div className="grid grid-cols-2 gap-5">
                  <Input label="Estado/Prov." value={form.state} onChange={(e) => handleInputChange("state", e.target.value)} />
                  <Input label="Cód. Postal" value={form.zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} />
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: EMERGENCIA Y SEGURO */}
            <section className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 flex items-center gap-2">
                <Icon name="ShieldAlert" size={14} /> EMERGENCIA Y SEGURO
              </h4>
              <div className="p-6 bg-muted/20 rounded-2xl border border-border space-y-5">
                <p className="text-sm font-semibold text-foreground">Contacto de Emergencia</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input label="Nombre Contacto" value={form.emergencyContact.name} onChange={(e) => handleEmergencyChange("name", e.target.value)} />
                  <Input label="Relación" value={form.emergencyContact.relationship} onChange={(e) => handleEmergencyChange("relationship", e.target.value)} />
                  <Input label="Teléfono" value={form.emergencyContact.phone} onChange={(e) => handleEmergencyChange("phone", e.target.value)} />
                  <Input label="Email" value={form.emergencyContact.email} onChange={(e) => handleEmergencyChange("email", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Cobertura Médica" value={form.insurance} onChange={(e) => handleInputChange("insurance", e.target.value)} />
                <Input label="Alergias" placeholder="Separadas por comas" value={form.allergies.join(", ")} onChange={(e) => handleInputChange("allergies", e.target.value.split(", "))} />
              </div>
            </section>
          </div>

          {/* FOOTER (Fijo) */}
          <div className="p-6 border-t border-border bg-background/50 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose} className="px-6">
              Cancelar
            </Button>
            <Button variant="default" type="submit" className="px-8 shadow-lg shadow-primary/20">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
