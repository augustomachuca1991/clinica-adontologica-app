// src/components/DeleteBackupModal.jsx
import React from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const DeleteBackupModal = ({ backup, onClose, onConfirm, isDeleting, formatSize }) => {
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
            <h3 className="text-base font-semibold text-foreground">Eliminar registro</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        {/* Info del backup a eliminar */}
        <div className="bg-muted/40 border border-border rounded-lg p-3 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha</span>
            <span className="font-medium text-foreground">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <span className="font-medium text-foreground capitalize">{backup.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tamaño</span>
            <span className="font-medium text-foreground">{formatSize(backup.size_bytes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado</span>
            <span className={`font-medium capitalize ${backup.status === "completed" ? "text-success" : "text-error"}`}>
              {backup.status === "completed" ? "Completado" : "Fallido"}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Solo se elimina el <strong className="text-foreground">registro</strong> del historial. El archivo `.json`
          descargado no se ve afectado.
        </p>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            iconName={isDeleting ? "Loader" : "Trash2"}
            onClick={() => onConfirm(backup.id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBackupModal;
