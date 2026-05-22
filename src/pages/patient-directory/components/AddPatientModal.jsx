import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import LoadSending from "@/components/ui/LoadSending";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import { cn } from "@/utils/cn";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { useFormik } from "formik";
import * as Yup from "yup";
import { notifyError } from "@/utils/notifications";

const QUICK_TAGS = ["vip", "recommended", "new", "family", "other"];

const STATUS_OPTIONS = [
  { id: "active", label: "Activo", color: "bg-emerald-500" },
  { id: "pending", label: "Pendiente", color: "bg-amber-500" },
  { id: "inactive", label: "Inactivo", color: "bg-slate-400" },
];

const GENDER_OPTIONS = [
  { value: "female", label: "Femenino" },
  { value: "male", label: "Masculino" },
  { value: "other", label: "Otro" },
];

const INSURANCE_OPTIONS = [
  { value: "osde", label: "OSDE" },
  { value: "swiss_medical", label: "Swiss Medical" },
  { value: "galeno", label: "Galeno" },
  { value: "ioscor", label: "IOSCOR" },
  { value: "ioma", label: "IOMA" },
  { value: "ospe", label: "OSPE" },
  { value: "self_pay", label: "Particular" },
  { value: "other", label: "Otra" },
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

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Soltero/a" },
  { value: "married", label: "Casado/a" },
  { value: "divorced", label: "Divorciado/a" },
  { value: "widowed", label: "Viudo/a" },
  { value: "separated", label: "Separado/a" },
  { value: "notSpecified", label: "No especificado" },
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

const AddPatientModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("login.errors.required")),
    email: Yup.string().email(t("login.errors.invalidEmail")).required(t("login.errors.required")),
    dateOfBirth: Yup.date().required(t("login.errors.required")),
    emergencyContact: Yup.object({
      email: Yup.string().email(t("login.errors.invalidEmail")),
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
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notifyError(t("image.size") || "La imagen es demasiado grande (máximo 2MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    formik.resetForm(); // Esto limpia los valores de Formik
    setPreviewImage(null);
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-6">
      <div className="bg-card rounded-3xl shadow-clinical-xl w-full max-w-3xl flex flex-col max-h-[90vh] border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full overflow-hidden">
          {/* HEADER */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
            <h3 className="text-xl font-headline font-semibold text-foreground flex items-center gap-2">
              {t("modal.newPatient")}
            </h3>
            <Button
              type="button"
              onClick={handleClose}
              className="bg-muted text-muted-foreground hover:bg-accent hover:text-muted p-2 rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
            {/* SECCIÓN 1: DATOS PERSONALES */}
            <section className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label={t("patient.form.fields.name")}
                    name="name"
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && formik.errors.name}
                    required
                  />
                </div>
                <Input
                  label={t("patient.form.fields.dateOfBirth")}
                  type="date"
                  name="dateOfBirth"
                  {...formik.getFieldProps("dateOfBirth")}
                  error={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  required
                />
                <Select
                  label={t("patient.form.fields.gender")}
                  name="gender"
                  options={GENDER_OPTIONS}
                  value={formik.values.gender}
                  onChange={(val) => formik.setFieldValue("gender", val)}
                />
                <Select
                  label={t("patient.form.fields.bloodType")}
                  name="bloodType"
                  options={BLOOD_OPTIONS}
                  value={formik.values.bloodType}
                  onChange={(val) => formik.setFieldValue("bloodType", val)}
                />
                <Select
                  label={t("patient.form.fields.maritalStatus")}
                  name="maritalStatus"
                  options={MARITAL_STATUS_OPTIONS}
                  value={formik.values.maritalStatus}
                  onChange={(val) => formik.setFieldValue("maritalStatus", val)}
                />
              </div>
            </section>

            {/* SECCIÓN 2: CONTACTO Y UBICACIÓN */}
            <section className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  error={formik.touched.email && formik.errors.email}
                  required
                />
                {/* <Input
                  label={t("patient.form.fields.phone")}
                  name="phone"
                  {...formik.getFieldProps("phone")}
                  error={formik.touched.phone && formik.errors.phone}
                /> */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">{t("patient.form.fields.phone")}</label>
                  <PhoneInput
                    international
                    defaultCountry="AR" // Puedes poner "AR" por defecto para Argentina
                    value={formik.values.phone}
                    onChange={(val) => formik.setFieldValue("phone", val)}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      formik.touched.phone && formik.errors.phone && "border-destructive"
                    )}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-xs text-destructive">{formik.errors.phone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Input label={t("patient.form.fields.address")} name="address" {...formik.getFieldProps("address")} />
                </div>
                <Input label={t("patient.form.fields.city")} name="city" {...formik.getFieldProps("city")} />
                <div className="grid grid-cols-2 gap-5">
                  <Input label={t("patient.form.fields.state")} name="state" {...formik.getFieldProps("state")} />
                  <Input label={t("patient.form.fields.zipCode")} name="zipCode" {...formik.getFieldProps("zipCode")} />
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="p-6 bg-muted/20 rounded-2xl border border-border space-y-5">
                <p className="text-sm font-semibold text-foreground">Contacto de Emergencia</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label={t("patient.form.fields.emergencyName")}
                    name="name"
                    {...formik.getFieldProps("emergencyContact.name")}
                    error={formik.touched.emergencyContact?.name ? formik.errors.emergencyContact?.name : undefined}
                  />
                  <Input
                    label={t("patient.form.fields.relationship")}
                    name="relationship"
                    {...formik.getFieldProps("emergencyContact.relationship")}
                    error={
                      formik.touched.emergencyContact?.relationship
                        ? formik.errors.emergencyContact?.relationship
                        : undefined
                    }
                  />
                  <Input
                    label={t("patient.form.fields.emergencyPhone")}
                    name="phone"
                    {...formik.getFieldProps("emergencyContact.phone")}
                    error={formik.touched.emergencyContact?.phone ? formik.errors.emergencyContact?.phone : undefined}
                  />
                  <Input
                    label="Email"
                    name="email"
                    {...formik.getFieldProps("emergencyContact.email")}
                    error={formik.touched.emergencyContact?.email ? formik.errors.emergencyContact?.email : undefined}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                {/* <Input
                  label={t("patient.form.fields.insurance.label")}
                  name="insurance"
                  placeholder={t("patient.form.fields.insurance.placeholder")}
                  {...formik.getFieldProps("insurance")}
                /> */}

                <Select
                  label={t("patient.form.fields.insurance.label")}
                  name="insurance"
                  options={INSURANCE_OPTIONS}
                  value={formik.values.insurance}
                  onChange={(val) => formik.setFieldValue("insurance", val)}
                />
                <Input
                  label={t("patient.form.fields.allergies.label")}
                  name="allergies"
                  placeholder={t("patient.form.fields.allergies.placeholder")}
                  value={formik.values.allergies.join(", ")}
                  onChange={(e) => {
                    const value = e.target.value;
                    const allergiesArray = value.split(",").map((item) => item.trimStart());
                    formik.setFieldValue("allergies", allergiesArray);
                  }}
                  error={formik.touched.allergies && formik.errors.allergies}
                />
              </div>
            </section>

            <section>
              <div className="flex flex-col md:flex-row gap-8 items-center border-b border-border pb-8">
                <div className="relative group flex flex-row items-start gap-4">
                  <Image
                    src={previewImage || "default"}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover ring-4 ring-muted"
                  />
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" type="button" size="sm" onClick={() => fileInputRef.current.click()}>
                      <Icon name={previewImage ? "RefreshCw" : "Camera"} size={14} className="mr-2" />
                      {previewImage ? t("change") : t("choosePhoto")}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    {imageFile && <span className="text-[10px] text-muted-foreground">{imageFile.name}</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* ===================== TAGS ===================== */}

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon name="Tag" size={16} className="text-primary" />
                <h4 className="text-sm font-semibold text-foreground">{t("patient.form.sections.tags")}</h4>
              </div>

              {/* SELECTOR DE QUICK TAGS */}
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = formik.values.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const nextTags = isSelected
                          ? formik.values.tags.filter((t) => t !== tag)
                          : [...formik.values.tags, tag];
                        formik.setFieldValue("tags", nextTags);
                      }}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 active:scale-95",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {t(`patient.form.tags.${tag}`)}
                    </button>
                  );
                })}
              </div>

              {/* LISTADO DE SELECCIONADOS (Versión Limpia) */}
              {formik.values.tags.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-medium text-muted-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Icon name="CheckCircle2" size={12} className="text-emerald-500" />
                    {t("patient.form.tags.selectedLegend")}
                  </p>

                  <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/30 border border-dashed border-border">
                    {formik.values.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-lg bg-background border border-border text-xs font-medium text-foreground animate-in fade-in zoom-in duration-150"
                      >
                        {t(`patient.form.tags.${tag}`)}
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = formik.values.tags.filter((t) => t !== tag);
                            formik.setFieldValue("tags", filtered);
                          }}
                          className="p-0.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-border bg-background/50 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={handleClose} className="px-6">
              {t("cancel")}
            </Button>
            <Button
              variant="default"
              type="submit"
              className="px-8 shadow-lg shadow-primary/20"
              disabled={formik.isSubmitting}
            >
              <LoadSending isLoading={formik.isSubmitting} text={t("dashboard.quickActions.newPatient")} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
