import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import PatientHeader from "@/pages/patient-profile/components/PatientHeader";
import DemographicsTab from "@/pages/patient-profile/components/DemographicsTab";
import MedicalHistoryTab from "@/pages/patient-profile/components/MedicalHistoryTab";
import TreatmentHistoryTab from "@/pages/patient-profile/components/TreatmentHistoryTab";
import CommunicationsTab from "@/pages/patient-profile/components/CommunicationsTab";
import BillingTab from "@/pages/patient-profile/components/BillingTab";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import EditPatientModal from "@/pages/patient-directory/components/EditPatientModal";
import { usePatients, uploadPatientAvatar } from "@/hooks/PatientsHooks";
import { notifyError, notifySuccess } from "@/utils/notifications";
import { usePatientTreatments } from "@/hooks/PatientTreatmentsHooks";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const { sortedPatients, getPatientById, updatePatient, loading: loadingPatients } = usePatients();
  const { treatments, loading: loadingTreatments } = usePatientTreatments(id);

  const [activeTab, setActiveTab] = useState("demographics");
  const [currentPatient, setCurrentPatient] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      setIsPageLoading(true);
      const data = await getPatientById(id);
      setCurrentPatient(data);
      setIsPageLoading(false);
    };

    if (id) loadPatient();
  }, [id, getPatientById]);

  const patientOptions = useMemo(() => {
    return sortedPatients.map((p) => ({
      value: p.id.toString(),
      label: `${p.name} - ${p.patient_id || "S/N"}`,
    }));
  }, [sortedPatients]);

  const medicalHistoryData = {
    allergies: [
      {
        allergen: "Penicillin",
        reaction: "Severe rash and difficulty breathing",
        severity: "High",
      },
      {
        allergen: "Latex",
        reaction: "Skin irritation and itching",
        severity: "Medium",
      },
      {
        allergen: "Ibuprofen",
        reaction: "Stomach upset and nausea",
        severity: "Low",
      },
    ],

    conditions: [
      {
        name: "Hypertension",
        severity: "Medium",
        diagnosedDate: "2018-05-20",
        status: "Active",
        notes: "Controlled with medication, regular monitoring required",
      },
      {
        name: "Type 2 Diabetes",
        severity: "Medium",
        diagnosedDate: "2019-11-10",
        status: "Active",
        notes: "Diet-controlled, HbA1c levels stable at 6.5%",
      },
      {
        name: "Seasonal Allergies",
        severity: "Low",
        diagnosedDate: "2015-03-01",
        status: "Active",
        notes: "Primarily spring and fall, managed with antihistamines",
      },
    ],

    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2018-05-20",
        prescribedBy: "Dr. Robert Chen",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2019-11-10",
        prescribedBy: "Dr. Emily Rodriguez",
      },
      {
        name: "Vitamin D3",
        dosage: "2000 IU",
        frequency: "Once daily",
        startDate: "2020-01-15",
        prescribedBy: "Dr. Sarah Johnson",
      },
      {
        name: "Omega-3 Fish Oil",
        dosage: "1000mg",
        frequency: "Once daily",
        startDate: "2020-01-15",
        prescribedBy: "Dr. Sarah Johnson",
      },
    ],

    surgeries: [
      {
        procedure: "Appendectomy",
        date: "2010-08-15",
        surgeon: "Dr. James Wilson",
        hospital: "San Francisco General Hospital",
        notes: "Routine procedure, no complications",
      },
      {
        procedure: "Wisdom Teeth Extraction",
        date: "2005-06-20",
        surgeon: "Dr. Michael Brown",
        hospital: "Bay Area Dental Surgery Center",
        notes: "All four wisdom teeth removed, standard recovery",
      },
    ],
  };

  const treatmentHistoryData = [
    {
      procedure: "Root Canal Treatment",
      date: "2025-12-10",
      status: "Completed",
      dentist: "Dr. Sarah Johnson",
      location: "Main Clinic - Room 3",
      duration: "90 minutos",
      toothNumber: "#14",
      cost: 1250,
      notes:
        "Root canal therapy completed successfully on upper right first molar. Patient tolerated procedure well with local anesthesia. Crown placement scheduled for follow-up visit. Post-operative instructions provided including pain management and dietary restrictions.",
      followUp: "2026-01-15",
      images: [
        {
          url: "https://images.unsplash.com/photo-1726306529401-d6ac8b1e48fb",
          alt: "Close-up dental X-ray image showing root canal treatment on upper right first molar with clear canal filling and proper seal",
        },
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1c07d20db-1765644681261.png",
          alt: "Post-treatment clinical photograph showing restored tooth structure with temporary filling in place on upper right molar",
        },
      ],
    },
    {
      procedure: "Professional Teeth Cleaning",
      date: "2025-09-15",
      status: "Completed",
      dentist: "Dr. Emily Rodriguez",
      location: "Main Clinic - Room 1",
      duration: "45 minutes",
      toothNumber: "Full mouth",
      cost: 150,
      notes:
        "Routine prophylaxis completed. Moderate calculus buildup removed from lower anterior teeth. Patient education provided on proper flossing technique. Gingival health improved since last visit. Recommended fluoride treatment accepted and applied.",
      followUp: "2026-03-15",
      images: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1de9b56cb-1764669219624.png",
          alt: "Before and after comparison showing removal of dental calculus and plaque from lower front teeth with improved gum health",
        },
      ],
    },
    {
      procedure: "Dental Crown Placement",
      date: "2025-06-20",
      status: "Completed",
      dentist: "Dr. Sarah Johnson",
      location: "Main Clinic - Room 3",
      duration: "60 minutes",
      toothNumber: "#19",
      cost: 1500,
      notes:
        "Porcelain-fused-to-metal crown cemented on lower left first molar. Excellent fit and occlusion achieved. Patient satisfied with aesthetics and function. No sensitivity reported during try-in. Bite adjustment performed to ensure proper contact with opposing teeth.",
      followUp: null,
      images: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1bc327abe-1764654468116.png",
          alt: "Final dental crown placement showing natural-looking porcelain restoration on lower left first molar with proper contour and color match",
        },
      ],
    },
    {
      procedure: "Tooth Extraction",
      date: "2025-03-10",
      status: "Completed",
      dentist: "Dr. Michael Brown",
      location: "Surgical Suite",
      duration: "30 minutes",
      toothNumber: "#32",
      cost: 300,
      notes:
        "Simple extraction of lower right third molar due to severe decay. Tooth removed intact without complications. Socket irrigated and packed with gauze. Post-operative instructions given including ice application and soft diet. Prescription for pain management provided.",
      followUp: "2025-03-24",
      images: [],
    },
    {
      procedure: "Dental Filling - Composite",
      date: "2024-12-05",
      status: "Completed",
      dentist: "Dr. Emily Rodriguez",
      location: "Main Clinic - Room 2",
      duration: "45 minutes",
      toothNumber: "#12",
      cost: 250,
      notes:
        "Class II composite restoration placed on upper right lateral incisor. Caries removal complete with conservative preparation. Shade A2 selected to match adjacent teeth. Proper isolation maintained throughout procedure. Patient reported no sensitivity post-treatment.",
      followUp: null,
      images: [
        {
          url: "https://img.rocket.new/generatedImages/rocket_gen_img_1df5d3394-1764981471270.png",
          alt: "Completed composite dental filling on upper right lateral incisor showing seamless color match and natural tooth contour",
        },
      ],
    },
    {
      procedure: "Orthodontic Consultation",
      date: "2024-09-15",
      status: "Completed",
      dentist: "Dr. Jennifer Lee",
      location: "Orthodontic Department",
      duration: "60 minutes",
      toothNumber: "Full mouth",
      cost: 0,
      notes:
        "Comprehensive orthodontic evaluation completed. Mild crowding noted in lower anterior region. Treatment options discussed including clear aligners and traditional braces. Patient interested in clear aligner therapy. Digital impressions taken for treatment planning. Follow-up scheduled to review treatment plan and cost estimate.",
      followUp: "2024-10-01",
      images: [],
    },
  ];

  const communicationsData = [
    {
      type: "Email",
      subject: "Appointment Reminder - Root Canal Follow-up",
      sender: "DentalCare Manager System",
      date: "2026-01-10T09:00:00",
      content:
        "This is a friendly reminder about your upcoming appointment on January 15, 2026 at 2:00 PM for crown placement following your root canal treatment. Please arrive 10 minutes early to complete any necessary paperwork.",
      status: "Sent",
    },
    {
      type: "SMS",
      subject: "Appointment Confirmation",
      sender: "Dr. Sarah Johnson's Office",
      date: "2025-12-08T14:30:00",
      content:
        "Your appointment for root canal treatment is confirmed for December 10, 2025 at 10:00 AM. Reply YES to confirm or CANCEL to reschedule.",
      status: "Delivered",
    },
    {
      type: "Phone",
      subject: "Treatment Plan Discussion",
      sender: "Dr. Sarah Johnson",
      date: "2025-11-20T11:15:00",
      content:
        "Called patient to discuss root canal treatment options and answer questions about the procedure. Patient expressed concerns about pain management which were addressed. Appointment scheduled for December 10th.",
      status: "Completed",
    },
    {
      type: "Email",
      subject: "6-Month Checkup Reminder",
      sender: "DentalCare Manager System",
      date: "2025-09-01T08:00:00",
      content:
        "It's time for your routine 6-month dental checkup! Please call our office at (555) 123-4567 to schedule your appointment. Regular checkups help maintain optimal oral health and prevent future dental issues.",
      status: "Sent",
    },
    {
      type: "Appointment",
      subject: "Professional Cleaning Completed",
      sender: "Dr. Emily Rodriguez",
      date: "2025-09-15T10:00:00",
      content:
        "Professional teeth cleaning completed successfully. Patient education provided on proper flossing technique. Next cleaning recommended in 6 months. Fluoride treatment applied.",
      status: "Completed",
    },
    {
      type: "SMS",
      subject: "Payment Receipt",
      sender: "Billing Department",
      date: "2025-09-15T11:30:00",
      content:
        "Payment of $150.00 received for professional teeth cleaning on 09/15/2025. Thank you! Your receipt has been emailed to sarah.mitchell@email.com",
      status: "Delivered",
    },
  ];

  const billingData = {
    invoices: [
      {
        invoiceNumber: "INV-2025-1234",
        date: "2025-12-10",
        description: "Root Canal Treatment - Tooth #14",
        totalAmount: 1250,
        amountPaid: 1250,
        balance: 0,
        status: "Paid",
      },
      {
        invoiceNumber: "INV-2025-1189",
        date: "2025-09-15",
        description: "Professional Teeth Cleaning",
        totalAmount: 150,
        amountPaid: 150,
        balance: 0,
        status: "Paid",
      },
      {
        invoiceNumber: "INV-2025-1067",
        date: "2025-06-20",
        description: "Dental Crown Placement - Tooth #19",
        totalAmount: 1500,
        amountPaid: 1000,
        balance: 500,
        status: "Partial",
      },
      {
        invoiceNumber: "INV-2025-0892",
        date: "2025-03-10",
        description: "Tooth Extraction - Tooth #32",
        totalAmount: 300,
        amountPaid: 300,
        balance: 0,
        status: "Paid",
      },
      {
        invoiceNumber: "INV-2024-2456",
        date: "2024-12-05",
        description: "Composite Filling - Tooth #12",
        totalAmount: 250,
        amountPaid: 250,
        balance: 0,
        status: "Paid",
      },
    ],

    paymentMethods: [
      {
        type: "Visa Credit Card",
        last4: "4532",
        expiryDate: "12/2027",
        isDefault: true,
      },
      {
        type: "Mastercard Debit",
        last4: "8901",
        expiryDate: "08/2026",
        isDefault: false,
      },
    ],
  };

  const tabs = [
    { id: "demographics", label: t("profile.tabs.demographics.name"), icon: "User" },
    { id: "treatment-history", label: t("profile.tabs.treatmentHistory.name"), icon: "FileText" },
    /* { id: "medical-history", label: t("profile.tabs.medicalHistory.name"), icon: "Activity" },
    { id: "communications", label: t("profile.tabs.communications.name"), icon: "MessageSquare" },
    { id: "billing", label: t("profile.tabs.billing.name"), icon: "CreditCard" }, */
  ];

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdatePatient = async (updatedData, imageFile) => {
    try {
      let finalAvatarUrl = updatedData.avatar;

      // 1. Si hay un archivo de imagen nuevo, lo subimos primero al Storage
      if (imageFile) {
        // Usamos el ID del paciente para nombrar el archivo
        const uploadedUrl = await uploadPatientAvatar(imageFile, id);

        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        } else {
          // Si falla la subida, podrías decidir si cancelar o seguir
          console.warn("La imagen no se pudo subir, se mantendrá la anterior o ninguna.");
        }
      }

      // 2. Preparamos el objeto final con la nueva URL del avatar
      const dataToSave = {
        ...updatedData,
        avatar: finalAvatarUrl,
      };

      // 3. Llamamos a la función de actualización del hook
      const result = await updatePatient(id, dataToSave);

      if (result.success) {
        // Actualización local para que la UI cambie al instante
        setCurrentPatient(dataToSave);
        setIsEditModalOpen(false);
        notifySuccess(t("notifications.patientUpdated"));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("No se pudo actualizar:", error.message);
      notifyError(t("notifications.errorUpdatingPatient"));
    }
  };

  const handleScheduleAppointment = () => {
    console.log("Schedule appointment clicked");
  };

  const handleSendMessage = () => {
    console.log("Send message clicked");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (selectedPatientId) navigate(`/patient-profile/${selectedPatientId}`);
  };

  const renderTabContent = () => {
    if (!currentPatient) return null;

    switch (activeTab) {
      case "demographics":
        return <DemographicsTab patient={currentPatient} />;
      case "medical-history":
        return <MedicalHistoryTab medicalHistory={medicalHistoryData} />;
      case "treatment-history":
        return <TreatmentHistoryTab treatments={treatments} loading={loadingTreatments} />;
      case "communications":
        return <CommunicationsTab communications={communicationsData} />;
      case "billing":
        return <BillingTab billingInfo={billingData} />;
      default:
        return <DemographicsTab patient={currentPatient} />;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. ESTADO: CARGANDO */}
      {isPageLoading && id ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] animate-pulse">
          <Icon name="Loader2" className="animate-spin text-primary mb-4" size={32} />
          <p className="text-muted-foreground">{t("common.loading") || "Cargando información..."}</p>
        </div>
      ) : /* 2. ESTADO: BÚSQUEDA (Si no hay ID o el paciente no existe) */
      !id || !currentPatient ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">{t("profile.title") || "Buscar Paciente"}</h2>
            <p className="text-muted-foreground">{t("profile.descriptionSearch")}</p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full max-w-md gap-3 items-end">
            <div className="flex-1">
              <Select
                label={t("treatment.selectPatient")}
                options={patientOptions}
                value={selectedPatientId} // Usamos el ID seleccionado
                onChange={(value) => setSelectedPatientId(value)} // Guardamos el ID
                searchable
                disabled={loadingPatients}
                placeholder={loadingPatients && t("loading")}
              />
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={!selectedPatientId}
              iconName="Search"
              className="mb-[2px]" // Ajuste visual para alinear con el Select
            >
              {t("search.label") || "Buscar"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PatientHeader
            patient={currentPatient}
            onEdit={handleEditProfile}
            onSchedule={handleScheduleAppointment}
            onMessage={handleSendMessage}
          />

          <div className="bg-card rounded-lg shadow-clinical-md border border-border overflow-hidden mt-6 md:mt-8">
            <div className="border-b border-border overflow-x-auto">
              <nav className="flex min-w-max lg:min-w-0" aria-label="Patient profile tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-base border-b-2 flex-shrink-0 ${
                      activeTab === tab?.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} className={activeTab === tab?.id ? "text-primary" : "text-muted-foreground"} />
                    <span className="whitespace-nowrap">{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 md:p-6 lg:p-8">{renderTabContent()}</div>
          </div>
        </div>
      )}

      {/* MODAL (Fuera de la lógica condicional principal para que no se desmonte bruscamente) */}
      {isEditModalOpen && (
        <EditPatientModal patient={currentPatient} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdatePatient} />
      )}
    </div>
  );
};

export default PatientProfile;
