import * as Yup from "yup";

// ─── Opciones estáticas (no dependen de t) ────────────────────────────────────
export const BLOOD_OPTIONS = [
  { value: "a+", label: "A+" },
  { value: "a-", label: "A-" },
  { value: "b+", label: "B+" },
  { value: "b-", label: "B-" },
  { value: "ab+", label: "AB+" },
  { value: "ab-", label: "AB-" },
  { value: "o+", label: "O+" },
  { value: "o-", label: "O-" },
];

export const INSURANCE_OPTIONS_STATIC = [
  { value: "osde", label: "OSDE" },
  { value: "swiss_medical", label: "Swiss Medical" },
  { value: "galeno", label: "Galeno" },
  { value: "ioscor", label: "IOSCOR" },
  { value: "ioma", label: "IOMA" },
  { value: "ospe", label: "OSPE" },
];

// Las últimas dos sí necesitan t()
export const getInsuranceOptions = (t) => [
  ...INSURANCE_OPTIONS_STATIC,
  { value: "self_pay", label: t("patient.insurance.selfPay") },
  { value: "other", label: t("patient.insurance.other") },
];

export const getGenderOptions = (t) => [
  { value: "female", label: t("patient.gender.female") },
  { value: "male", label: t("patient.gender.male") },
  { value: "other", label: t("patient.gender.other") },
];

export const getMaritalStatusOptions = (t) => [
  { value: "single", label: t("patient.marital.single") },
  { value: "married", label: t("patient.marital.married") },
  { value: "divorced", label: t("patient.marital.divorced") },
  { value: "widowed", label: t("patient.marital.widowed") },
  { value: "separated", label: t("patient.marital.separated") },
  { value: "notSpecified", label: t("patient.marital.notSpecified") },
];

export const getStatusOptions = (t) => [
  {
    id: "active",
    label: t("common.status.active"),
    color: "bg-emerald-500",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
    light: "bg-emerald-50 border-emerald-200",
  },
  {
    id: "pending",
    label: t("common.status.pending"),
    color: "bg-amber-500",
    ring: "ring-amber-200",
    text: "text-amber-700",
    light: "bg-amber-50 border-amber-200",
  },
  {
    id: "inactive",
    label: t("common.status.inactive"),
    color: "bg-slate-400",
    ring: "ring-slate-200",
    text: "text-slate-600",
    light: "bg-slate-50 border-slate-200",
  },
];

export const getStepsConfig = (t) => [
  { id: 0, label: t("patient.steps.personal"), icon: "User" },
  { id: 1, label: t("patient.steps.contact"), icon: "Phone" },
  { id: 2, label: t("patient.steps.medical"), icon: "Stethoscope" },
  { id: 3, label: t("patient.steps.emergency"), icon: "ShieldAlert" },
];

// ─── Valores iniciales ────────────────────────────────────────────────────────
export const getInitialValues = (patient) => ({
  // Personal
  name: patient?.name || "",
  dateOfBirth: patient?.dateOfBirth || "",
  gender: patient?.gender || "",
  bloodType: patient?.bloodType || "",
  maritalStatus: patient?.maritalStatus || "",
  status: patient?.status || "active",
  avatar: patient?.avatar || "",

  // Contacto
  email: patient?.email || "",
  phone: patient?.phone || "",
  address: patient?.address || "",
  city: patient?.city || "",
  state: patient?.state || "",
  zipCode: patient?.zipCode || "",

  // Médico
  insurance: patient?.insurance || "",
  allergies: Array.isArray(patient?.allergies) ? patient.allergies.join(", ") : patient?.allergies || "",

  // Emergencia
  emergencyContact: {
    name: patient?.emergencyContact?.name || "",
    relationship: patient?.emergencyContact?.relationship || "",
    phone: patient?.emergencyContact?.phone || "",
    email: patient?.emergencyContact?.email || "",
  },
});

// ─── Schemas Yup por step ─────────────────────────────────────────────────────
export const getStepSchemas = (t) => [
  // Step 0 — Personal
  Yup.object({
    name: Yup.string().trim().required(t("patient.errors.nameRequired")),
    dateOfBirth: Yup.string().required(t("patient.errors.birthDateRequired")),
    gender: Yup.string().required(t("patient.errors.genderRequired")),
    bloodType: Yup.string().required(t("patient.errors.bloodTypeRequired")),
  }),

  // Step 1 — Contacto
  Yup.object({
    email: Yup.string().email(t("patient.errors.invalidEmail")).required(t("patient.errors.emailRequired")),
    phone: Yup.string().min(7, t("patient.errors.phoneMin")).required(t("patient.errors.phoneRequired")),
    address: Yup.string().trim().required(t("patient.errors.addressRequired")),
    city: Yup.string().trim().required(t("patient.errors.cityRequired")),
  }),

  // Step 2 — Médico (insurance opcional, allergies opcional)
  Yup.object({
    insurance: Yup.string().required(t("patient.errors.insuranceRequired")),
  }),

  // Step 3 — Emergencia (contacto requerido)
  Yup.object({
    emergencyContact: Yup.object({
      name: Yup.string().trim().required(t("patient.errors.emergencyNameRequired")),
      phone: Yup.string().min(7, t("patient.errors.phoneMin")).required(t("patient.errors.emergencyPhoneRequired")),
    }),
  }),
];

// ─── Mapper values → payload final para onSave ────────────────────────────────
export const buildPatientPayload = (values, imageFile) => ({
  ...values,
  allergies: values.allergies
    ? values.allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [],
  imageFile,
});
