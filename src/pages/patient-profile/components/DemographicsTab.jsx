import React from "react";
import Icon from "../../../components/AppIcon";

const DemographicsTab = ({ patient }) => {
  const demographicSections = [
    {
      title: "Personal Information",
      icon: "User",
      fields: [
        { label: "Full Name", value: patient?.name },
        { label: "Date of Birth", value: new Date(patient.dateOfBirth)?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
        { label: "Gender", value: patient?.gender },
        { label: "Blood Type", value: patient?.bloodType || "Not specified" },
        { label: "Marital Status", value: patient?.maritalStatus || "Not specified" },
      ],
    },
    {
      title: "Contact Information",
      icon: "Phone",
      fields: [
        { label: "Primary Phone", value: patient?.phone },
        { label: "Email Address", value: patient?.email },
        { label: "Address", value: patient?.address },
        { label: "City", value: patient?.city },
        { label: "State", value: patient?.state },
        { label: "ZIP Code", value: patient?.zipCode },
      ],
    },
    {
      title: "Emergency Contact",
      icon: "AlertCircle",
      fields: [
        { label: "Contact Name", value: patient?.emergencyContact?.name },
        { label: "Relationship", value: patient?.emergencyContact?.relationship },
        { label: "Phone Number", value: patient?.emergencyContact?.phone },
        { label: "Email", value: patient?.emergencyContact?.email || "Not provided" },
      ],
    },
    {
      title: "Insurance Information",
      icon: "Shield",
      fields: [
        { label: "Insurance Provider", value: patient?.insurance },
        { label: "Policy Number", value: patient?.insurancePolicy },
        { label: "Group Number", value: patient?.insuranceGroup || "Not specified" },
        { label: "Coverage Type", value: patient?.coverageType || "Full Coverage" },
      ],
    },
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
