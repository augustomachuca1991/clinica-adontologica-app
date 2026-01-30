import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import RecordFilters from "@/pages/clinical-records/components/RecordFilters";
import RecordCard from "@/pages/clinical-records/components/RecordCard";
import TimelineView from "@/pages/clinical-records/components/TimelineView";
import AddNoteModal from "@/pages/clinical-records/components/AddNoteModal";
import RecordDetailsModal from "@/pages/clinical-records/components/RecordDetailsModal";
import StatsOverview from "@/pages/clinical-records/components/StatsOverview";
import { useGlobalClinicalRegistry } from "@/hooks/GlobalClinicalRegistryHooks";
import { useClinicalNotes } from "@/hooks/ClinicalNotesHooks";

const ClinicalRecords = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    treatmentType: "all",
    status: "all",
    provider: "all",
    dateFrom: "",
    dateTo: "",
  });

  const { t } = useTranslation();
  const { records, loading, stats, refresh } =
    useGlobalClinicalRegistry(filters);
  const { addNote } = useClinicalNotes();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      treatmentType: "all",
      status: "all",
      provider: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleAddNote = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(false);
    setShowAddNoteModal(true);
  };

  const handleSaveNote = async (content, type) => {
    if (!selectedRecord) return;

    const result = await addNote(selectedRecord.id, content, type);

    if (result.success) {
      setShowAddNoteModal(false);
      refresh(); // Esto recarga los records de Supabase con la nueva nota
      notifySuccess(t("records.notes.saveSuccess"));
    } else {
      notifyError(result.error);
    }
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
              {t("records.title")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {t("records.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors duration-base ${viewMode === "grid" ? "bg-card text-primary shadow-clinical-sm" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <Icon name="LayoutGrid" size={18} />
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`p-2 rounded-md transition-colors duration-base ${viewMode === "timeline" ? "bg-card text-primary shadow-clinical-sm" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Timeline view"
              >
                <Icon name="List" size={18} />
              </button>
            </div>
            <Button variant="default" iconName="Plus" iconPosition="left">
              {t("records.button.newRecord")}
            </Button>
          </div>
        </div>

        {!loading && <StatsOverview stats={stats} />}

        <RecordFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
                {t("records.treatmentHistoryList.title")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t("records.treatmentHistoryList.foundRecords", {
                  count: records?.length,
                })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              {t("records.treatmentHistoryList.button.export")}
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="animate-spin mb-4">
                <Icon name="RefreshCw" size={32} />
              </div>
              <p>Cargando historias clínicas...</p>
            </div>
          ) : (
            <>
              {/* CAMBIO: Ahora mapeamos 'records' (los reales de Supabase) */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                  {records?.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      onViewDetails={handleViewDetails}
                      onAddNote={handleAddNote}
                    />
                  ))}
                </div>
              ) : (
                <TimelineView records={records} />
              )}

              {/* CAMBIO: Si después de cargar, la lista está vacía, mostramos el estado Empty */}
              {records?.length === 0 && (
                <div className="text-center py-12">
                  <Icon
                    name="FileText"
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-headline font-semibold text-foreground mb-2">
                    {t("records.treatmentHistoryList.foundRecords_zero")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t("records.treatmentHistoryList.tryAdjusting")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    {t("records.treatmentHistoryList.button.resetFilters")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showAddNoteModal && selectedRecord && (
        <AddNoteModal
          record={selectedRecord}
          onClose={() => setShowAddNoteModal(false)}
          onSave={handleSaveNote}
        />
      )}
      {showDetailsModal && selectedRecord && (
        <RecordDetailsModal
          record={selectedRecord}
          onClose={() => setShowDetailsModal(false)}
          onAddNote={() => handleAddNote(selectedRecord)}
        />
      )}
    </>
  );
};

export default ClinicalRecords;
