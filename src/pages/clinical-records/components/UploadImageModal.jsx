import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { notifyError, notifySuccess } from "@/utils/notifications";
import { uploadFileToStorage } from "@/utils/helpers/attachments";

const UploadImageModal = ({ isOpen, onClose, onUploadSuccess, recordId }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const publicUrl = await uploadFileToStorage(file);

      const newAttachment = {
        url: publicUrl,
        alt: file.name,
        uploadedAt: new Date().toISOString(),
      };

      // 4. Se lo pasamos al padre
      await onUploadSuccess(newAttachment);
      onClose();
      setFile(null);
      setPreview(null);
    } catch (error) {
      notifyError("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-clinical-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("records.recordsModal.tabs.images.button.uploadImage")}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <Icon name="UploadCloud" size={40} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{t("records.recordsModal.tabs.images.dropzone")}</p>
              </>
            )}
            <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button variant="default" className="flex-1" disabled={!file || uploading} onClick={handleUpload}>
              {uploading ? "..." : t("save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
