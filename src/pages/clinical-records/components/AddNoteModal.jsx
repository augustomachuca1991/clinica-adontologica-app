import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

const AddNoteModal = ({ record, onClose, onSave }) => {
  const [noteData, setNoteData] = useState({
    noteType: "progress",
    content: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const { t } = useTranslation();

  const handleSave = async () => {
    if (noteData?.content?.trim()) {
      setIsSaving(true);
      await onSave(noteData.content, noteData.noteType);
      setIsSaving(false);
    }
  };

  /* const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    setNoteData((prev) => ({
      ...prev,
      attachments: [...prev?.attachments, ...files?.map((f) => f?.name)],
    }));
  }; */

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">{t("records.recordsModal.tabs.clinicalNotes.addClinicalNote")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {record?.patientName} • {record?.treatmentName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" aria-label="Close modal" />
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("records.recordsModal.tabs.clinicalNotes.noteType")}</label>
              <div className="space-y-2">
                {[
                  { key: "progress", label: t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.progress`), icon: "Activity" },
                  { key: "treatment", label: t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.treatment`), icon: "Stethoscope" },
                  { key: "observation", label: t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.observation`), icon: "Eye" },
                  { key: "followUp", label: t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.followUp`), icon: "CalendarDays" },
                ]?.map(({ key, label, icon }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="noteType"
                      value={key}
                      checked={noteData?.noteType === key}
                      onChange={(e) => setNoteData((prev) => ({ ...prev, noteType: e?.target?.value }))}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">{label}</span>
                    <Icon name={icon} size={16} />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t("records.recordsModal.tabs.clinicalNotes.quickTemplates")}</label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() =>
                    setNoteData((prev) => ({
                      ...prev,
                      content: t("records.recordsModal.tabs.clinicalNotes.postProcedureQuick"),
                    }))
                  }
                >
                  {t("records.recordsModal.tabs.clinicalNotes.postProcedure")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() =>
                    setNoteData((prev) => ({
                      ...prev,
                      content: t("records.recordsModal.tabs.clinicalNotes.followUpQuick"),
                    }))
                  }
                >
                  {t("records.recordsModal.tabs.clinicalNotes.followUp")}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("records.recordsModal.tabs.clinicalNotes.name")}</label>
            <textarea
              value={noteData?.content}
              onChange={(e) => setNoteData((prev) => ({ ...prev, content: e?.target?.value }))}
              placeholder={t("records.recordsModal.tabs.clinicalNotes.placeholder")}
              rows={8}
              className="w-full px-4 py-3 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-base resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">{t("records.recordsModal.tabs.clinicalNotes.characters", { count: noteData?.content?.length || 0 })}</p>
          </div>

          {/*   <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t("records.recordsModal.tabs.clinicalNotes.attachments")}</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-base">
              <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-foreground mb-1">{t("records.recordsModal.tabs.clinicalNotes.dragAndDrop")}</p>
                <p className="text-xs text-muted-foreground">{t("records.recordsModal.tabs.clinicalNotes.typeFile")}</p>
              </label>
            </div>
            {noteData?.attachments?.length > 0 && (
              <div className="mt-3 space-y-2">
                {noteData?.attachments?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setNoteData((prev) => ({
                          ...prev,
                          attachments: prev?.attachments?.filter((_, i) => i !== index),
                        }))
                      }
                      iconName="X"
                      aria-label="Remove file"
                    />
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("records.recordsModal.tabs.clinicalNotes.button.cancel")}
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={!noteData.content.trim() || isSaving}
            iconName={isSaving ? "Loader2" : "Save"}
            iconPosition="left"
            className={isSaving ? "animate-pulse" : ""}
          >
            {isSaving ? t("saving") : t("records.recordsModal.tabs.clinicalNotes.button.saveNote")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
