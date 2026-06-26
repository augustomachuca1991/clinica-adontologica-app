// hooks/useEditPatientForm.js
import { useState, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { notifyError } from "@/utils/notifications";

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

export const useEditPatientForm = (patient) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    ...patient,
    emergencyContact: patient?.emergencyContact || {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    allergies: patient?.allergies || [],
  });
  const [previewImage, setPreviewImage] = useState(patient?.avatar);
  const [imageFile, setImageFile] = useState(null);

  // ── Opciones i18n memorizadas ────────────────────────────────────────────
  const statusOptions = useMemo(
    () => [
      {
        id: "active",
        label: t("common.status.active"),
        color: "bg-emerald-500",
        ring: "ring-emerald-500/30",
        text: "text-emerald-300",
        light: "bg-emerald-500/10 border-emerald-500/20",
      },
      {
        id: "pending",
        label: t("common.status.pending"),
        color: "bg-amber-500",
        ring: "ring-amber-500/30",
        text: "text-amber-300",
        light: "bg-amber-500/10 border-amber-500/20",
      },
      {
        id: "inactive",
        label: t("common.status.inactive"),
        color: "bg-slate-500",
        ring: "ring-slate-500/30",
        text: "text-slate-300",
        light: "bg-slate-500/10 border-slate-500/20",
      },
    ],
    [t]
  );

  const genderOptions = useMemo(
    () => [
      { value: "female", label: t("patient.gender.female") },
      { value: "male", label: t("patient.gender.male") },
      { value: "other", label: t("patient.gender.other") },
    ],
    [t]
  );

  const maritalStatusOptions = useMemo(
    () => [
      { value: "single", label: t("patient.marital.single") },
      { value: "married", label: t("patient.marital.married") },
      { value: "divorced", label: t("patient.marital.divorced") },
      { value: "widowed", label: t("patient.marital.widowed") },
      { value: "separated", label: t("patient.marital.separated") },
      { value: "notSpecified", label: t("patient.marital.notSpecified") },
    ],
    [t]
  );

  const insuranceOptions = useMemo(
    () => [
      { value: "osde", label: "OSDE" },
      { value: "swiss_medical", label: "Swiss Medical" },
      { value: "galeno", label: "Galeno" },
      { value: "ioscor", label: "IOSCOR" },
      { value: "ioma", label: "IOMA" },
      { value: "ospe", label: "OSPE" },
      { value: "self_pay", label: t("patient.insurance.selfPay") },
      { value: "other", label: t("patient.insurance.other") },
    ],
    [t]
  );

  const stepsConfig = useMemo(
    () => [
      { id: 0, label: t("patient.steps.personal"), icon: "User" },
      { id: 1, label: t("patient.steps.contact"), icon: "Phone" },
      { id: 2, label: t("patient.steps.medical"), icon: "Stethoscope" },
      { id: 3, label: t("patient.steps.emergency"), icon: "ShieldAlert" },
    ],
    [t]
  );

  const currentStatus = useMemo(
    () => statusOptions.find((o) => o.id === form.status) ?? statusOptions[2],
    [statusOptions, form.status]
  );

  // ── Setters ──────────────────────────────────────────────────────────────
  const set = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setEmergency = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  }, []);

  // ── Image handler ────────────────────────────────────────────────────────
  const handleImageChange = useCallback(
    (e) => {
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
    },
    [t]
  );

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, stepsConfig.length - 1)), [stepsConfig.length]);

  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const isLast = step === stepsConfig.length - 1;

  return {
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
  };
};
