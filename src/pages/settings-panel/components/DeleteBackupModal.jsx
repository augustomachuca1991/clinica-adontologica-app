// src/components/DeleteBackupModal.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const DeleteBackupModal = ({ backup, onClose, onConfirm, isDeleting, formatSize }) => {
  const { t } = useTranslation();
  if (!backup) return null;

  const date = new Date(backup.created_at).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 mx-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Trash2" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{t("backup.deleteModal.title")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t("backup.deleteModal.subtitle")}</p>
          </div>
        </div>

        {/* Info del backup a eliminar */}
        <div className="bg-muted/40 border border-border rounded-lg p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("backup.history.th_date_time")}</span>
            <span className="font-medium text-foreground">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("backup.history.th_type")}</span>
            <span className="font-medium text-foreground capitalize">{backup.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("backup.history.th_size")}</span>
            <span className="font-medium text-foreground">{formatSize(backup.size_bytes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("backup.history.th_status")}</span>
            <span className={`font-medium capitalize ${backup.status === "completed" ? "text-success" : "text-error"}`}>
              {backup.status === "completed" ? t("common.status.completed") : t("common.status.failed")}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {t("backup.deleteModal.body")}
        </p>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            iconName={isDeleting ? "Loader" : "Trash2"}
            onClick={() => onConfirm(backup.id)}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBackupModal;
