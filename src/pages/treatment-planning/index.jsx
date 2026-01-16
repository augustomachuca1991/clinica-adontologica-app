import React, { useState } from "react";
import MainLayout from "../../components/ui/MainLayout";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import ToothChart from "./components/ToothChart";
import TreatmentSequence from "./components/TreatmentSequence";
import TreatmentPlanComparison from "./components/TreatmentPlanComparison";
import InsuranceVerification from "./components/InsuranceVerification";
import PatientPresentationMode from "./components/PatientPresentationMode";
import TreatmentForm from "./components/TreatmentForm";

const TreatmentPlanning = () => {
  const [selectedPatient, setSelectedPatient] = useState("1");
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [treatments, setTreatments] = useState([
    {
      id: 1,
      toothNumber: 16,
      procedure: "Dental Crown",
      cost: 1200,
      duration: "2 weeks",
      priority: "high",
      status: "planned",
      notes: "Porcelain crown recommended due to extensive decay",
    },
    {
      id: 2,
      toothNumber: 21,
      procedure: "Composite Filling",
      cost: 250,
      duration: "1 visit",
      priority: "medium",
      status: "in-progress",
      notes: "Small cavity on occlusal surface",
    },
  ]);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);

  const patients = [
    { value: "1", label: "John Smith - #PT001" },
    { value: "2", label: "Sarah Johnson - #PT002" },
    { value: "3", label: "Michael Brown - #PT003" },
    { value: "4", label: "Emily Davis - #PT004" },
  ];

  const patientInsurance = {
    provider: "Delta Dental",
    policyNumber: "DD123456789",
    groupNumber: "GRP-2024-001",
    subscriberName: "John Smith",
  };

  const treatmentPlans = [
    {
      id: 1,
      name: "Essential Care",
      description: "Addresses immediate dental health concerns with priority treatments",
      totalCost: 1450,
      insuranceCoverage: 1160,
      outOfPocket: 290,
      duration: "3 weeks",
      recommended: false,
      procedures: [
        { name: "Dental Crown (Tooth #16)", included: true },
        { name: "Composite Filling (Tooth #21)", included: true },
        { name: "Professional Cleaning", included: false },
        { name: "Fluoride Treatment", included: false },
      ],
    },
    {
      id: 2,
      name: "Comprehensive Care",
      description: "Complete treatment plan including preventive care and all recommended procedures",
      totalCost: 1850,
      insuranceCoverage: 1480,
      outOfPocket: 370,
      duration: "4 weeks",
      recommended: true,
      procedures: [
        { name: "Dental Crown (Tooth #16)", included: true },
        { name: "Composite Filling (Tooth #21)", included: true },
        { name: "Professional Cleaning", included: true },
        { name: "Fluoride Treatment", included: true },
      ],
    },
    {
      id: 3,
      name: "Premium Care",
      description: "All treatments plus advanced cosmetic enhancements and extended warranty",
      totalCost: 2650,
      insuranceCoverage: 1480,
      outOfPocket: 1170,
      duration: "6 weeks",
      recommended: false,
      procedures: [
        { name: "Dental Crown (Tooth #16)", included: true },
        { name: "Composite Filling (Tooth #21)", included: true },
        { name: "Professional Cleaning", included: true },
        { name: "Fluoride Treatment", included: true },
        { name: "Teeth Whitening", included: true },
        { name: "Extended Warranty", included: true },
      ],
    },
  ];

  const handleToothSelect = (toothNumber) => {
    if (selectedTeeth?.includes(toothNumber)) {
      setSelectedTeeth(selectedTeeth?.filter((t) => t !== toothNumber));
    } else {
      setSelectedTeeth([...selectedTeeth, toothNumber]);
      setShowTreatmentForm(true);
    }
  };

  const handleAddTreatment = (treatmentData) => {
    if (editingTreatment) {
      setTreatments(treatments?.map((t) => (t?.id === editingTreatment?.id ? treatmentData : t)));
      setEditingTreatment(null);
    } else {
      setTreatments([...treatments, treatmentData]);
    }
    setShowTreatmentForm(false);
    setSelectedTeeth([]);
  };

  const handleEditTreatment = (treatment) => {
    setEditingTreatment(treatment);
    setShowTreatmentForm(true);
  };

  const handleRemoveTreatment = (treatmentId) => {
    setTreatments(treatments?.filter((t) => t?.id !== treatmentId));
  };

  const handleReorderTreatments = (newTreatments) => {
    setTreatments(newTreatments);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleInsuranceVerify = () => {
    setInsuranceVerified(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">Treatment Planning</h1>
            <p className="text-sm md:text-base text-muted-foreground">Create comprehensive treatment plans with cost estimation and progress tracking</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button variant="outline" onClick={() => setShowComparison(!showComparison)} iconName="GitCompare" iconPosition="left">
              Compare Plans
            </Button>
            <Button variant="default" onClick={() => setShowPresentationMode(true)} iconName="Presentation" iconPosition="left" disabled={treatments?.length === 0}>
              Present to Patient
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Select label="Select Patient" options={patients} value={selectedPatient} onChange={setSelectedPatient} searchable />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Icon name="Calendar" size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">Last visit: January 10, 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="User" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Patient Info</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Age: 42 years</div>
                <div>Last Treatment: Dec 2025</div>
                <div>Insurance: Delta Dental</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="AlertCircle" size={20} className="text-warning" />
                <span className="text-sm font-medium text-foreground">Active Issues</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• Cavity on tooth #16</div>
                <div>• Minor decay on #21</div>
                <div>• Gum sensitivity</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="FileText" size={20} className="text-success" />
                <span className="text-sm font-medium text-foreground">Treatment Status</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Planned: {treatments?.filter((t) => t?.status === "planned")?.length}</div>
                <div>In Progress: {treatments?.filter((t) => t?.status === "in-progress")?.length}</div>
                <div>Completed: {treatments?.filter((t) => t?.status === "completed")?.length}</div>
              </div>
            </div>
          </div>
        </div>

        {showComparison && <TreatmentPlanComparison plans={treatmentPlans} onSelectPlan={handleSelectPlan} selectedPlanId={selectedPlanId} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <ToothChart selectedTeeth={selectedTeeth} onToothSelect={handleToothSelect} treatments={treatments} />

            {showTreatmentForm && selectedTeeth?.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-headline font-semibold text-foreground mb-4">{editingTreatment ? "Edit Treatment" : "Add Treatment"}</h3>
                <TreatmentForm
                  selectedTooth={selectedTeeth?.[0]}
                  onSubmit={handleAddTreatment}
                  onCancel={() => {
                    setShowTreatmentForm(false);
                    setEditingTreatment(null);
                    setSelectedTeeth([]);
                  }}
                  editingTreatment={editingTreatment}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <TreatmentSequence treatments={treatments} onReorder={handleReorderTreatments} onRemove={handleRemoveTreatment} onEdit={handleEditTreatment} />
          </div>
        </div>

        <InsuranceVerification patientInsurance={patientInsurance} onVerify={handleInsuranceVerify} />

        {insuranceVerified && treatments?.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 md:p-6">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle2" size={24} className="text-success flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-headline font-semibold text-foreground mb-2">Treatment Plan Ready</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Insurance verified and treatment plan finalized. You can now present this plan to the patient or save it for future reference.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="default" iconName="Save" iconPosition="left">
                    Save Treatment Plan
                  </Button>
                  <Button variant="outline" onClick={() => setShowPresentationMode(true)} iconName="Presentation" iconPosition="left">
                    Present to Patient
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showPresentationMode && <PatientPresentationMode treatmentPlan={treatmentPlans?.find((p) => p?.id === selectedPlanId) || treatmentPlans?.[1]} onClose={() => setShowPresentationMode(false)} />}
    </MainLayout>
  );
};

export default TreatmentPlanning;
