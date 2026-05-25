import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";
import { useServices } from "@/hooks/ServiceCategoriesHooks";
import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks";
import { notifyError, notifySuccess } from "@/utils/notifications";

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];

const EMPTY_FORM = {
  name: "",
  baseCost: "",
  duration: "30",
  categoryId: "",
};

const QuickAddServiceModal = ({ isOpen, onSaved, onClose, onRefresh }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);

  const { categories, fetchCategories, loading: loadingCategories } = useServices();
  const { addService } = useTreatmentServices();

  // Control de efectos al abrir/cerrar el modal
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setForm(EMPTY_FORM);
      // Foco seguro al abrirse
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, fetchCategories]);

  // Memorizamos las opciones para evitar re-mapeos masivos al escribir
  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
  }, [categories]);

  // Función manejadora unificada y memorizada
  const handleInputChange = useCallback(
    (key) => (e) => {
      const value = e?.target ? e.target.value : e;
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = async () => {
    if (!form.name.trim()) return notifyError(t("quickAddServiceModal.notifications.errorName"));
    if (!form.categoryId) return notifyError(t("quickAddServiceModal.notifications.errorCategory"));

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        baseCost: parseFloat(form.baseCost) || 0,
        duration: parseInt(form.duration) || 30,
        categoryId: parseInt(form.categoryId),
      };

      const result = await addService(payload);
      if (!result.success) {
        notifyError(t("quickAddServiceModal.notifications.errorSave") + result.error);
        return;
      }

      await onRefresh();
      notifySuccess(t("quickAddServiceModal.notifications.success", { name: payload.name }));
      onSaved?.(payload);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-background w-full max-w-md rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Stethoscope" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground leading-tight">
                {t("quickAddServiceModal.title")}
              </h3>
              <p className="text-xs text-muted-foreground">{t("quickAddServiceModal.subtitle")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
            aria-label={t("quickAddServiceModal.close")}
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/8 border border-amber-500/20">
            <Icon name="Info" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              {t("quickAddServiceModal.warning")}
            </p>
          </div>

          <Input
            ref={inputRef}
            label={t("quickAddServiceModal.labels.name")}
            placeholder={t("quickAddServiceModal.placeholders.name")}
            value={form.name}
            onChange={handleInputChange("name")}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t("quickAddServiceModal.labels.category")}
              options={categoryOptions}
              value={form.categoryId}
              onChange={handleInputChange("categoryId")}
              placeholder={
                loadingCategories
                  ? t("quickAddServiceModal.placeholders.loading")
                  : t("quickAddServiceModal.placeholders.select")
              }
              disabled={loadingCategories}
            />
            <Select
              label={t("quickAddServiceModal.labels.duration")}
              options={DURATION_OPTIONS}
              value={form.duration}
              onChange={handleInputChange("duration")}
            />
          </div>

          <Input
            label={t("quickAddServiceModal.labels.cost")}
            type="number"
            placeholder={t("quickAddServiceModal.placeholders.cost")}
            value={form.baseCost}
            onChange={handleInputChange("baseCost")}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <Button variant="tertiary" type="button" onClick={onClose} className="flex-1">
            {t("quickAddServiceModal.buttons.cancel")}
          </Button>
          <Button variant="default" type="button" onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                {t("quickAddServiceModal.buttons.saving")}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Icon name="Check" size={15} />
                {t("quickAddServiceModal.buttons.save")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddServiceModal;
