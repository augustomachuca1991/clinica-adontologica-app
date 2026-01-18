import React, { useState } from "react";
import MainLayout from "../../components/ui/MainLayout";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import RecordFilters from "./components/RecordFilters";
import RecordCard from "./components/RecordCard";
import TimelineView from "./components/TimelineView";
import AddNoteModal from "./components/AddNoteModal";
import RecordDetailsModal from "./components/RecordDetailsModal";
import { useTranslation } from "react-i18next";
import StatsOverview from "./components/StatsOverview";

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

  const mockRecords = [
    {
      id: 1,
      patientName: "John Anderson",
      patientId: "PT-2024-001",
      treatmentName: "Root Canal Therapy",
      treatmentType: "endodontic",
      status: "completed",
      date: "2026-01-10",
      createdAt: "2026-01-10T09:00:00Z",
      provider: "Dr. Sarah Johnson",
      toothNumber: "#14",
      cost: 1250,
      duration: "90 minutes",
      notes:
        "Root canal treatment completed successfully on tooth #14. Patient tolerated procedure well with local anesthesia. Canal cleaning and shaping performed using rotary instruments. Obturation completed with gutta-percha and sealer. Post-operative radiograph shows excellent fill. Patient advised on post-treatment care and prescribed pain medication.",
      followUp: "Seguimiento: Prep. corona (2 sem.)",
      attachments: [
        {
          url: "https://images.unsplash.com/photo-1726306529401-d6ac8b1e48fb",
          alt: "Pre-operative dental X-ray showing tooth decay and root canal infection in upper right molar",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_149754d6a-1765644679413.png",
          alt: "Post-operative dental X-ray showing completed root canal filling with gutta-percha in tooth number 14",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff0eb232-1766774074207.png",
          alt: "Clinical photograph of tooth isolation with rubber dam during root canal procedure",
        },
      ],
    },
    {
      id: 2,
      patientName: "Sarah Mitchell",
      patientId: "PT-2024-002",
      treatmentName: "Dental Implant Placement",
      treatmentType: "oral-surgery",
      status: "in-progress",
      date: "2026-01-12",
      createdAt: "2026-01-12T10:30:00Z",
      provider: "Dr. Michael Smith",
      toothNumber: "#19",
      cost: 3500,
      duration: "120 minutes",
      notes:
        "First stage implant surgery completed. Titanium implant placed in position #19 with excellent primary stability achieved. Bone quality assessed as Type II. Healing abutment placed. Patient experienced minimal discomfort during procedure under local anesthesia and IV sedation. Post-operative instructions provided including soft diet and oral hygiene protocols.",
      followUp: "Osseointegration period - return in 3 months for crown placement",
      attachments: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_13430daea-1766541576297.png",
          alt: "Surgical site preparation showing exposed jawbone ready for dental implant placement in lower left molar area",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1f3ff07f2-1768523267696.png",
          alt: "Titanium dental implant fixture positioned in jawbone with healing abutment attached",
        },
      ],
    },
    {
      id: 3,
      patientName: "Michael Chen",
      patientId: "PT-2024-003",
      treatmentName: "Composite Filling",
      treatmentType: "restorative",
      status: "completed",
      date: "2026-01-13",
      createdAt: "2026-01-13T11:15:00Z",
      provider: "Dr. Emily Williams",
      toothNumber: "#30",
      cost: 280,
      duration: "45 minutes",
      notes:
        "Class II composite restoration completed on tooth #30. Caries removal performed with minimal tooth structure loss. Cavity preparation refined and etched. Bonding agent applied followed by incremental composite placement using shade A2. Occlusion adjusted and polished to high luster. Patient reported no sensitivity post-treatment.",
      attachments: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_13c019a52-1765863793121.png",
          alt: "Close-up view of tooth cavity preparation showing clean enamel margins ready for composite filling",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1165a0645-1768278928659.png",
          alt: "Completed composite restoration showing natural tooth color and smooth surface finish on lower right molar",
        },
      ],
    },
    {
      id: 4,
      patientName: "Emily Rodriguez",
      patientId: "PT-2024-004",
      treatmentName: "Teeth Whitening",
      treatmentType: "preventive",
      status: "completed",
      date: "2026-01-14",
      createdAt: "2026-01-14T15:45:00Z",
      provider: "Dr. Sarah Johnson",
      toothNumber: "Full Arch",
      cost: 450,
      duration: "60 minutes",
      notes:
        "In-office teeth whitening procedure completed using 35% hydrogen peroxide gel. Pre-treatment shade recorded as A3. Three 15-minute application cycles performed with gingival protection in place. Post-treatment shade achieved: B1. Patient very satisfied with results. Minimal sensitivity reported. Home maintenance kit provided with instructions.",
      attachments: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1de9b56cb-1764669219624.png",
          alt: "Before treatment photograph showing natural tooth color with slight yellowing on upper and lower front teeth",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1de9b56cb-1764669219624.png",
          alt: "After treatment photograph showing bright white smile with uniform tooth color across all visible teeth",
        },
      ],
    },
    {
      id: 5,
      patientName: "David Thompson",
      patientId: "PT-2024-005",
      treatmentName: "Crown Preparation",
      treatmentType: "prosthodontic",
      status: "in-progress",
      date: "2026-01-15",
      createdAt: "2026-01-15T12:00:00Z",
      provider: "Dr. David Brown",
      toothNumber: "#3",
      cost: 1800,
      duration: "75 minutes",
      notes:
        "Crown preparation completed on tooth #3. Existing large amalgam restoration removed. Tooth structure assessed and found adequate for crown support. Preparation margins placed 1mm subgingivally. Impression taken using polyvinyl siloxane material. Temporary crown fabricated and cemented with temporary cement. Shade selected: A2. Laboratory work order submitted.",
      followUp: "Return in 2 weeks for permanent crown cementation",
      attachments: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_13c019a52-1765863793121.png",
          alt: "Prepared tooth showing smooth reduction of enamel and dentin with defined margin line for crown placement",
        },
      ],
    },
    {
      id: 6,
      patientName: "Lisa Martinez",
      patientId: "PT-2024-006",
      treatmentName: "Periodontal Scaling",
      treatmentType: "periodontic",
      status: "completed",
      date: "2026-01-16",
      createdAt: "2026-01-16T08:30:00Z",
      provider: "Dr. Emily Williams",
      toothNumber: "Full Mouth",
      cost: 650,
      duration: "90 minutes",
      notes:
        "Deep scaling and root planing completed in all four quadrants. Moderate calculus deposits removed from subgingival areas. Ultrasonic scaling followed by hand instrumentation for thorough debridement. Pocket depths reduced from 5-6mm to 3-4mm in most areas. Patient tolerated procedure well under local anesthesia. Oral hygiene instructions reinforced.",
      followUp: "Re-evaluation appointment in 6 weeks to assess healing and pocket depth reduction",
      attachments: [],
    },
    {
      id: 7,
      patientName: "Robert Wilson",
      patientId: "PT-2024-007",
      treatmentName: "Orthodontic Adjustment",
      treatmentType: "orthodontic",
      status: "in-progress",
      date: "2026-01-17",
      createdAt: "2026-01-17T16:20:00Z",
      provider: "Dr. Michael Smith",
      toothNumber: "Full Arch",
      cost: 150,
      duration: "30 minutes",
      notes:
        "Monthly orthodontic adjustment completed. Archwires changed to 0.019 x 0.025 stainless steel in both arches. Excellent progress noted in alignment of anterior teeth. Midline correction proceeding as planned. Elastics changed to Class II configuration. Patient compliance with elastic wear is good. No bracket breakages noted.",
      followUp: "Next adjustment scheduled in 4 weeks",
      attachments: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1ac0f7062-1768179955958.png",
          alt: "Frontal view of orthodontic braces showing metal brackets and archwire on upper and lower teeth with improved alignment",
        },
      ],
    },
    {
      id: 8,
      patientName: "Jennifer Lee",
      patientId: "PT-2024-008",
      treatmentName: "Tooth Extraction",
      treatmentType: "oral-surgery",
      status: "completed",
      date: "2026-01-18",
      createdAt: "2026-01-18T14:10:00Z",
      provider: "Dr. David Brown",
      toothNumber: "#32",
      cost: 320,
      duration: "20 minutes",
      notes:
        "Simple extraction of tooth #32 (lower right third molar) completed. Tooth was fully erupted with no complications. Local anesthesia administered. Extraction performed using forceps with minimal trauma to surrounding tissues. Socket inspected and found clean. Hemostasis achieved with gauze pressure. Post-operative instructions provided including pain management and diet modifications.",
      followUp: "Follow-up call in 24 hours, return visit if complications arise",
      attachments: [],
    },
  ];

  const stats = {
    totalRecords: mockRecords?.length,
    completed: mockRecords?.filter((r) => r?.status === "completed")?.length,
    inProgress: mockRecords?.filter((r) => r?.status === "in-progress")?.length,
    planned: mockRecords?.filter((r) => r?.status === "planned")?.length,
  };

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
    setShowAddNoteModal(true);
  };

  const handleSaveNote = (noteData) => {
    console.log("Note saved:", noteData);
  };

  const filteredRecords = mockRecords?.filter((record) => {
    if (
      filters?.searchQuery &&
      !record?.patientName?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) &&
      !record?.patientId?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase())
    ) {
      return false;
    }
    if (filters?.treatmentType !== "all" && record?.treatmentType !== filters?.treatmentType) {
      return false;
    }
    if (filters?.status !== "all" && record?.status !== filters?.status) {
      return false;
    }
    if (filters?.provider !== "all" && record?.provider?.toLowerCase()?.replace(/\s+/g, "-")?.replace("dr.-", "dr-") !== filters?.provider) {
      return false;
    }
    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">{t("records.title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("records.subtitle")}</p>
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

        {/* <StatsOverview stats={stats} /> */}

        <RecordFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

        <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">{t("records.treatmentHistoryList.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("records.treatmentHistoryList.foundRecords", { count: filteredRecords?.length })}</p>
            </div>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              {t("records.treatmentHistoryList.button.export")}
            </Button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              {filteredRecords?.map((record) => (
                <RecordCard key={record?.id} record={record} onViewDetails={handleViewDetails} onAddNote={handleAddNote} />
              ))}
            </div>
          ) : (
            <TimelineView records={filteredRecords} />
          )}

          {filteredRecords?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-headline font-semibold text-foreground mb-2">{t("records.treatmentHistoryList.foundRecords_zero", { count: filteredRecords?.length })}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("records.treatmentHistoryList.tryAdjusting")}</p>
              <Button variant="outline" onClick={handleClearFilters} iconName="RefreshCw" iconPosition="left">
                {t("records.treatmentHistoryList.button.resetFilters")}
              </Button>
            </div>
          )}
        </div>
      </div>
      {showAddNoteModal && selectedRecord && <AddNoteModal record={selectedRecord} onClose={() => setShowAddNoteModal(false)} onSave={handleSaveNote} />}
      {showDetailsModal && selectedRecord && <RecordDetailsModal record={selectedRecord} onClose={() => setShowDetailsModal(false)} />}
    </MainLayout>
  );
};

export default ClinicalRecords;
