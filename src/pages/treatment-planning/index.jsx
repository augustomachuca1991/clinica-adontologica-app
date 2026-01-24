import React, { useState, useEffect, useMemo } from "react";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import ToothChart from "./components/ToothChart";
import TreatmentSequence from "./components/TreatmentSequence";
import TreatmentPlanComparison from "./components/TreatmentPlanComparison";
import InsuranceVerification from "./components/InsuranceVerification";
import PatientPresentationMode from "./components/PatientPresentationMode";
import TreatmentForm from "./components/TreatmentForm";
import { useTranslation } from "react-i18next";
import { formatDateLang } from "../../utils/formatters/date";
import { usePatients } from "../../hooks/PatientsHooks";
import { useTreatmentServices } from "../../hooks/TreatmentServicesHooks";
import { useClinicalRecords } from "../../hooks/ClinicalRecorsHooks";
import { notifyError, notifyInfo, notifySuccess } from "../../utils/notifications";

const TreatmentPlanning = () => {
  const { t, i18n } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showPresentationMode, setShowPresentationMode] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);

  const { sortedPatients, loading: loadingPatients } = usePatients();
  const { services, loading: loadingServices } = useTreatmentServices();
  const { saveTreatmentPlan, fetchPatientSummary, fetchPatientRecords, updateClinicalRecord, summary, records, loading: loadingTreatmentPlan } = useClinicalRecords();

  /* const treatments = [
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
      status: "inProgress",
      notes: "Small cavity on occlusal surface",
    },
    {
      id: 3,
      toothNumber: 27,
      procedure: "Composite Filling",
      cost: 2500,
      duration: "1 visit",
      priority: "medium",
      status: "completed",
      notes: "Small cavity on occlusal surface",
    },
  ] */

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

  useEffect(() => {
    if (sortedPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(sortedPatients[0].id.toString());
    }
  }, [sortedPatients, selectedPatient]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientSummary(selectedPatient);
      fetchPatientRecords(selectedPatient);
    }
  }, [selectedPatient, fetchPatientSummary, fetchPatientRecords]);

  const patientOptions = useMemo(() => {
    return sortedPatients.map((p) => ({
      value: p.id.toString(),
      label: `${p.name} - #${p.patient_id || "S/N"}`,
    }));
  }, [sortedPatients]);

  const activePatient = useMemo(() => {
    return sortedPatients.find((p) => p.id.toString() === selectedPatient);
  }, [selectedPatient, sortedPatients]);

  const allTreatments = useMemo(() => {
    return [...treatments, ...records];
  }, [treatments, records]);

  const handleToothSelect = (toothNumber) => {
    if (editingTreatment) {
      notifyInfo(t("treatment.finishEditingFirst") || "Debes terminar de editar antes de seleccionar");
      return;
    }

    if (selectedTeeth?.includes(toothNumber)) {
      setSelectedTeeth(selectedTeeth?.filter((t) => t !== toothNumber));
    } else {
      setSelectedTeeth([...selectedTeeth, toothNumber]);
      setShowTreatmentForm(true);
    }
  };

  const handleAddTreatment = async (treatmentData) => {
    if (editingTreatment) {
      // CASO A: Es un registro que ya existe en la Base de Datos
      if (editingTreatment.isPersisted) {
        const result = await updateClinicalRecord(editingTreatment.id, treatmentData);

        if (result.success) {
          notifySuccess(t("treatment.updateSuccess") || "Save success");
          fetchPatientRecords(selectedPatient); // Refrescamos historial
          fetchPatientSummary(selectedPatient); // Refrescamos contadores
        } else {
          notifyError(t("treatment.saveError") + ": " + result.error);
        }
      }
      // CASO B: Es un registro nuevo que aún no se guardó (solo está en el array local)
      else {
        setTreatments((prev) => prev.map((t) => (t.id === editingTreatment.id ? treatmentData : t)));
      }
      setEditingTreatment(null);
    } else {
      // CASO C: Es un tratamiento nuevo desde cero
      // Generamos un ID temporal para que React pueda manejarlo en la lista local
      const newTreatment = { ...treatmentData, id: Date.now(), isPersisted: false };
      setTreatments((prev) => [...prev, newTreatment]);
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

  const handleSaveFullPlan = async () => {
    const result = await saveTreatmentPlan(selectedPatient, treatments);

    if (result.success) {
      notifySuccess(t("treatment.saveSuccess"));
      setTreatments([]);
      setSelectedTeeth([]);
      setShowTreatmentForm(false);
      fetchPatientRecords(selectedPatient);
    } else {
      notifyError(t("treatment.saveError") + ": " + result.error);
    }
  };

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">{t("treatment.title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("treatment.subtitle")}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button variant="outline" onClick={() => setShowComparison(!showComparison)} iconName="GitCompare" iconPosition="left">
              {t("treatment.comparePlans")}
            </Button>
            <Button variant="default" onClick={() => setShowPresentationMode(true)} iconName="Presentation" iconPosition="left" disabled={treatments?.length === 0}>
              {t("treatment.presentToPatient")}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Select
                label={t("treatment.selectPatient")}
                options={patientOptions}
                value={selectedPatient}
                onChange={setSelectedPatient}
                searchable
                disabled={loadingPatients}
                placeholder={loadingPatients && t("loading")}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Icon name="Calendar" size={18} className="text-muted-foreground" />
              <span className="text-muted-foreground">{t("treatment.lastVisit", { date: formatDateLang("2026-01-10", i18n.language) })}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="User" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{t("treatment.patientInfo")}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>{t("treatment.age", { age: activePatient?.age || "--" })}</div>
                <div>{t("treatment.lastTreatment", { date: "Dec 2025" })}</div>
                <div>{t("treatment.insurance", { insurance: activePatient?.insurance || "N/A" })}</div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="AlertCircle" size={20} className="text-warning" />
                <span className="text-sm font-medium text-foreground">{t("treatment.activeIssues")}</span>
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
                <span className="text-sm font-medium text-foreground">{t("treatment.treatmentStatus")}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  {t("treatment.status.planned")}: {summary.planned}
                </div>
                <div>
                  {t("treatment.status.inProgress")}: {summary.inProgress}
                </div>
                <div>
                  {t("treatment.status.completed")}: {summary.completed}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showComparison && <TreatmentPlanComparison plans={treatmentPlans} onSelectPlan={handleSelectPlan} selectedPlanId={selectedPlanId} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div className={editingTreatment ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
              <ToothChart selectedTeeth={selectedTeeth} onToothSelect={handleToothSelect} treatments={allTreatments} />
            </div>

            {(showTreatmentForm || editingTreatment) && (
              <div className="bg-card border border-border rounded-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-headline font-semibold text-foreground mb-4">{editingTreatment ? t("treatment.editTreatment") : t("treatment.addTreatment")}</h3>
                <TreatmentForm
                  services={services}
                  isEditingHistory={editingTreatment?.isPersisted}
                  loading={loadingServices}
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
            <TreatmentSequence treatments={allTreatments} services={services} onReorder={handleReorderTreatments} onRemove={handleRemoveTreatment} onEdit={handleEditTreatment} />
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
                  <Button variant="default" iconName="Save" iconPosition="left" onClick={handleSaveFullPlan} disabled={loadingTreatmentPlan}>
                    {loadingTreatmentPlan ? t("loading") : t("treatment.savePlan")}
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
    </>
  );
};

export default TreatmentPlanning;
