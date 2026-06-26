import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Field from "@/components/ui/Field";
import StepIndicator from "@/components/ui/StepIndicator";
import AvatarUploader from "@/components/ui/AvatarUploader";
import TagPill from "@/components/ui/TagPill";
import LoadSending from "@/components/ui/LoadSending";
import Icon from "@/components/AppIcon";
import { cn } from "@/utils/cn";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { notifyError } from "@/utils/notifications";

// ─── Constantes y Configuración de i18n Estáticas ────────────────────────────
const QUICK_TAGS = ["vip", "recommended", "new", "family", "other"];

const getGenderOptions = (t) => [
  { value: "female", label: t("patient.gender.female") },
  { value: "male", label: t("patient.gender.male") },
  { value: "other", label: t("patient.gender.other") },
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

const getSteps = (t) => [
  { id: 0, label: t("patient.steps.personal"), icon: "User" },
  { id: 1, label: t("patient.steps.contact"), icon: "Phone" },
  { id: 2, label: t("patient.steps.medical"), icon: "Stethoscope" },
  { id: 3, label: t("patient.steps.emergency"), icon: "ShieldAlert" },
  { id: 4, label: t("patient.steps.profile"), icon: "Tag" },
];

const INITIAL_FORM_STATE = {
  name: "",
  status: "inactive",
  dateOfBirth: "",
  gender: "",
  bloodType: "",
  maritalStatus: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  insurance: "",
  allergies: [],
  tags: [],
  emergencyContact: { name: "", relationship: "", phone: "", email: "" },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [direction, setDirection] = useState(1); // 1 forward, -1 back

  // Inicialización localizada en render
  const genderOptions = getGenderOptions(t);
  const insuranceOptions = getInsuranceOptions(t);
  const maritalStatusOptions = getMaritalStatusOptions(t);
  const stepsConfig = getSteps(t);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("patient.errors.required")),
    email: Yup.string().email(t("patient.errors.invalidEmail")).required(t("patient.errors.required")),
    dateOfBirth: Yup.date().required(t("patient.errors.required")),
    emergencyContact: Yup.object({
      email: Yup.string().email(t("patient.errors.invalidEmail")),
    }),
    allergies: Yup.array().of(Yup.string()),
  });

  const formik = useFormik({
    initialValues: INITIAL_FORM_STATE,
    validationSchema,
    onSubmit: async (values) => {
      const finalValues = {
        ...values,
        allergies: values.allergies.filter((a) => a.trim() !== ""),
      };
      await onSave(finalValues, imageFile);
      handleClose();
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notifyError(t("patient.errors.imageSize"));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    formik.resetForm();
    setPreviewImage(null);
    setImageFile(null);
    setStep(0);
    onClose();
  };

  const goNext = async () => {
    const stepFields = {
      0: ["name", "dateOfBirth"],
      1: ["email"],
      2: [],
      3: [],
      4: [],
    };
    await formik.setTouched(stepFields[step].reduce((acc, f) => ({ ...acc, [f]: true }), {}));
    const errors = await formik.validateForm();
    const hasStepError = stepFields[step].some((f) => errors[f]);
    if (hasStepError) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, stepsConfig.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleTag = (tag) => {
    const next = formik.values.tags.includes(tag)
      ? formik.values.tags.filter((t) => t !== tag)
      : [...formik.values.tags, tag];
    formik.setFieldValue("tags", next);
  };

  if (!isOpen) return null;

  // ─── Step Content ───────────────────────────────────────────────────────────
  const stepContent = [
    // STEP 0 — Personal
    <div key="personal" className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Field label={t("common.labels.fullName")} required error={formik.touched.name && formik.errors.name}>
            <Input name="name" placeholder={t("patient.placeholders.fullName")} {...formik.getFieldProps("name")} />
          </Field>
        </div>
        <Field
          label={t("patient.fields.birthDate")}
          required
          error={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
        >
          <Input type="date" name="dateOfBirth" {...formik.getFieldProps("dateOfBirth")} />
        </Field>
        <Field label={t("common.labels.gender")}>
          <Select
            options={genderOptions}
            value={formik.values.gender}
            onChange={(v) => formik.setFieldValue("gender", v)}
            placeholder={t("common.select")}
          />
        </Field>
        <Field label={t("common.labels.bloodType")}>
          <Select
            options={BLOOD_OPTIONS}
            value={formik.values.bloodType}
            onChange={(v) => formik.setFieldValue("bloodType", v)}
            placeholder={t("common.select")}
          />
        </Field>
        <Field label={t("patient.fields.maritalStatus")}>
          <Select
            options={maritalStatusOptions}
            value={formik.values.maritalStatus}
            onChange={(v) => formik.setFieldValue("maritalStatus", v)}
            placeholder={t("common.select")}
          />
        </Field>
      </div>
    </div>,

    // STEP 1 — Contacto
    <div key="contacto" className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t("common.labels.email")} required error={formik.touched.email && formik.errors.email}>
          <Input name="email" type="email" placeholder="ejemplo@email.com" {...formik.getFieldProps("email")} />
        </Field>
        <Field label={t("common.labels.phone")}>
          <PhoneInput
            international
            defaultCountry="AR"
            value={formik.values.phone}
            onChange={(v) => formik.setFieldValue("phone", v)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
              formik.touched.phone && formik.errors.phone && "border-destructive"
            )}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label={t("patient.fields.address")}>
            <Input name="address" placeholder="Av. Corrientes 1234" {...formik.getFieldProps("address")} />
          </Field>
        </div>
        <Field label={t("patient.fields.city")}>
          <Input name="city" placeholder="Buenos Aires" {...formik.getFieldProps("city")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("patient.fields.state")}>
            <Input name="state" placeholder="CABA" {...formik.getFieldProps("state")} />
          </Field>
          <Field label={t("patient.fields.zipCode")}>
            <Input name="zipCode" placeholder="1043" {...formik.getFieldProps("zipCode")} />
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
            value={formik.values.insurance}
            onChange={(v) => formik.setFieldValue("insurance", v)}
            placeholder={t("patient.placeholders.insurance")}
          />
        </Field>
        <Field label={t("patient.fields.allergies")}>
          <Input
            name="allergies"
            placeholder={t("patient.placeholders.allergies")}
            value={formik.values.allergies.join(", ")}
            onChange={(e) => {
              const arr = e.target.value.split(",").map((i) => i.trimStart());
              formik.setFieldValue("allergies", arr);
            }}
          />
        </Field>
      </div>

      <div className="border border-border rounded-xl p-5 bg-muted/20">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {t("patient.fields.avatar")}
        </p>
        <AvatarUploader preview={previewImage} imageFile={imageFile} onFileChange={handleImageChange} t={t} />
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
          <Field label={t("common.labels.fullName")}>
            <Input
              placeholder={t("common.labels.fullName")}
              {...formik.getFieldProps("emergencyContact.name")}
              error={formik.touched.emergencyContact?.name ? formik.errors.emergencyContact?.name : undefined}
            />
          </Field>
          <Field label={t("patient.emergency.relationship")}>
            <Input
              placeholder={t("patient.emergency.relationshipPlaceholder")}
              {...formik.getFieldProps("emergencyContact.relationship")}
            />
          </Field>
          <Field label={t("common.labels.phone")}>
            <Input placeholder="+54 11 0000-0000" {...formik.getFieldProps("emergencyContact.phone")} />
          </Field>
          <Field
            label={t("common.labels.email")}
            error={formik.touched.emergencyContact?.email ? formik.errors.emergencyContact?.email : undefined}
          >
            <Input
              type="email"
              placeholder="emergencia@email.com"
              {...formik.getFieldProps("emergencyContact.email")}
            />
          </Field>
        </div>
      </div>
    </div>,

    // STEP 4 — Perfil / Tags
    <div key="perfil" className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Icon name="Tag" size={13} className="text-primary" />
          {t("patient.tags.title")}
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <TagPill
              key={tag}
              tag={tag}
              selected={formik.values.tags.includes(tag)}
              onToggle={toggleTag}
              label={t(`patient.tags.items.${tag}`)}
            />
          ))}
        </div>
        {formik.values.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/30 border border-dashed border-border mt-2">
            {formik.values.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-lg bg-background border border-border text-xs font-medium text-foreground"
              >
                {t(`patient.tags.items.${tag}`)}
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="p-0.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
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
            { label: t("patient.summary.name"), value: formik.values.name },
            { label: t("common.labels.email"), value: formik.values.email },
            { label: t("patient.fields.birthDate"), value: formik.values.dateOfBirth },
            { label: t("common.labels.phone"), value: formik.values.phone },
            {
              label: t("patient.summary.insurance"),
              value: insuranceOptions.find((o) => o.value === formik.values.insurance)?.label,
            },
            { label: t("patient.summary.bloodType"), value: formik.values.bloodType?.toUpperCase() },
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

  const isLastStep = step === stepsConfig.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-5">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[92vh] border border-border overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full overflow-hidden">
          {/* HEADER */}
          <div className="px-6 pt-6 pb-0 bg-background/60 border-b border-border">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="UserPlus" size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-base text-foreground leading-tight">
                    {t("patient.newTitle")}
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
              <Button type="button" variant="ghost" size="icon" iconName="X" onClick={handleClose} />
            </div>

            <StepIndicator current={step} total={stepsConfig.length} steps={stepsConfig} />
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
              {step > 0 && (
                <Button variant="outline" type="button" onClick={goBack} iconName="ChevronLeft" iconPosition="left">
                  {t("common.back")}
                </Button>
              )}
              {step === 0 && (
                <Button variant="outline" type="button" onClick={handleClose}>
                  {t("common.cancel")}
                </Button>
              )}
              {!isLastStep ? (
                <Button variant="default" type="button" onClick={goNext} iconName="ChevronRight" iconPosition="right">
                  {t("common.continue")}
                </Button>
              ) : (
                <Button
                  variant="default"
                  type="button"
                  disabled={formik.isSubmitting}
                  className="px-6"
                  onClick={() => formik.submitForm()}
                >
                  <LoadSending isLoading={formik.isSubmitting} text={t("patient.submitNew")} />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
