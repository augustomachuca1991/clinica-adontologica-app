import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { useTranslation } from "react-i18next";

const INSURANCE_OPTIONS = ["Ioscor", "Swiss Medical", "OSDE", "Omint", "Otros"];
const QUICK_TAGS = ["vip", "recommended", "new", "family", "other"];

const INITIAL_FORM_STATE = {
  name: "",
  dateOfBirth: "",
  address: "",
  phone: "",
  email: "",
  insurance: "",
  tags: [],
};

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (tag) => {
    setForm((prev) => {
      if (prev.tags.includes(tag)) return prev;
      return {
        ...prev,
        tags: [...prev.tags, tag],
      };
    });
  };

  const handleSubmit = () => {
    onSave(form);
    setForm(INITIAL_FORM_STATE);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM_STATE);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-clinical-md w-full max-w-2xl p-6 md:p-8 relative">
        {/* Cerrar */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <Icon name="X" size={20} />
        </button>

        {/* Título */}
        <div className="flex items-center gap-2 mb-6">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <h3 className="text-xl font-headline font-semibold">{t("patient.form.title")}</h3>
        </div>

        {/* Leyenda obligatorios */}
        <p className="text-sm text-muted-foreground mb-6">
          {t("patient.form.requiredLegend")} <span className="text-primary">*</span>
        </p>

        {/* ===================== DATOS PERSONALES ===================== */}
        <section className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t("patient.form.sections.personal")}</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className="relative md:col-span-2">
              <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("patient.form.fields.name")}
                className="w-full pl-10 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Fecha nacimiento */}
            <div className="relative">
              <Icon name="Calendar" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary" />
            </div>

            {/* Domicilio */}
            <div className="relative md:col-span-3">
              <Icon name="MapPin" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t("patient.form.fields.address")}
                className="w-full pl-10 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* ===================== CONTACTO ===================== */}
        <section className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t("patient.form.sections.contact")}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="relative">
              <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("patient.form.fields.email")}
                className="w-full pl-10 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
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
                placeholder={t("patient.form.fields.phone")}
                className="w-full pl-10 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* ===================== COBERTURA ===================== */}
        <section className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">{t("patient.form.sections.insurance")}</h4>

          <div className="relative max-w-md">
            <Icon name="Shield" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select name="insurance" value={form.insurance} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg text-sm bg-card focus:ring-2 focus:ring-primary">
              <option value="">{t("patient.form.fields.insurance.placeholder")}</option>
              {INSURANCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ===================== TAGS ===================== */}
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-2">{t("patient.form.sections.tags")}</h4>

          {/* TAGS DISPONIBLES */}
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_TAGS.filter((tag) => !form.tags.includes(tag)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="text-xs px-3 py-1 rounded-full
                   border border-border
                   bg-muted text-foreground
                   hover:bg-primary hover:text-white
                   transition"
              >
                {t(`patient.form.tags.${tag}`)}
              </button>
            ))}
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Icon name="CheckCircle" size={12} />
                {t("patient.form.tags.selectedLegend")}
              </p>

              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 rounded-full
                     text-xs bg-primary text-primary-foreground"
                >
                  {t(`patient.form.tags.${tag}`)}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((t) => t !== tag),
                      }))
                    }
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Acciones */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
