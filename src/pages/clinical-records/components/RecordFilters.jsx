import React from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";

const RecordFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { t } = useTranslation();

  const treatmentTypeOptions = [
    { value: "all", label: "All Treatments" },
    { value: "preventive", label: "Preventive Care" },
    { value: "restorative", label: "Restorative" },
    { value: "endodontic", label: "Endodontic" },
    { value: "periodontic", label: "Periodontic" },
    { value: "orthodontic", label: "Orthodontic" },
    { value: "prosthodontic", label: "Prosthodontic" },
    { value: "oral-surgery", label: "Oral Surgery" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "planned", label: "Planned" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const providerOptions = [
    { value: "all", label: "All Providers" },
    { value: "dr-johnson", label: "Dr. Sarah Johnson" },
    { value: "dr-smith", label: "Dr. Michael Smith" },
    { value: "dr-williams", label: "Dr. Emily Williams" },
    { value: "dr-brown", label: "Dr. David Brown" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-headline font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          {t("records.panelFilter.title")}
        </h3>
        <Button variant="outline" size="sm" onClick={onClearFilters} iconName="RotateCcw" iconPosition="left">
          {t("records.panelFilter.button.resetFilters")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          label={t("records.panelFilter.searchPatientLabel")}
          placeholder={t("records.panelFilter.searchPlaceholder")}
          value={filters?.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e?.target?.value)}
        />

        <Select label={t("records.panelFilter.treatmentTypeLabel")} options={treatmentTypeOptions} value={filters?.treatmentType} onChange={(value) => onFilterChange("treatmentType", value)} />

        <Select label={t("records.panelFilter.treatmentStatusLabel")} options={statusOptions} value={filters?.status} onChange={(value) => onFilterChange("status", value)} />
        <Select label={t("records.panelFilter.providerLabel")} options={providerOptions} value={filters?.provider} onChange={(value) => onFilterChange("provider", value)} />

        <Input type="date" label={t("records.panelFilter.dateFromLabel")} value={filters?.dateFrom} onChange={(e) => onFilterChange("dateFrom", e?.target?.value)} />

        <Input type="date" label={t("records.panelFilter.dateToLabel")} value={filters?.dateTo} onChange={(e) => onFilterChange("dateTo", e?.target?.value)} />
      </div>
    </div>
  );
};

export default RecordFilters;
