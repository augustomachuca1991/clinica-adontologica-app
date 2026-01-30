import React from "react";
import Icon from "@/components/AppIcon";
import { useTranslation } from "react-i18next";

const TimelineView = ({ records }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-success border-success",
      inProgress: "bg-warning border-warning",
      planned: "bg-primary border-primary",
      cancelled: "bg-muted-foreground border-muted-foreground",
    };
    return colors?.[status] || colors?.planned;
  };

  const getStatusColorLabel = (status) => {
    const colors = {
      completed: {
        classColor: "bg-success/10 text-success border-success/20",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      inProgress: {
        classColor: "bg-warning/10 text-warning border-warning/20",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      planned: {
        classColor: "bg-primary/10 text-primary border-primary/20",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
      cancelled: {
        classColor: "bg-muted text-muted-foreground border-border",
        label: t(`records.recordsModal.tabs.clinicalNotes.status.${status}`),
      },
    };
    return colors?.[status] || colors?.planned;
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
    <div className="relative">
      <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-border" />
      <div className="space-y-6 md:space-y-8">
        {records?.map((record, index) => (
          <div key={record?.id} className="relative pl-12 md:pl-16 fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className={`absolute left-2.5 md:left-4 top-2 w-4 h-4 rounded-full border-2 ${getStatusColor(record?.status)}`} />

            <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm hover:shadow-clinical-md transition-all duration-base">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={getTreatmentIcon(record?.treatmentType)} size={20} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-headline font-semibold text-foreground mb-1">{record?.treatmentName}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {record?.date} • {record?.provider}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColorLabel(record?.status).classColor}`}
                >
                  {getStatusColorLabel(record?.status).label}
                </span>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3">{record?.notes}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  <span>
                    {t("tooth")} {record?.toothNumber}
                  </span>
                </div>
                {record?.cost && (
                  <div className="flex items-center gap-1">
                    <Icon name="DollarSign" size={14} />
                    <span>${record?.cost?.toLocaleString()}</span>
                  </div>
                )}
                {record?.attachments && (
                  <div className="flex items-center gap-1">
                    <Icon name="Paperclip" size={14} />
                    <span>{t("records.recordsModal.tabs.clinicalNotes.attachmentsFiles", { count: record?.attachments?.length })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
