// src/components/RestoreModal.jsx
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const RestoreModal = ({ onClose, onConfirm, isRestoring, restoreProgress, restoreError, restoreSuccess }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".json")) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5 mx-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="RotateCcw" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{t("backup.warning.restore_btn")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("backup.restoreModal.description")}
            </p>
          </div>
        </div>

        {/* Advertencia */}
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 flex gap-2">
          <Icon name="AlertTriangle" size={16} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-xs text-error">
            <strong>{t("backup.restoreModal.attention")}:</strong> {t("backup.restoreModal.warningText")}
          </p>
        </div>

        {/* Si no está restaurando ni fue exitoso, mostrar el selector de archivo */}
        {!isRestoring && !restoreSuccess && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-success bg-success/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            <Icon
              name={selectedFile ? "FileCheck" : "Upload"}
              size={24}
              className={`mx-auto mb-2 ${selectedFile ? "text-success" : "text-muted-foreground"}`}
            />
            {selectedFile ? (
              <>
                <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB — {t("backup.restoreModal.clickToChange")}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {t("backup.restoreModal.dragAndDrop")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t("backup.restoreModal.fileTypeHint")}</p>
              </>
            )}
          </div>
        )}

        {/* Progreso del restore */}
        {isRestoring && restoreProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{restoreProgress.step}</span>
              {restoreProgress.total && (
                <span>
                  {restoreProgress.current}/{restoreProgress.total}
                </span>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${restoreProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {restoreError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <p className="text-xs text-error">{restoreError}</p>
          </div>
        )}

        {/* Éxito */}
        {restoreSuccess && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("backup.restoreModal.restoreCompleted")}</p>
              <p className="text-xs text-muted-foreground">{t("backup.restoreModal.restoreSuccessText")}</p>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={isRestoring}>
            {restoreSuccess ? t("common.close") : t("common.cancel")}
          </Button>
          {!restoreSuccess && (
            <Button
              variant="destructive"
              iconName={isRestoring ? "Loader" : "RotateCcw"}
              onClick={() => selectedFile && onConfirm(selectedFile)}
              disabled={!selectedFile || isRestoring}
            >
              {isRestoring ? t("backup.restoreModal.restoring") : t("backup.restoreModal.confirmRestore")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestoreModal;
