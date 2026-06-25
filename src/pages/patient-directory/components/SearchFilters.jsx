import React, { useMemo } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks";

const SearchFilters = ({ filters, onFilterChange, onReset, onSearch }) => {
  const { t } = useTranslation();
  const { services, loading: loadingServices } = useTreatmentServices();
  const statusOptions = [
    {
      value: "all",
      label: t("common.status.all"),
    },
    {
      value: "active",
      label: t("common.status.active"),
    },
    {
      value: "pending",
      label: t("common.status.pending"),
    },
    {
      value: "inactive",
      label: t("common.status.inactive"),
    },
  ];

  const appointmentOptions = [
    { value: "all", label: t("common.status.all") },
    { value: "scheduled", label: t("common.status.scheduled") },
    { value: "confirmed", label: t("common.status.confirmed") },
    { value: "completed", label: t("common.status.completed") },
    { value: "in-progress", label: t("common.status.inProgress") },
    { value: "cancelled", label: t("common.status.cancelled") },
    { value: "no-show", label: t("common.status.noShow") },
  ];

  const insuranceOptions = [
    { value: "all", label: t("common.status.all") },
    { value: "osde", label: "OSDE" },
    { value: "swiss_medical", label: "Swiss Medical" },
    { value: "galeno", label: "Galeno" },
    { value: "ioscor", label: "IOSCOR" },
    { value: "ioma", label: "IOMA" },
    { value: "ospe", label: "OSPE" },
    { value: "self_pay", label: "Particular (Self-pay)" },
    { value: "other", label: "Otra / Sin especificar" },
  ];

  const treatmentOptions = useMemo(() => {
    const options = [{ value: "all", label: t("common.status.all") }];
    if (services && services.length > 0) {
      const dbOptions = services.map((service) => ({
        value: service.id,
        label: service.name,
      }));
      return [...options, ...dbOptions];
    }

    return options;
  }, [services, t]);

  return (
    <div className="clinical-card p-4 md:p-5 lg:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
          {t("directory.panelFilter.title")}
        </h2>
        <Button variant="outline" size="sm" onClick={onReset} iconName="RotateCcw" iconPosition="left">
          {t("directory.panelFilter.resetButton")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Input
          label={t("directory.panelFilter.searchPatientLabel")}
          type="search"
          placeholder={t("directory.panelFilter.searchPlaceholder")}
          value={filters?.searchQuery}
          onChange={(e) => onFilterChange("searchQuery", e?.target?.value)}
          className="col-span-1 md:col-span-2 lg:col-span-3"
        />

        <Select
          label={t("directory.panelFilter.patientStatusLabel")}
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
        />

        <Select
          label={t("directory.panelFilter.appointmentStatusLabel")}
          options={appointmentOptions}
          value={filters?.appointmentStatus}
          onChange={(value) => onFilterChange("appointmentStatus", value)}
        />

        <Select
          label={t("directory.panelFilter.insuranceProviderLabel")}
          options={insuranceOptions}
          value={filters?.insurance}
          onChange={(value) => onFilterChange("insurance", value)}
          searchable
        />

        <Select
          label={t("directory.panelFilter.treatmentHistoryLabel")}
          options={treatmentOptions}
          value={filters?.treatment}
          onChange={(value) => onFilterChange("treatment", value)}
        />
        {/* <div className="flex items-end">
          <Input
            type="date"
            label={t("directory.panelFilter.lastVisitFromLabel")}
            value={filters?.lastVisitFrom}
            onChange={(e) => onFilterChange("lastVisitFrom", e?.target?.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-end">
          <Input
            type="date"
            label={t("directory.panelFilter.lastVisitToLabel")}
            value={filters?.lastVisitTo}
            onChange={(e) => onFilterChange("lastVisitTo", e?.target?.value)}
            className="w-full"
          />
        </div> */}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="default" onClick={onSearch} iconName="Search" iconPosition="left" className="sm:w-auto">
          {t("directory.panelFilter.applyButton")}
        </Button>
        <Button
          variant="outline"
          onClick={() => onFilterChange("showAdvanced", !filters?.showAdvanced)}
          iconName={filters?.showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="sm:w-auto"
        >
          {filters?.showAdvanced ? t("directory.panelFilter.hide") : t("directory.panelFilter.show")}{" "}
          {t("directory.panelFilter.advancedOptionsFilters")}
        </Button>
      </div>
      {filters?.showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              type="number"
              label={t("directory.panelFilter.ageFromLabel")}
              placeholder={t("directory.panelFilter.ageFromPlaceholder")}
              value={filters?.ageFrom}
              onChange={(e) => onFilterChange("ageFrom", e?.target?.value)}
            />
            <Input
              type="number"
              label={t("directory.panelFilter.ageToLabel")}
              placeholder={t("directory.panelFilter.ageToPlaceholder")}
              value={filters?.ageTo}
              onChange={(e) => onFilterChange("ageTo", e?.target?.value)}
            />
            <Input
              type="text"
              label={t("directory.panelFilter.customTagsLabel")}
              placeholder={t("directory.panelFilter.customTagsPlaceholder")}
              value={filters?.tags}
              onChange={(e) => onFilterChange("tags", e?.target?.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
