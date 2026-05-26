import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Modal from "@/pages/clinical-notes/components/Modal";

const ConfirmDeleteModal = React.memo(({ open, onClose, onConfirm, isSubmitting }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t("clinicalNotes.modals.delete.title")} maxWidth="max-w-sm">
      <div className="space-y-4">
        {/* Alerta de peligro */}
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Icon name="AlertCircle" size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{t("clinicalNotes.modals.delete.warning")}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50"
          >
            {t("clinicalNotes.modals.delete.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Icon name="Trash2" size={14} />
            )}
            {t("clinicalNotes.modals.delete.confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
});

// Le asignamos el displayName explícito útil para DevTools por usar React.memo
ConfirmDeleteModal.displayName = "ConfirmDeleteModal";

export default ConfirmDeleteModal;
