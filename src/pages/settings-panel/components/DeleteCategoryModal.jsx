// src/pages/settings-panel/components/DeleteCategoryModal.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const DeleteCategoryModal = ({ category, onClose, onConfirm, isDeleting }) => {
  const { t } = useTranslation();
  const [confirmed, setConfirmed] = useState(false);

  if (!category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5 mx-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{t("services.management.deleteCategory.title")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("services.management.deleteCategory.warning")}
            </p>
          </div>
        </div>

        {/* Info de la categoría */}
        <div className="bg-muted/40 border border-border rounded-lg p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("services.management.form.labelName")}</span>
            <span className="font-medium text-foreground">{category.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("services.management.form.labelId")}</span>
            <span className="font-medium text-foreground">#{category.id}</span>
          </div>
          {category.description && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground flex-shrink-0">{t("services.management.form.labelDescription")}</span>
              <span className="font-medium text-foreground text-right">{category.description}</span>
            </div>
          )}
        </div>

        {/* Advertencias */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">{t("services.management.deleteCategory.effects")}</p>
          <ul className="space-y-1.5">
            {[
              t("services.management.deleteCategory.effect1"),
              t("services.management.deleteCategory.effect2"),
              t("services.management.deleteCategory.effect3"),
              t("services.management.deleteCategory.effect4"),
            ].map((warning, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Icon name="AlertCircle" size={13} className="text-error flex-shrink-0 mt-0.5" />
                {warning}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmación manual */}
        <label className="flex items-start gap-3 cursor-pointer bg-error/5 border border-error/20 rounded-lg p-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-red-500"
          />
          <span className="text-xs text-foreground">
            {t("services.management.deleteCategory.confirmLabel")}
          </span>
        </label>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            iconName={isDeleting ? "Loader" : "Trash2"}
            onClick={() => onConfirm(category.id)}
            disabled={!confirmed || isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("services.management.deleteCategory.title")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
