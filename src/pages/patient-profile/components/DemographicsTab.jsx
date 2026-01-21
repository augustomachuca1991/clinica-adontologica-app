import React from "react";
import Icon from "../../../components/AppIcon";
import { useTranslation } from "react-i18next";

const DemographicsTab = ({ patient }) => {
  const { t, i18n } = useTranslation();

  const demographicSections = [
    {
      title: t("profile.tabs.demographics.section.title"),
      icon: "User",
      fields: [
        { label: t("profile.tabs.demographics.section.fullName"), value: patient?.name },
        { label: t("profile.tabs.demographics.section.dateOfBirth"), value: new Date(patient.dateOfBirth)?.toLocaleDateString(i18n.language, { year: "numeric", month: "long", day: "numeric" }) },
        { label: t("profile.tabs.demographics.section.gender"), value: patient?.gender },
        { label: t("profile.tabs.demographics.section.bloodType"), value: patient?.bloodType || t("profile.notSpecified") },
        { label: t("profile.tabs.demographics.section.maritalStatus"), value: patient?.maritalStatus || t("profile.notSpecified") },
      ],
    },
    {
      title: t("profile.tabs.demographics.section.contactInformation"),
      icon: "Phone",
      fields: [
        { label: t("profile.tabs.demographics.section.primaryPhone"), value: patient?.phone },
        { label: t("profile.tabs.demographics.section.emailAddress"), value: patient?.email },
        { label: t("profile.tabs.demographics.section.address"), value: patient?.address },
        { label: t("profile.tabs.demographics.section.city"), value: patient?.city },
        { label: t("profile.tabs.demographics.section.state"), value: patient?.state },
        { label: t("profile.tabs.demographics.section.zipCode"), value: patient?.zipCode },
      ],
    },
    {
      title: t("profile.tabs.demographics.section.emergencyContact"),
      icon: "AlertCircle",
      fields: [
        { label: t("profile.tabs.demographics.section.contactName"), value: patient?.emergencyContact?.name || t("profile.notSpecified") },
        { label: t("profile.tabs.demographics.section.relationship"), value: patient?.emergencyContact?.relationship || t("profile.notSpecified") },
        { label: t("profile.tabs.demographics.section.contactPhone"), value: patient?.emergencyContact?.phone || t("profile.notSpecified") },
        { label: "Email", value: patient?.emergencyContact?.email || t("profile.notSpecified") },
      ],
    },
    /* {
      title: "Insurance Information",
      icon: "Shield",
      fields: [
        { label: "Insurance Provider", value: patient?.insurance },
        { label: "Policy Number", value: patient?.insurancePolicy },
        { label: "Group Number", value: patient?.insuranceGroup || "Not specified" },
        { label: "Coverage Type", value: patient?.coverageType || "Full Coverage" },
      ],
    }, */
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {demographicSections?.map((section, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-4 md:p-6 clinical-card">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={section?.icon} size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg md:text-xl font-headline font-semibold text-foreground">{section?.title}</h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            {section?.fields?.map((field, fieldIndex) => (
              <div key={fieldIndex} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 pb-3 border-b border-border last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{field?.label}</span>
                <span className="text-sm md:text-base font-medium text-foreground break-words">{field?.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DemographicsTab;
