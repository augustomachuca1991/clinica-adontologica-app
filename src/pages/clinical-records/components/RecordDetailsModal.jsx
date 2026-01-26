import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import PrintableMedicalRecord from "./PrintableMedicalRecord";
import { notifySuccess, notifyError, notifyConfirm } from "../../../utils/notifications";
import ImageLightbox from "../../../components/ui/ImageLightBox";
import { formatDateLang } from "../../../utils/formatters/date";
import { downloadImage } from "../../../utils/downloaderHelper";
import { saveAttachmentToDB, uploadFileToStorage, removeAttachmentFromDB } from "../../../utils/helpers/attachments";
import { useClinicalRecords } from "../../../hooks/ClinicalRecorsHooks";

const RecordDetailsModal = ({ record, onClose, onAddNote }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentAttachments, setCurrentAttachments] = useState(record?.attachments || []);
  const [isUploading, setIsUploading] = useState(false);

  const contentRef = useRef(null);
  const fileInputRef = useRef(null); // Nueva referencia para el input oculto

  const { fetchPatientRecords, records: history, loading: isLoadingHistory } = useClinicalRecords();
  /* const { addNote, loading: isSavingNote } = useClinicalNotes(); */
  const { t, i18n } = useTranslation();

  const currentRecordData = history?.find((r) => r.id === record.id) || record;

  useEffect(() => {
    if (record?.patient_id) {
      fetchPatientRecords(record.patient_id);
    }
  }, [record, fetchPatientRecords]);

  const tabs = [
    { id: "overview", label: "overview", icon: "FileText" },
    { id: "notes", label: "clinicalNotes", icon: "MessageSquare" },
    { id: "images", label: "images", icon: "Image" },
    { id: "history", label: "history", icon: "Clock" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-success/10 text-success border-success",
      inProgress: "bg-warning/10 text-warning border-warning",
      planned: "bg-primary/10 text-primary border-primary",
      cancelled: "bg-muted text-muted-foreground border-border",
    };
    return colors?.[status] || colors?.planned;
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Ficha_${record?.patientName?.replace(/\s+/g, "_")}_${record?.date}`,
    onAfterPrint: () => notifySuccess(t("messageSuccess")),
  });

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % currentAttachments.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + currentAttachments.length) % currentAttachments.length);
  };

  const handleDirectUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadFileToStorage(file);
      const newAttachment = {
        url: publicUrl,
        alt: file.name,
      };
      await saveAttachmentToDB(record.id, currentAttachments, newAttachment);
      const updatedAttachments = [...currentAttachments, newAttachment];
      setCurrentAttachments(updatedAttachments);
      notifySuccess(t("records.recordsModal.tabs.images.uploadSuccess"));
    } catch (error) {
      notifyError("Error: " + error.message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (indexToDelete) => {
    notifyConfirm(t("confirmDeleteImage.title"), t("confirmDeleteImage.description"), async () => {
      const updatedAttachments = currentAttachments.filter((_, index) => index !== indexToDelete);

      try {
        await removeAttachmentFromDB(record.id, updatedAttachments);
        setCurrentAttachments(updatedAttachments);
        notifySuccess(t("delete"));
      } catch (error) {
        notifyError("error" + error.message);
      }
    });
  };

  /* const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    const result = await addNote(record.id, newNote, noteType);

    if (result.success) {
      setNewNote(""); // Limpiamos el textarea
      notifySuccess(t("records.notes.saveSuccess") || "Nota agregada");
      fetchPatientRecords(record.patient_id);
    } else {
      notifyError(result.error);
    }
  }; */

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">{record?.treatmentName}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {record?.patientName} • ID: {record?.patientId}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} iconName="X" aria-label="Close modal" />
        </div>

        <div className="border-b border-border overflow-x-auto flex-shrink-0">
          <div className="flex gap-1 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-base whitespace-nowrap ${
                  activeTab === tab?.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{t(`records.recordsModal.tabs.${tab?.label}.name`)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mt-2 uppercase ${getStatusColor(record?.status)}`}>
                      <Icon name="Circle" size={8} className="fill-current" />
                      {t(`records.recordsModal.tabs.overview.status.${currentRecordData?.status}`)}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.recordsModal.tabs.overview.treatmentDate")}</label>
                    <p className="text-sm text-foreground mt-1">{formatDateLang(record?.date, i18n.language)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.card.provider")}</label>
                    <p className="text-sm text-foreground mt-1">{currentRecordData?.provider?.name || currentRecordData?.provider}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.recordsModal.tabs.overview.toothNumber")}</label>
                    <p className="text-sm text-foreground mt-1">{`# ${currentRecordData?.toothNumber}`}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.recordsModal.tabs.overview.treatmentType")}</label>
                    <p className="text-sm text-foreground mt-1 capitalize">{currentRecordData?.treatmentName || t("common.notAvailable")}</p>
                  </div>
                  {currentRecordData?.cost && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.card.cost")}</label>
                      <p className="text-sm text-foreground mt-1">${currentRecordData?.cost?.toLocaleString()}</p>
                    </div>
                  )}
                  {currentRecordData?.duration && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("records.recordsModal.tabs.overview.duration")}</label>
                      <p className="text-sm text-foreground mt-1">{currentRecordData?.duration} min</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">{t("records.card.treatmentNotes")}</label>
                <div className="bg-muted border border-border rounded-lg p-4">
                  {currentRecordData?.clinical_notes?.length > 0 ? (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {/* Mostramos la nota más reciente que es la [0] por el orden del hook */}
                      {currentRecordData.clinical_notes[0].content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">{t("records.recordsModal.tabs.clinicalNotes.noNotes")}</p>
                  )}
                </div>
              </div>

              {currentRecordData?.clinical_notes?.find((n) => n.type === "followUp") && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Calendar" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-warning mb-1">{t("records.card.followUp")}</h4>
                      <p className="text-sm text-foreground">{currentRecordData.clinical_notes.find((n) => n.type === "followUp").content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-headline font-semibold text-foreground">{t("records.recordsModal.tabs.clinicalNotes.name")}</h4>
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                  {t("records.recordsModal.tabs.clinicalNotes.addClinicalNote")}
                </Button>
              </div>
              {currentRecordData?.clinical_notes?.length > 0 ? (
                currentRecordData.clinical_notes.map((note) => (
                  <div key={note} className="bg-muted border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon name="User" size={18} color="var(--color-primary)" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{note?.provider?.user_profiles?.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.created_at).toLocaleDateString(i18n.language, {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 bg-primary/10 text-primary rounded-full ${
                          note.type === "followUp"
                            ? "border-purple-200 bg-purple-100 text-gray-700"
                            : note.type === "treatment"
                              ? "border-green-200 bg-green-100 text-gray-700"
                              : note.type === "observation"
                                ? "border-amber-200 bg-amber-100 text-gray-700"
                                : "border-blue-200 bg-blue-100 text-gray-700"
                        } `}
                      >
                        {t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.${note?.type}`)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{note?.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-muted/20 border-2 border-dashed border-border rounded-lg">
                  <Icon name="Clipboard" size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground italic">{t("records.recordsModal.tabs.clinicalNotes.noNotes") || "No notes recorded for this procedure."}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "images" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-headline font-semibold text-foreground">{t("records.recordsModal.tabs.images.clinicalImages")}</h4>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleDirectUpload} />
                <Button variant="outline" size="sm" iconName={isUploading ? "Loader2" : "Upload"} iconPosition="left" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
                  {isUploading ? t("records.recordsModal.tabs.images.button.uploading") : t("records.recordsModal.tabs.images.button.uploadImage")}
                </Button>
              </div>
              {currentAttachments && currentAttachments.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentAttachments?.map((attachment, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-lg border border-border" onClick={() => setSelectedImageIndex(index)}>
                      <div className="aspect-[4/3]">
                        <Image src={attachment?.url} alt={attachment?.alt} className="w-full h-full object-cover transition-transform duration-base group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-base flex items-center justify-center gap-2">
                        <div className="absolute top-2 right-2 flex gap-2">
                          {/* Botón Descargar */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Importante: evita que se abra el visor
                              downloadImage(attachment.url, `dental_${record?.patientName?.replace(/\s+/g, "_")}_${index + 1}.jpg`);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded backdrop-blur-sm transition-colors"
                            title={t("download")}
                          >
                            <Icon name="Download" size={16} />
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Importante: evita que se abra el visor
                              handleDeleteImage(index);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded backdrop-blur-sm transition-colors"
                            title={t("delete")}
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">#{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 hover:bg-muted cursor-pointer rounded-lg border-border border-2 border-dashed" onClick={() => fileInputRef.current.click()}>
                  <Icon name="ImageUp" size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("records.recordsModal.tabs.images.noImages")}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h4 className="text-base font-headline font-semibold text-foreground mb-4">{t("records.recordsModal.tabs.history.treatmentHistory")}</h4>

              {isLoadingHistory ? (
                <div className="flex justify-center py-10">
                  <Icon name="Loader2" className="animate-spin text-primary" size={32} />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  {history?.length > 0 ? (
                    history.map((item) => (
                      <div key={item.id} className="relative pl-12 pb-6">
                        <div className={`absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-card ${item.id === record.id ? "bg-primary scale-125" : "bg-muted-foreground/40"}`} />
                        <div className="bg-muted border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-foreground">{item.treatmentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {t("records.recordsModal.tabs.history.statusUpdated")} {formatDateLang(item?.date, i18n.language)}
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">{t("records.recordsModal.tabs.history.activity.actionLabel") || "El estado cambió a"}</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${getStatusColor(item.status)}`}>
                            &nbsp;{t(`records.recordsModal.tabs.history.activity.status.${item?.status}`).toUpperCase()}&nbsp;
                          </span>
                          <span className="text-sm text-muted-foreground">{t("records.recordsModal.tabs.history.activity.by") || "por"}</span> {/* Nombre del doctor resaltado */}
                          <span className="text-sm text-foreground font-medium">{item?.provider?.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-12 py-4 text-sm text-muted-foreground italic">{t("records.recordsModal.tabs.history.noHistory")}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="outline" iconName="Download" iconPosition="left" onClick={handlePrint}>
            {t("records.recordsModal.button.exportPDF")}
          </Button>
          <Button variant="outline" iconName="Printer" iconPosition="left" onClick={handlePrint}>
            {t("records.recordsModal.button.print")}
          </Button>
          <Button variant="default" onClick={onClose}>
            {t("records.recordsModal.button.close")}
          </Button>
        </div>
      </div>
      <ImageLightbox
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        images={currentAttachments} // CORREGIDO: Usar currentAttachments
        currentIndex={selectedImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
      <div className="hidden">
        <PrintableMedicalRecord ref={contentRef} record={currentRecordData} treatmentHistory={history} />
      </div>
    </div>
  );
};

export default RecordDetailsModal;
