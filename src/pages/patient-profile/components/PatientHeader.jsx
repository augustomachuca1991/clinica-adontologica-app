import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

const PatientHeader = ({ patient, onEdit, onSchedule, onMessage }) => {
  const { t } = useTranslation();
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today?.getFullYear() - birthDate?.getFullYear();
    const monthDiff = today?.getMonth() - birthDate?.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today?.getDate() < birthDate?.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-card rounded-lg shadow-clinical-md border border-border p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
            <Image src={patient?.profileImage} alt={patient?.profileImageAlt} className="w-full h-full rounded-lg object-cover border-2 border-primary/20" />
            <div className={`absolute bottom-2 right-2 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-card ${patient?.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-semibold text-foreground truncate">{patient?.name}</h1>
                <span className={`status-indicator ${getStatusColor(patient?.status)} text-xs md:text-sm px-2 md:px-3 py-1 rounded-full flex-shrink-0`}>{patient?.status}</span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                {t("profile.header.patientId")}: {patient?.patientId}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t("profile.header.age")}</p>
                    <p className="text-sm md:text-base font-medium text-foreground truncate">
                      {calculateAge(patient?.dateOfBirth)} {t("profile.header.years")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t("profile.header.gender")}</p>
                    <p className="text-sm md:text-base font-medium text-foreground truncate">{patient?.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t("profile.header.phone")}</p>
                    <p className="text-sm md:text-base font-medium text-foreground truncate">{patient?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{t("profile.header.email")}</p>
                    <p className="text-sm md:text-base font-medium text-foreground truncate">{patient?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button variant="default" size="sm" iconName="Edit" iconPosition="left" onClick={onEdit} className="flex-1 sm:flex-none">
                {t("profile.header.button.editProfile")}
              </Button>
              <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left" onClick={onSchedule} className="flex-1 sm:flex-none">
                {t("profile.header.button.schedule")}
              </Button>
              <Button variant="outline" size="sm" iconName="MessageSquare" iconPosition="left" onClick={onMessage} className="flex-1 sm:flex-none">
                {t("profile.header.button.message")}
              </Button>
            </div>
          </div>

          {/* <div className="flex flex-wrap gap-2 md:gap-3">
            {patient?.allergies && patient?.allergies?.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-error/10 text-error rounded-md text-xs md:text-sm">
                <Icon name="AlertTriangle" size={14} className="flex-shrink-0" />
                <span className="font-medium">Allergies: {patient?.allergies?.join(", ")}</span>
              </div>
            )}
            {patient?.insurance && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs md:text-sm">
                <Icon name="Shield" size={14} className="flex-shrink-0" />
                <span className="font-medium">{patient?.insurance}</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
