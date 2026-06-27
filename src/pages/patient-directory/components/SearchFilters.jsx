import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks";

const STATUS_PILLS = [
  { value: "all", labelKey: "common.status.all" },
  { value: "active", labelKey: "common.status.active" },
  { value: "pending", labelKey: "common.status.pending" },
  { value: "inactive", labelKey: "common.status.inactive" },
];

const SearchFilters = ({ filters, onFilterChange, onReset, onSearch }) => {
  const { t } = useTranslation();
  const { services } = useTreatmentServices();
  const [panelOpen, setPanelOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);

  /* ── opciones de selects ── */
  const appointmentOptions = [
    { value: "all", label: t("common.status.all") },
    { value: "scheduled", label: t("common.status.scheduled") },
    { value: "confirmed", label: t("common.status.confirmed") },
    { value: "completed", label: t("common.status.completed") },
    { value: "in_progress", label: t("common.status.inProgress") },
    { value: "cancelled", label: t("common.status.cancelled") },
    { value: "no_show", label: t("common.status.noShow") },
  ];

  const insuranceOptions = [
    { value: "all", label: t("common.status.all") },
    { value: "osde", label: "OSDE" },
    { value: "swiss_medical", label: "Swiss Medical" },
    { value: "galeno", label: "Galeno" },
    { value: "ioscor", label: "IOSCOR" },
    { value: "ioma", label: "IOMA" },
    { value: "ospe", label: "OSPE" },
    { value: "self_pay", label: "Particular" },
    { value: "other", label: "Otra / Sin especificar" },
  ];

  const treatmentOptions = useMemo(() => {
    const base = [{ value: "all", label: t("common.status.all") }];
    if (services?.length) {
      return [...base, ...services.map((s) => ({ value: s.id, label: s.name }))];
    }
    return base;
  }, [services, t]);

  /* ── chips de filtros activos (turno, obra social, tratamiento) ── */
  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.appointmentStatus !== "all") {
      const opt = appointmentOptions.find((o) => o.value === filters.appointmentStatus);
      chips.push({ key: "appointmentStatus", label: `Turno: ${opt?.label ?? filters.appointmentStatus}` });
    }
    if (filters.insurance !== "all") {
      const opt = insuranceOptions.find((o) => o.value === filters.insurance);
      chips.push({ key: "insurance", label: `Obra social: ${opt?.label ?? filters.insurance}` });
    }
    if (filters.treatment !== "all") {
      const opt = treatmentOptions.find((o) => o.value === filters.treatment);
      chips.push({ key: "treatment", label: `Tratamiento: ${opt?.label ?? filters.treatment}` });
    }
    if (filters.ageFrom) chips.push({ key: "ageFrom", label: `Edad desde: ${filters.ageFrom}` });
    if (filters.ageTo) chips.push({ key: "ageTo", label: `Edad hasta: ${filters.ageTo}` });
    if (filters.tags) chips.push({ key: "tags", label: `Tags: ${filters.tags}` });
    return chips;
  }, [filters, treatmentOptions]);

  const handleReset = () => {
    onReset();
    setAdvOpen(false);
  };

  return (
    <div className="clinical-card p-4 md:p-5 mb-6">
      {/* ── fila 1: search + botones ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon name="Search" size={16} />
          </span>
          <input
            type="search"
            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={t("directory.panelFilter.searchPlaceholder")}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          />
        </div>

        <Button variant="default" iconName="Search" iconPosition="left" onClick={onSearch}>
          {t("directory.panelFilter.applyButton")}
        </Button>

        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="relative inline-flex items-center gap-2 h-10 px-4 text-sm rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors"
        >
          <Icon name="SlidersHorizontal" size={15} />
          {t("directory.panelFilter.title")}
          {activeChips.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center leading-none">
              {activeChips.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          title={t("directory.panelFilter.resetButton")}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          <Icon name="RotateCcw" size={15} />
        </button>
      </div>

      {/* ── fila 2: pills de estado ── */}
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="text-xs text-muted-foreground mr-1">{t("directory.panelFilter.patientStatusLabel")}:</span>
        {STATUS_PILLS.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => onFilterChange("status", pill.value)}
            className={[
              "inline-flex items-center h-8 px-3 rounded-full text-xs font-medium border transition-colors",
              filters.status === pill.value
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-border text-muted-foreground hover:bg-muted",
            ].join(" ")}
          >
            {t(pill.labelKey)}
          </button>
        ))}
      </div>

      {/* ── panel de filtros secundarios ── */}
      {panelOpen && (
        <div className="mt-4 rounded-lg bg-muted/40 border border-border/60 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={t("directory.panelFilter.appointmentStatusLabel")}
              options={appointmentOptions}
              value={filters.appointmentStatus}
              onChange={(v) => onFilterChange("appointmentStatus", v)}
            />
            <Select
              label={t("directory.panelFilter.insuranceProviderLabel")}
              options={insuranceOptions}
              value={filters.insurance}
              onChange={(v) => onFilterChange("insurance", v)}
              searchable
            />
            <Select
              label={t("directory.panelFilter.treatmentHistoryLabel")}
              options={treatmentOptions}
              value={filters.treatment}
              onChange={(v) => onFilterChange("treatment", v)}
            />
          </div>

          {/* ── filtros avanzados ── */}
          <button
            type="button"
            onClick={() => setAdvOpen((v) => !v)}
            className="mt-4 pt-3 border-t border-border/60 w-full flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={advOpen ? "ChevronUp" : "ChevronDown"} size={13} />
            {advOpen ? t("directory.panelFilter.hide") : t("directory.panelFilter.show")}{" "}
            {t("directory.panelFilter.advancedOptionsFilters")}
          </button>

          {advOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <Input
                type="number"
                label={t("directory.panelFilter.ageFromLabel")}
                placeholder={t("directory.panelFilter.ageFromPlaceholder")}
                value={filters.ageFrom}
                onChange={(e) => onFilterChange("ageFrom", e.target.value)}
              />
              <Input
                type="number"
                label={t("directory.panelFilter.ageToLabel")}
                placeholder={t("directory.panelFilter.ageToPlaceholder")}
                value={filters.ageTo}
                onChange={(e) => onFilterChange("ageTo", e.target.value)}
              />
              <Input
                type="text"
                label={t("directory.panelFilter.customTagsLabel")}
                placeholder={t("directory.panelFilter.customTagsPlaceholder")}
                value={filters.tags}
                onChange={(e) => onFilterChange("tags", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* ── chips de filtros activos ── */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">Activos:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs border border-primary/40 bg-primary/10 text-primary"
            >
              {chip.label}
              <button
                type="button"
                onClick={() =>
                  onFilterChange(
                    chip.key,
                    chip.key === "tags" || chip.key === "ageFrom" || chip.key === "ageTo" ? "" : "all"
                  )
                }
                className="hover:opacity-70 transition-opacity"
                aria-label={`Quitar filtro ${chip.label}`}
              >
                <Icon name="X" size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
