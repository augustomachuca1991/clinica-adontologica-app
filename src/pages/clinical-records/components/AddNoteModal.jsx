import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

import Button from "../../../components/ui/Button";

const AddNoteModal = ({ record, onClose, onSave }) => {
  const [noteData, setNoteData] = useState({
    noteType: "progress",
    content: "",
    attachments: [],
  });

  const handleSave = () => {
    if (noteData?.content?.trim()) {
      onSave({
        ...noteData,
        recordId: record?.id,
        timestamp: new Date()?.toISOString(),
        author: "Dr. Sarah Johnson",
      });
      onClose();
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e?.target?.files);
    setNoteData((prev) => ({
      ...prev,
      attachments: [...prev?.attachments, ...files?.map((f) => f?.name)],
    }));
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">Add Clinical Note</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {record?.patientName} • {record?.treatmentName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" aria-label="Close modal" />
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Note Type</label>
              <div className="space-y-2">
                {["progress", "treatment", "observation", "follow-up"]?.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="noteType"
                      value={type}
                      checked={noteData?.noteType === type}
                      onChange={(e) => setNoteData((prev) => ({ ...prev, noteType: e?.target?.value }))}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-ring"
                    />
                    <span className="text-sm text-foreground capitalize">{type?.replace("-", " ")}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quick Templates</label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() =>
                    setNoteData((prev) => ({
                      ...prev,
                      content: "Patient tolerated procedure well. No complications noted. Post-operative instructions provided.",
                    }))
                  }
                >
                  Post-Procedure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() =>
                    setNoteData((prev) => ({
                      ...prev,
                      content: "Follow-up examination completed. Healing progressing as expected. Continue current care regimen.",
                    }))
                  }
                >
                  Follow-up
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Clinical Note</label>
            <textarea
              value={noteData?.content}
              onChange={(e) => setNoteData((prev) => ({ ...prev, content: e?.target?.value }))}
              placeholder="Enter detailed clinical observations, treatment progress, or patient feedback..."
              rows={8}
              className="w-full px-4 py-3 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-base resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">{noteData?.content?.length} characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-base">
              <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Images or PDF files (max 10MB each)</p>
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
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} disabled={!noteData?.content?.trim()} iconName="Save" iconPosition="left">
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
