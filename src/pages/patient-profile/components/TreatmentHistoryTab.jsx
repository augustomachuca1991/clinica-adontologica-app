import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import { useTranslation } from "react-i18next";

const TreatmentHistoryTab = ({ treatments, loading }) => {
  const { t, i18n } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-warning/10 text-warning";
      case "Scheduled":
        return "bg-primary/10 text-primary";
      case "Cancelled":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative pl-6 md:pl-8">
        {treatments?.map((treatment, index) => (
          <div key={index} className="timeline-item relative pb-6 md:pb-8 last:pb-0">
            <div className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground mb-2">{treatment?.procedure}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                        <span className={`status-indicator ${getStatusColor(treatment?.status)} text-xs md:text-sm`}>{treatment?.status}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {new Date(treatment.date)?.toLocaleDateString(i18n.language, { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">${treatment?.cost?.toLocaleString()}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{t("profile.tabs.treatmentHistory.section.treatmentCost")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} className="text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("profile.tabs.treatmentHistory.section.dentist")}</p>
                        <p className="text-sm md:text-base font-medium text-foreground truncate">{treatment?.dentist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("profile.tabs.treatmentHistory.section.location")}</p>
                        <p className="text-sm md:text-base font-medium text-foreground truncate">{treatment?.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} className="text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("profile.tabs.treatmentHistory.section.duration")}</p>
                        <p className="text-sm md:text-base font-medium text-foreground">{treatment?.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="FileText" size={16} className="text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{t("profile.tabs.treatmentHistory.section.toothNumber")}</p>
                        <p className="text-sm md:text-base font-medium text-foreground">{treatment?.toothNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 md:p-4 mb-4">
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">{t("profile.tabs.treatmentHistory.section.treatmentNotes")}</p>
                    <p className="text-sm md:text-base text-foreground">{treatment?.notes}</p>
                  </div>

                  {treatment?.followUp && (
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <Icon name="Calendar" size={16} className="text-primary flex-shrink-0" />
                      <p className="text-xs md:text-sm text-foreground">
                        {t("profile.tabs.treatmentHistory.section.followUpScheduled")}:{" "}
                        {new Date(treatment.followUp)?.toLocaleDateString(i18n.language, { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  )}
                </div>

                {treatment?.images && treatment?.images?.length > 0 && (
                  <div className="w-full lg:w-64 flex-shrink-0">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mb-3">{t("profile.tabs.treatmentHistory.section.clinicalPhotography")}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                      {treatment?.images?.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
                          <Image src={img?.url} alt={img?.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-base cursor-pointer" />
                        </div>
                      ))}
                    </div>
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

export default TreatmentHistoryTab;
