import React, { useMemo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Icon from "@/components/AppIcon";
import { NOTE_TYPES, NOTE_FORM_INITIAL_VALUES, getNoteValidationSchema } from "@/utils/notesUtils/notes";

const NoteForm = ({ initial = {}, onSubmit, onCancel, isSubmitting, onAutoSave }) => {
  const { t } = useTranslation();
  const [autoSaveStatus, setAutoSaveStatus] = useState(null);
  const debounceRef = useRef(null);

  const validationSchema = useMemo(() => getNoteValidationSchema(t), [t]);

  const formik = useFormik({
    initialValues: {
      content: initial.content ?? NOTE_FORM_INITIAL_VALUES.content,
      type: initial.type ?? NOTE_FORM_INITIAL_VALUES.type,
      isPrivate: initial.is_private ?? NOTE_FORM_INITIAL_VALUES.isPrivate,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const isEditMode = !!initial.id;

  useEffect(() => {
    if (!isEditMode || !onAutoSave) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const hasChanges =
      formik.values.content !== (initial.content ?? "") ||
      formik.values.type !== (initial.type ?? NOTE_FORM_INITIAL_VALUES.type) ||
      formik.values.isPrivate !== (initial.is_private ?? NOTE_FORM_INITIAL_VALUES.isPrivate);
    if (!hasChanges) return;
    setAutoSaveStatus("saving");
    debounceRef.current = setTimeout(async () => {
      const res = await onAutoSave({
        content: formik.values.content,
        type: formik.values.type,
        isPrivate: formik.values.isPrivate,
      });
      setAutoSaveStatus(res.success ? "saved" : "error");
      if (res.success) {
        setTimeout(() => setAutoSaveStatus(null), 2000);
      }
    }, 2000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formik.values.content, formik.values.type, formik.values.isPrivate, isEditMode, onAutoSave]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ── Tipo de nota ── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("clinicalNotes.form.typeLabel")}</label>
        <div className="relative">
          <select
            {...formik.getFieldProps("type")}
            className="w-full appearance-none bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-8"
          >
            {NOTE_TYPES.map((typeOption) => (
              <option key={typeOption.value} value={typeOption.value}>
                {/* Traduce dinámicamente el listado según el value de la opción */}
                {t(`clinicalNotes.form.types.${typeOption.value}`, { defaultValue: typeOption.label })}
              </option>
            ))}
          </select>
          <Icon
            name="ChevronDown"
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* ── Contenido ── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {t("clinicalNotes.form.contentLabel")}
        </label>
        <textarea
          {...formik.getFieldProps("content")}
          rows={5}
          placeholder={t("clinicalNotes.form.placeholder")}
          className={`w-full bg-muted border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all resize-none ${
            formik.touched.content && formik.errors.content
              ? "border-red-400 focus:ring-red-200"
              : "border-border focus:ring-primary/30 focus:border-primary"
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {formik.touched.content && formik.errors.content ? (
            <p className="text-xs text-red-500">{formik.errors.content}</p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {autoSaveStatus === "saving" && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2.5 h-2.5 border border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                {t("clinicalNotes.form.saving")}
              </span>
            )}
            {autoSaveStatus === "saved" && (
              <span className="text-xs text-success">{t("clinicalNotes.form.saved")}</span>
            )}
            {autoSaveStatus === "error" && (
              <span className="text-xs text-error">{t("clinicalNotes.form.saveError")}</span>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {t("clinicalNotes.form.charCount", { count: formik.values.content.length })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Privacidad (Toggle) ── */}
      <button
        type="button"
        onClick={() => formik.setFieldValue("isPrivate", !formik.values.isPrivate)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
          formik.values.isPrivate
            ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
            : "bg-muted border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon name={formik.values.isPrivate ? "Lock" : "Unlock"} size={15} />
        <span className="flex-1 text-left">
          {formik.values.isPrivate ? t("clinicalNotes.form.privateActive") : t("clinicalNotes.form.privateInactive")}
        </span>
        <span
          aria-hidden="true"
          className={`w-8 h-4 rounded-full transition-colors relative ${
            formik.values.isPrivate ? "bg-amber-400" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-background shadow transition-all ${
              formik.values.isPrivate ? "left-4" : "left-0.5"
            }`}
          />
        </span>
      </button>

      {/* ── Acciones del formulario ── */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-50"
        >
          {t("common.actions.cancel")}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !formik.values.content.trim()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              {t("clinicalNotes.form.submitting")}
            </>
          ) : (
            <>
              <Icon name="Check" size={14} />
              {t("clinicalNotes.form.submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
