// pages/patient-directory/components/EditPatientModal.jsx
import React, { useCallback, useMemo } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Image from "@/components/AppImage";
import { cn } from "@/utils/cn";
import Field from "@/components/ui/Field";
import StepIndicator from "@/components/ui/StepIndicator";
import { useEditPatientForm, BLOOD_OPTIONS } from "@/hooks/PatientFormHooks";

// ─── Step sub-components ─────────────────────────────────────────────────────

const StepPersonal = ({
  form,
  set,
  previewImage,
  fileInputRef,
  handleImageChange,
  statusOptions,
  genderOptions,
  maritalStatusOptions,
  t,
}) => (
  <div className="space-y-6">
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
        <Field label={t("common.labels.fullName")}>
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
      <Field label={t("common.labels.gender")}>
        <Select
          options={genderOptions}
          value={form.gender}
          onChange={(v) => set("gender", v)}
          placeholder={t("common.select")}
        />
      </Field>
      <Field label={t("common.labels.bloodType")}>
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
  </div>
);

const StepContact = ({ form, set, t }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label={t("common.labels.email")}>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="ejemplo@email.com"
        />
      </Field>
      <Field label={t("common.labels.phone")}>
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
  </div>
);

const StepMedical = ({ form, set, genderOptions, insuranceOptions, currentStatus, t }) => {
  const summaryCards = useMemo(
    () => [
      {
        label: t("patient.summary.bloodType"),
        value: form.bloodType?.toUpperCase(),
        icon: "Droplets",
        color: "text-red-600 bg-red-50",
      },
      {
        label: t("common.labels.gender"),
        value: genderOptions.find((o) => o.value === form.gender)?.label,
        icon: "User",
        color: "text-blue-600 bg-blue-50",
      },
      {
        label: t("common.labels.status"),
        value: currentStatus.label,
        icon: "Activity",
        color: `${currentStatus.text} ${currentStatus.light}`,
      },
    ],
    [t, form.bloodType, form.gender, genderOptions, currentStatus]
  );

  return (
    <div className="space-y-5">
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
        {summaryCards.map(({ label, value, icon, color }) => (
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
    </div>
  );
};

const StepEmergency = ({ form, setEmergency, insuranceOptions, t }) => {
  const summaryRows = useMemo(
    () => [
      { label: t("patient.summary.name"), value: form.name },
      { label: t("common.labels.email"), value: form.email },
      { label: t("common.labels.phone"), value: form.phone },
      { label: t("patient.fields.city"), value: form.city },
      { label: t("patient.summary.insurance"), value: insuranceOptions.find((o) => o.value === form.insurance)?.label },
      { label: t("patient.summary.bloodType"), value: form.bloodType?.toUpperCase() },
    ],
    [t, form, insuranceOptions]
  );

  return (
    <div className="space-y-5">
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
          <Field label={t("common.labels.fullName")}>
            <Input
              placeholder={t("common.labels.fullName")}
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
          <Field label={t("common.labels.phone")}>
            <Input
              placeholder="+54 11 0000-0000"
              value={form.emergencyContact.phone}
              onChange={(e) => setEmergency("phone", e.target.value)}
            />
          </Field>
          <Field label={t("common.labels.email")}>
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
          {summaryRows.map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
              <p className="text-sm text-foreground font-medium truncate">
                {value || <span className="text-muted-foreground italic text-xs">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const {
    t,
    fileInputRef,
    step,
    form,
    previewImage,
    imageFile,
    statusOptions,
    genderOptions,
    maritalStatusOptions,
    insuranceOptions,
    stepsConfig,
    currentStatus,
    isLast,
    set,
    setEmergency,
    handleImageChange,
    goNext,
    goBack,
  } = useEditPatientForm(patient);

  const handleSave = useCallback(() => onSave(form, imageFile), [onSave, form, imageFile]);

  const stepContent = useMemo(
    () => [
      <StepPersonal
        key="personal"
        form={form}
        set={set}
        previewImage={previewImage}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        statusOptions={statusOptions}
        genderOptions={genderOptions}
        maritalStatusOptions={maritalStatusOptions}
        t={t}
      />,
      <StepContact key="contact" form={form} set={set} t={t} />,
      <StepMedical
        key="medical"
        form={form}
        set={set}
        genderOptions={genderOptions}
        insuranceOptions={insuranceOptions}
        currentStatus={currentStatus}
        t={t}
      />,
      <StepEmergency
        key="emergency"
        form={form}
        setEmergency={setEmergency}
        insuranceOptions={insuranceOptions}
        t={t}
      />,
    ],
    [
      form,
      set,
      setEmergency,
      previewImage,
      fileInputRef,
      handleImageChange,
      statusOptions,
      genderOptions,
      maritalStatusOptions,
      insuranceOptions,
      currentStatus,
      t,
    ]
  );

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
                  onClick={handleSave}
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

export default EditPatientModal;
