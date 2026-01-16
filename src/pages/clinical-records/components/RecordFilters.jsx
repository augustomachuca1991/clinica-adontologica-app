import React from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const RecordFilters = ({ filters, onFilterChange, onClearFilters }) => {
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
          Filter Records
        </h3>
        <Button variant="ghost" size="sm" onClick={onClearFilters} iconName="X" iconPosition="left">
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input type="search" label="Search Patient" placeholder="Patient name or ID..." value={filters?.searchQuery} onChange={(e) => onFilterChange("searchQuery", e?.target?.value)} />

        <Select label="Treatment Type" options={treatmentTypeOptions} value={filters?.treatmentType} onChange={(value) => onFilterChange("treatmentType", value)} />

        <Select label="Status" options={statusOptions} value={filters?.status} onChange={(value) => onFilterChange("status", value)} />

        <Select label="Provider" options={providerOptions} value={filters?.provider} onChange={(value) => onFilterChange("provider", value)} />

        <Input type="date" label="From Date" value={filters?.dateFrom} onChange={(e) => onFilterChange("dateFrom", e?.target?.value)} />

        <Input type="date" label="To Date" value={filters?.dateTo} onChange={(e) => onFilterChange("dateTo", e?.target?.value)} />
      </div>
    </div>
  );
};

export default RecordFilters;
