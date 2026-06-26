import React, { useMemo } from "react";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useServices } from "@/hooks/ServiceCategoriesHooks";

const RecordFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { t } = useTranslation();
  const { categories } = useServices();

  const treatmentTypeOptions = useMemo(() => {
    const opts = [{ value: "all", label: t("records.panelFilter.treatmentTypeOptions.all") }];
    if (categories?.length) {
      categories.forEach((cat) => {
        opts.push({ value: String(cat.id), label: cat.name });
      });
    }
    return opts;
  }, [categories, t]);

  const statusOptions = [
    { value: "all", label: t("records.panelFilter.treatmentStatusOptions.all") },
    { value: "planned", label: t("records.panelFilter.treatmentStatusOptions.planned") },
    { value: "inProgress", label: t("records.panelFilter.treatmentStatusOptions.inProgress") },
    { value: "completed", label: t("records.panelFilter.treatmentStatusOptions.completed") },
    { value: "cancelled", label: t("records.panelFilter.treatmentStatusOptions.cancelled") },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 shadow-clinical-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-headline font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          {t("records.panelFilter.title")}
        </h3>
        <Button variant="outline" size="sm" onClick={onClearFilters} iconName="RotateCcw" iconPosition="left">
          {t("records.panelFilter.button.resetFilters")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="search"
          label={t("records.panelFilter.searchPatientLabel")}
          placeholder={t("records.panelFilter.searchPlaceholder")}
          value={filters?.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e?.target?.value)}
        />

        <Select
          label={t("records.panelFilter.treatmentTypeLabel")}
          options={treatmentTypeOptions}
          value={filters?.treatmentType}
          onChange={(value) => onFilterChange("treatmentType", value)}
        />

        <Select
          label={t("records.panelFilter.treatmentStatusLabel")}
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
        />

        <Input
          type="date"
          label={t("records.panelFilter.dateFromLabel")}
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e?.target?.value)}
        />

        <Input
          type="date"
          label={t("records.panelFilter.dateToLabel")}
          value={filters?.dateTo}
          onChange={(e) => onFilterChange("dateTo", e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default RecordFilters;
