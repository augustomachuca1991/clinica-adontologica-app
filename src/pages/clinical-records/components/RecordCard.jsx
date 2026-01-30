import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import ImageLightbox from "@/components/ui/ImageLightBox";

const RecordCard = ({ record, onViewDetails, onAddNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const colors = {
      completed: {
        classColor: "bg-success/10 text-success border-success",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      inProgress: {
        classColor: "bg-warning/10 text-warning border-warning",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      planned: {
        classColor: "bg-primary/10 text-primary border-primary",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      cancelled: {
        classColor: `bg-muted text-muted-foreground border-border`,
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
    };
    return colors?.[status] || colors?.planned;
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % record.attachments.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) =>
        (prev - 1 + record.attachments.length) % record.attachments.length
    );
  };

  const getTreatmentIcon = (type) => {
    const icons = {
      preventive: "Shield",
      restorative: "Wrench",
      endodontic: "Activity",
      periodontic: "Heart",
      orthodontic: "Smile",
      prosthodontic: "Crown",
      "oral-surgery": "Scissors",
    };
    return icons?.[type] || "FileText";
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical-sm hover:shadow-clinical-md transition-all duration-base overflow-hidden h-fit">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon
                name={getTreatmentIcon(record?.treatmentType)}
                size={20}
                color="var(--color-primary)"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-headline font-semibold text-foreground mb-1 truncate">
                {record?.treatmentName}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                {t("records.card.patient")}: {record?.patientName} •{" "}
                {t("records.card.idPatient")}: {record?.patientId}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border uppercase ${getStatusColor(record?.status).classColor}`}
                >
                  <Icon name="Circle" size={8} className="fill-current" />
                  {getStatusColor(record?.status).label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {record?.date}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            className="border"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="User" size={16} />
            <span>
              {t("records.card.provider")}: {record?.provider}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span>
              {t("records.card.tooth")}: {record?.toothNumber}
            </span>
          </div>
          {record?.cost && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Icon name="DollarSign" size={16} />
              <span>
                {t("records.card.cost")}: ${record?.cost?.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4 fade-in-up">
            <div>
              <h5 className="text-xs md:text-sm font-medium text-foreground mb-2">
                {t("records.card.treatmentNotes")}
              </h5>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {record?.clinical_notes?.length > 0
                  ? record.clinical_notes[0].content
                  : t("records.recordsModal.tabs.clinicalNotes.noNotes")}
              </p>
            </div>

            {record?.attachments && record?.attachments?.length > 0 && (
              <div>
                <h5 className="text-xs md:text-sm font-medium text-foreground mb-3">
                  {t("records.card.clinicalImages")}
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {record?.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-lg border border-border"
                    >
                      <div className="aspect-[4/3]">
                        <Image
                          src={attachment?.url}
                          alt={attachment?.alt}
                          className="w-full h-full object-cover transition-transform duration-base group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-base flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          iconName="Eye"
                          iconPosition="left"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          {t("records.card.button.view")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record?.followUp && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Icon
                    name="Calendar"
                    size={16}
                    color="var(--color-warning)"
                    className="flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-warning mb-1">
                      {t("records.card.followUp")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {
                        record?.clinical_notes?.find(
                          (n) => n.type === "followUp"
                        )?.content
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(record)}
            iconName="Eye"
            iconPosition="left"
          >
            {t("records.card.button.viewDetails")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddNote(record)}
            iconName="Plus"
            iconPosition="left"
          >
            {t("records.card.button.addNote")}
          </Button>
        </div>
      </div>
      <ImageLightbox
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        images={record.attachments}
        currentIndex={selectedImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default RecordCard;
