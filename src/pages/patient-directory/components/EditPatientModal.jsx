import React, { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "@/components/AppImage";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

// ─── Constantes Estáticas (Mapeos para i18n) ──────────────────────────────────
const getStatusOptions = (t) => [
  {
    id: "active",
    label: t("patient.status.active"),
    color: "bg-emerald-500",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
    light: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "pending",
    label: t("patient.status.pending"),
    color: "bg-amber-500",
    ring: "ring-amber-200",
    text: "text-amber-700",
    light: "bg-amber-50 border-amber-200",
  },
  {
    id: "inactive",
    label: t("patient.status.inactive"),
    color: "bg-slate-400",
    ring: "ring-slate-200",
    text: "text-slate-600",
    light: "bg-slate-50 border-slate-200",
  },
];

const getGenderOptions = (t) => [
  { value: "female", label: t("patient.gender.female") },
  { value: "male", label: t("patient.gender.male") },
  { value: "other", label: t("patient.gender.other") },
];

const BLOOD_OPTIONS = [
  { value: "a+", label: "A+" },
  { value: "a-", label: "A-" },
  { value: "b+", label: "B+" },
  { value: "b-", label: "B-" },
  { value: "ab+", label: "AB+" },
  { value: "ab-", label: "AB-" },
  { value: "o+", label: "O+" },
  { value: "o-", label: "O-" },
];

const getMaritalStatusOptions = (t) => [
  { value: "single", label: t("patient.marital.single") },
  { value: "married", label: t("patient.marital.married") },
  { value: "divorced", label: t("patient.marital.divorced") },
  { value: "widowed", label: t("patient.marital.widowed") },
  { value: "separated", label: t("patient.marital.separated") },
  { value: "notSpecified", label: t("patient.marital.notSpecified") },
];

const getInsuranceOptions = (t) => [
  { value: "osde", label: "OSDE" },
  { value: "swiss_medical", label: "Swiss Medical" },
  { value: "galeno", label: "Galeno" },
  { value: "ioscor", label: "IOSCOR" },
  { value: "ioma", label: "IOMA" },
  { value: "ospe", label: "OSPE" },
  { value: "self_pay", label: t("patient.insurance.selfPay") },
  { value: "other", label: t("patient.insurance.other") },
];

const getSteps = (t) => [
  { id: 0, label: t("patient.steps.personal"), icon: "User" },
  { id: 1, label: t("patient.steps.contact"), icon: "Phone" },
  { id: 2, label: t("patient.steps.medical"), icon: "Stethoscope" },
  { id: 3, label: t("patient.steps.emergency"), icon: "ShieldAlert" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const EditPatientModal = ({ patient, onClose, onSave }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0);

  // Inicialización de selectores con i18n activo
  const statusOptions = getStatusOptions(t);
  const genderOptions = getGenderOptions(t);
  const maritalStatusOptions = getMaritalStatusOptions(t);
  const insuranceOptions = getInsuranceOptions(t);
  const stepsConfig = getSteps(t);

  const [form, setForm] = useState({
    ...patient,
    emergencyContact: patient?.emergencyContact || { name: "", relationship: "", phone: "", email: "" },
    allergies: patient?.allergies || [],
  });
  const [previewImage, setPreviewImage] = useState(patient?.avatar);
  const [imageFile, setImageFile] = useState(null);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setEmergency = (field, value) =>
    setForm((p) => ({ ...p, emergencyContact: { ...p.emergencyContact, [field]: value } }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(t("patient.errors.imageSize"));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const goNext = () => setStep((s) => Math.min(s + 1, stepsConfig.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  const isLast = step === stepsConfig.length - 1;

  const currentStatus = statusOptions.find((o) => o.id === form.status) || statusOptions[2];

  // ─── Renderizado Dinámico de Pasos ──────────────────────────────────────────
  const stepContent = [
    // STEP 0 — Personal
    <div key="personal" className="space-y-6">
      <div className="flex items-center gap-5 p-4 bg-muted/20 border border-border rounded-xl">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border bg-muted">
            {previewImage ? (
              <Image src={previewImage} alt={t("patient.avatarAlt")} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="User" size={32} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary text-primary-foreground rounded-lg shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Icon name="Camera" size={13} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        <div className="flex-1 space-y-1">
          <p className="font-semibold text-foreground text-sm">{form.name || "—"}</p>
          <p className="text-xs text-muted-foreground">{form.email || "—"}</p>
          <div className="flex gap-2 pt-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => set("status", opt.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                  form.status === opt.id
                    ? `${opt.light} ${opt.text} border-current`
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", opt.color)} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label={t("patient.fields.fullName")}>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={t("patient.placeholders.fullName")}
            />
          </Field>
        </div>
        <Field label={t("patient.fields.birthDate")}>
          <Input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </Field>
        <Field label={t("patient.fields.gender")}>
          <Select
            options={genderOptions}
            value={form.gender}
            onChange={(v) => set("gender", v)}
            placeholder={t("common.select")}
          />
        </Field>
        <Field label={t("patient.fields.bloodType")}>
          <Select
            options={BLOOD_OPTIONS}
            value={form.bloodType}
            onChange={(v) => set("bloodType", v)}
            placeholder={t("common.select")}
          />
        </Field>
        <Field label={t("patient.fields.maritalStatus")}>
          <Select
            options={maritalStatusOptions}
            value={form.maritalStatus}
            onChange={(v) => set("maritalStatus", v)}
            placeholder={t("common.select")}
          />
        </Field>
      </div>
    </div>,

    // STEP 1 — Contacto
    <div key="contacto" className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("patient.fields.email")}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="ejemplo@email.com"
          />
        </Field>
        <Field label={t("patient.fields.phone")}>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+54 11 0000-0000" />
        </Field>
        <div className="md:col-span-2">
          <Field label={t("patient.fields.address")}>
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Av. Corrientes 1234"
            />
          </Field>
        </div>
        <Field label={t("patient.fields.city")}>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Buenos Aires" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("patient.fields.state")}>
            <Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="CABA" />
          </Field>
          <Field label={t("patient.fields.zipCode")}>
            <Input value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} placeholder="1043" />
          </Field>
        </div>
      </div>
    </div>,

    // STEP 2 — Médico
    <div key="medico" className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("patient.fields.insurance")}>
          <Select
            options={insuranceOptions}
            value={form.insurance}
            onChange={(v) => set("insurance", v)}
            placeholder={t("patient.placeholders.insurance")}
          />
        </Field>
        <Field label={t("patient.fields.allergies")}>
          <Input
            placeholder={t("patient.placeholders.allergies")}
            value={Array.isArray(form.allergies) ? form.allergies.join(", ") : form.allergies}
            onChange={(e) => set("allergies", e.target.value.split(", "))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: t("patient.summary.bloodType"),
            value: form.bloodType?.toUpperCase(),
            icon: "Droplets",
            color: "text-red-600 bg-red-50",
          },
          {
            label: t("patient.fields.gender"),
            value: genderOptions.find((o) => o.value === form.gender)?.label,
            icon: "User",
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: t("patient.fields.status"),
            value: currentStatus.label,
            icon: "Activity",
            color: `${currentStatus.text} ${currentStatus.light}`,
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={cn(
              "border rounded-xl p-3 flex items-center gap-2.5",
              color.includes("bg-") ? `border-current/20 ${color}` : "border-border bg-muted/20"
            )}
          >
            <Icon name={icon} size={16} className={color.split(" ")[0]} />
            <div className="min-w-0">
              <p className="text-[10px] font-medium opacity-70 uppercase tracking-wide">{label}</p>
              <p className="text-xs font-semibold truncate">{value || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // STEP 3 — Emergencia
    <div key="emergencia" className="space-y-5">
      <div className="p-5 bg-red-50/50 border border-red-100 rounded-xl space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="ShieldAlert" size={15} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{t("patient.emergency.title")}</p>
            <p className="text-xs text-muted-foreground">{t("patient.emergency.subtitle")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label={t("patient.fields.fullName")}>
            <Input
              placeholder={t("patient.fields.fullName")}
              value={form.emergencyContact.name}
              onChange={(e) => setEmergency("name", e.target.value)}
            />
          </Field>
          <Field label={t("patient.emergency.relationship")}>
            <Input
              placeholder={t("patient.emergency.relationshipPlaceholder")}
              value={form.emergencyContact.relationship}
              onChange={(e) => setEmergency("relationship", e.target.value)}
            />
          </Field>
          <Field label={t("patient.fields.phone")}>
            <Input
              placeholder="+54 11 0000-0000"
              value={form.emergencyContact.phone}
              onChange={(e) => setEmergency("phone", e.target.value)}
            />
          </Field>
          <Field label={t("patient.fields.email")}>
            <Input
              type="email"
              placeholder="emergencia@email.com"
              value={form.emergencyContact.email}
              onChange={(e) => setEmergency("email", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Icon name="ClipboardCheck" size={13} className="text-primary" />
            {t("patient.summary.title")}
          </p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: t("patient.summary.name"), value: form.name },
            { label: t("patient.fields.email"), value: form.email },
            { label: t("patient.fields.phone"), value: form.phone },
            { label: t("patient.fields.city"), value: form.city },
            {
              label: t("patient.summary.insurance"),
              value: insuranceOptions.find((o) => o.value === form.insurance)?.label,
            },
            { label: t("patient.summary.bloodType"), value: form.bloodType?.toUpperCase() },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
              <p className="text-sm text-foreground font-medium truncate">
                {value || <span className="text-muted-foreground italic text-xs">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[92vh] border border-border overflow-hidden">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full overflow-hidden">
          {/* HEADER */}
          <div className="px-6 pt-6 pb-0 bg-background/60 border-b border-border">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="UserCog" size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-base text-foreground leading-tight">
                    {t("patient.editTitle")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("patient.stepIndicator", {
                      current: step + 1,
                      total: stepsConfig.length,
                      label: stepsConfig[step].label,
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            <StepIndicator current={step} steps={stepsConfig} />
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
            <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-200">
              {stepContent[step]}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-border bg-background/60 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {stepsConfig.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-5 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-border"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {step > 0 ? (
                <Button variant="outline" type="button" onClick={goBack} iconName="ChevronLeft" iconPosition="left">
                  {t("common.back")}
                </Button>
              ) : (
                <Button variant="outline" type="button" onClick={onClose}>
                  {t("common.cancel")}
                </Button>
              )}
              {!isLast ? (
                <Button variant="default" type="button" onClick={goNext} iconName="ChevronRight" iconPosition="right">
                  {t("common.continue")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  type="button"
                  className="px-6"
                  iconName="Save"
                  iconPosition="left"
                  onClick={() => onSave(form, imageFile)}
                >
                  {t("common.saveChanges")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Sub-componentes Estáticos Reubicados ────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>}
    {children}
  </div>
);

const StepIndicator = ({ current, steps }) => (
  <div className="flex items-center gap-0">
    {steps.map((step, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border",
                done && "bg-primary border-primary text-primary-foreground shadow-sm",
                active && "bg-primary/10 border-primary text-primary scale-110 shadow-md",
                !done && !active && "bg-muted/50 border-border text-muted-foreground"
              )}
            >
              {done ? <Icon name="Check" size={14} /> : <Icon name={step.icon} size={14} />}
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider transition-colors",
                active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-px flex-1 mx-2 mb-4 transition-all duration-500",
                i < current ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default EditPatientModal;
