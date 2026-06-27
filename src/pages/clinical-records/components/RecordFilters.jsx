import React, { useMemo, useState } from "react";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useServices } from "@/hooks/ServiceCategoriesHooks";

const DATE_SHORTCUTS = [
  {
    label: "Hoy",
    getDates: () => {
      const d = today();
      return { from: d, to: d };
    },
  },
  {
    label: "Esta semana",
    getDates: () => {
      const now = new Date();
      const mon = new Date(now);
      mon.setDate(now.getDate() - now.getDay() + 1);
      return { from: fmt(mon), to: today() };
    },
  },
  {
    label: "Este mes",
    getDates: () => {
      const now = new Date();
      return { from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), to: today() };
    },
  },
  {
    label: "Últimos 3 meses",
    getDates: () => {
      const now = new Date();
      const from = new Date(now);
      from.setMonth(now.getMonth() - 3);
      return { from: fmt(from), to: today() };
    },
  },
];

const today = () => fmt(new Date());
const fmt = (d) => d.toISOString().split("T")[0];

const RecordFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { t } = useTranslation();
  const { categories } = useServices();
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeShortcut, setActiveShortcut] = useState(null);

  const treatmentTypeOptions = useMemo(() => {
    const base = [{ value: "all", label: t("records.panelFilter.treatmentTypeOptions.all") }];
    if (categories?.length) {
      categories.forEach((cat) => base.push({ value: String(cat.id), label: cat.name }));
    }
    return base;
  }, [categories, t]);

  const statusOptions = [
    { value: "all", label: t("records.panelFilter.treatmentStatusOptions.all") },
    { value: "planned", label: t("records.panelFilter.treatmentStatusOptions.planned") },
    { value: "inProgress", label: t("records.panelFilter.treatmentStatusOptions.inProgress") },
    { value: "completed", label: t("records.panelFilter.treatmentStatusOptions.completed") },
    { value: "cancelled", label: t("records.panelFilter.treatmentStatusOptions.cancelled") },
  ];

  const handleShortcut = (shortcut, idx) => {
    const { from, to } = shortcut.getDates();
    onFilterChange("dateFrom", from);
    onFilterChange("dateTo", to);
    setActiveShortcut(idx);
  };

  const handleReset = () => {
    onClearFilters();
    setActiveShortcut(null);
  };

  // chips de filtros activos
  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.treatmentType !== "all") {
      const opt = treatmentTypeOptions.find((o) => o.value === filters.treatmentType);
      chips.push({ key: "treatmentType", label: `Tipo: ${opt?.label ?? filters.treatmentType}`, reset: "all" });
    }
    if (filters.status !== "all") {
      const opt = statusOptions.find((o) => o.value === filters.status);
      chips.push({ key: "status", label: `Estado: ${opt?.label ?? filters.status}`, reset: "all" });
    }
    if (filters.dateFrom) {
      chips.push({ key: "dateFrom", label: `Desde: ${filters.dateFrom}`, reset: "" });
    }
    if (filters.dateTo) {
      chips.push({ key: "dateTo", label: `Hasta: ${filters.dateTo}`, reset: "" });
    }
    return chips;
  }, [filters, treatmentTypeOptions]);

  const removeChip = (chip) => {
    onFilterChange(chip.key, chip.reset);
    if (chip.key === "dateFrom" || chip.key === "dateTo") setActiveShortcut(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 shadow-clinical-sm">
      {/* ── fila 1: search + botones ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon name="Search" size={16} />
          </span>
          <input
            type="search"
            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={t("records.panelFilter.searchPlaceholder")}
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="relative inline-flex items-center gap-2 h-10 px-4 text-sm rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          <Icon name="SlidersHorizontal" size={15} />
          {t("records.panelFilter.title")}
          {activeChips.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center leading-none">
              {activeChips.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          title={t("records.panelFilter.button.resetFilters")}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          <Icon name="RotateCcw" size={15} />
        </button>
      </div>

      {/* ── panel de filtros ── */}
      {panelOpen && (
        <div className="rounded-lg bg-muted/40 border border-border/60 p-4">
          {/* selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select
              label={t("records.panelFilter.treatmentTypeLabel")}
              options={treatmentTypeOptions}
              value={filters.treatmentType}
              onChange={(v) => onFilterChange("treatmentType", v)}
            />
            <Select
              label={t("records.panelFilter.treatmentStatusLabel")}
              options={statusOptions}
              value={filters.status}
              onChange={(v) => onFilterChange("status", v)}
            />
          </div>

          {/* rango de fechas */}
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              {t("records.panelFilter.dateFromLabel")} — {t("records.panelFilter.dateToLabel")}
            </span>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Icon name="Calendar" size={14} />
                </span>
                <input
                  type="date"
                  className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={filters.dateFrom}
                  onChange={(e) => {
                    onFilterChange("dateFrom", e.target.value);
                    setActiveShortcut(null);
                  }}
                />
              </div>
              <span className="text-muted-foreground text-sm select-none">—</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <Icon name="Calendar" size={14} />
                </span>
                <input
                  type="date"
                  className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={filters.dateTo}
                  onChange={(e) => {
                    onFilterChange("dateTo", e.target.value);
                    setActiveShortcut(null);
                  }}
                />
              </div>
            </div>

            {/* shortcuts de fecha */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Acceso rápido:</span>
              {DATE_SHORTCUTS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleShortcut(s, i)}
                  className={[
                    "inline-flex items-center h-6 px-3 rounded-full text-xs border transition-colors",
                    activeShortcut === i
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
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
                onClick={() => removeChip(chip)}
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

export default RecordFilters;
