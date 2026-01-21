import React, { useState, useMemo } from "react";
import Button from "../../components/ui/Button";
import SearchFilters from "./components/SearchFilters";
import StatsOverview from "./components/StatsOverview";
import ViewToggle from "./components/ViewToggle";
import PatientCard from "./components/PatientCard";
import PatientTable from "./components/PatientTable";
import BulkActions from "./components/BulkActions";
import Pagination from "./components/Pagination";
import AddPatientModal from "./components/AddPatientModal";
import Icon from "../../components/AppIcon";
import { useTranslation } from "react-i18next";
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from "../../utils/notifications";

// Edad desde ISO
const calculateAge = (isoDate) => {
  if (!isoDate) return null;

  const birthDate = new Date(isoDate);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
const PatientDirectory = () => {
  const [view, setView] = useState("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ column: "createdAt", direction: "des" });
  const [patients, setPatients] = useState([
    {
      id: 1,
      patientId: "PT-2026-001",
      name: "Sarah Johnson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b72fa019-1763294606942.png",
      avatarAlt: "Professional headshot of Caucasian woman with shoulder-length brown hair wearing blue medical scrubs",
      dateOfBirth: "1985-03-15",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      insurance: "Delta Dental",
      status: "active",
      nextAppointment: "Jan 18, 2026 10:00 AM",
      appointmentStatus: "upcoming",
      tags: ["regular", "orthodontics"],
      lastVisit: "2025-12-15",
      age: 40,
      createdAt: "2025-11-10T09:15:00Z",
    },
    {
      id: 2,
      patientId: "PT-2026-002",
      name: "Michael Chen",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffeb43ad-1763298672388.png",
      avatarAlt: "Professional headshot of Asian man with short black hair wearing white dress shirt and glasses",
      dateOfBirth: "1992-07-22",
      phone: "(555) 234-5678",
      email: "michael.chen@email.com",
      insurance: "Cigna Dental",
      status: "active",
      nextAppointment: "Jan 20, 2026 2:30 PM",
      appointmentStatus: "upcoming",
      tags: ["new"],
      lastVisit: "2026-01-10",
      age: 33,
      createdAt: "2026-01-02T14:30:00Z",
    },
    {
      id: 3,
      patientId: "PT-2026-003",
      name: "Emily Rodriguez",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e01f24d4-1763295694021.png",
      avatarAlt: "Professional headshot of Hispanic woman with long dark hair wearing professional business attire",
      dateOfBirth: "1978-11-08",
      phone: "(555) 345-6789",
      email: "emily.rodriguez@email.com",
      insurance: "Aetna Dental",
      status: "active",
      nextAppointment: "Jan 12, 2026 9:00 AM",
      appointmentStatus: "overdue",
      tags: ["vip", "implants"],
      lastVisit: "2025-11-20",
      age: 47,
      createdAt: "2025-10-18T11:00:00Z",
    },
    {
      id: 4,
      patientId: "PT-2026-004",
      name: "David Thompson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18d854688-1763295573707.png",
      avatarAlt: "Professional headshot of African American man with short hair wearing navy blue suit and tie",
      dateOfBirth: "1995-05-30",
      phone: "(555) 456-7890",
      email: "david.thompson@email.com",
      insurance: "MetLife Dental",
      status: "pending",
      nextAppointment: null,
      appointmentStatus: "none",
      tags: ["consultation"],
      lastVisit: "2026-01-05",
      age: 30,
      createdAt: "2026-01-04T08:45:00Z",
    },
    {
      id: 5,
      patientId: "PT-2026-005",
      name: "Jessica Martinez",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14fc829c3-1763295803483.png",
      avatarAlt: "Professional headshot of Hispanic woman with curly brown hair wearing casual professional attire",
      dateOfBirth: "1988-09-14",
      phone: "(555) 567-8901",
      email: "jessica.martinez@email.com",
      insurance: "United Healthcare",
      status: "active",
      nextAppointment: "Jan 25, 2026 11:30 AM",
      appointmentStatus: "upcoming",
      tags: ["regular", "crown"],
      lastVisit: "2025-12-28",
      age: 37,
      createdAt: "2025-12-05T10:20:00Z",
    },
    {
      id: 6,
      patientId: "PT-2026-006",
      name: "Robert Wilson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11175ac29-1763292886636.png",
      avatarAlt: "Professional headshot of Caucasian man with gray hair wearing formal business suit",
      dateOfBirth: "1970-02-19",
      phone: "(555) 678-9012",
      email: "robert.wilson@email.com",
      insurance: "Delta Dental",
      status: "active",
      nextAppointment: "Jan 22, 2026 3:00 PM",
      appointmentStatus: "upcoming",
      tags: ["senior", "prosthetics"],
      lastVisit: "2026-01-08",
      age: 56,
      createdAt: "2026-01-01T12:00:00Z",
    },
    {
      id: 7,
      patientId: "PT-2026-007",
      name: "Amanda Lee",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14a968b1a-1763300420863.png",
      avatarAlt: "Professional headshot of Asian woman with straight black hair wearing modern casual attire",
      dateOfBirth: "1998-12-03",
      phone: "(555) 789-0123",
      email: "amanda.lee@email.com",
      insurance: "Self-Pay",
      status: "active",
      nextAppointment: "Jan 19, 2026 1:00 PM",
      appointmentStatus: "upcoming",
      tags: ["student", "cleaning"],
      lastVisit: "2025-12-20",
      age: 27,
      createdAt: "2025-12-18T16:00:00Z",
    },
    {
      id: 8,
      patientId: "PT-2026-008",
      name: "Christopher Brown",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18c22218f-1763292167463.png",
      avatarAlt: "Professional headshot of Caucasian man with short blonde hair wearing casual business attire",
      dateOfBirth: "1982-06-25",
      phone: "(555) 890-1234",
      email: "christopher.brown@email.com",
      insurance: "Cigna Dental",
      status: "inactive",
      nextAppointment: null,
      appointmentStatus: "none",
      tags: ["inactive"],
      lastVisit: "2024-08-15",
      age: 43,
      createdAt: "2024-08-01T09:00:00Z",
    },
    {
      id: 9,
      patientId: "PT-2026-009",
      name: "Nicole Davis",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17341a317-1763293337568.png",
      avatarAlt: "Professional headshot of African American woman with natural curly hair wearing colorful professional attire",
      dateOfBirth: "1990-04-11",
      phone: "(555) 901-2345",
      email: "nicole.davis@email.com",
      insurance: "Aetna Dental",
      status: "active",
      nextAppointment: "Jan 10, 2026 10:30 AM",
      appointmentStatus: "overdue",
      tags: ["endodontics", "followup"],
      lastVisit: "2025-12-01",
      age: 35,
      createdAt: "2025-11-25T13:40:00Z",
    },
    {
      id: 10,
      patientId: "PT-2026-010",
      name: "James Anderson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_183929eb3-1763293099156.png",
      avatarAlt: "Professional headshot of Caucasian man with dark hair and beard wearing casual professional attire",
      dateOfBirth: "1975-08-17",
      phone: "(555) 012-3456",
      email: "james.anderson@email.com",
      insurance: "MetLife Dental",
      status: "active",
      nextAppointment: "Jan 28, 2026 4:00 PM",
      appointmentStatus: "upcoming",
      tags: ["regular", "extraction"],
      lastVisit: "2026-01-12",
      age: 50,
      createdAt: "2026-01-10T10:10:00Z",
    },
    {
      id: 11,
      patientId: "PT-2026-011",
      name: "Sophia Garcia",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143cccc65-1763299617883.png",
      avatarAlt: "Professional headshot of Hispanic woman with long wavy hair wearing elegant professional attire",
      dateOfBirth: "1987-10-29",
      phone: "(555) 123-7890",
      email: "sophia.garcia@email.com",
      insurance: "United Healthcare",
      status: "active",
      nextAppointment: "Jan 24, 2026 9:30 AM",
      appointmentStatus: "upcoming",
      tags: ["vip", "aesthetic"],
      lastVisit: "2026-01-14",
      age: 38,
      createdAt: "2026-01-13T15:00:00Z",
    },
    {
      id: 12,
      patientId: "PT-2026-012",
      name: "Daniel Kim",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a75a8bc5-1763301477310.png",
      avatarAlt: "Professional headshot of Asian man with short styled hair wearing modern business casual attire",
      dateOfBirth: "2000-01-05",
      phone: "(555) 234-8901",
      email: "daniel.kim@email.com",
      insurance: "Delta Dental",
      status: "pending",
      nextAppointment: "Jan 30, 2026 2:00 PM",
      appointmentStatus: "upcoming",
      tags: ["new", "consultation"],
      lastVisit: null,
      age: 26,
      createdAt: "2026-01-15T09:30:00Z",
    },
  ]);

  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "all",
    appointmentStatus: "all",
    insurance: "all",
    treatment: "all",
    lastVisitFrom: "",
    lastVisitTo: "",
    ageFrom: "",
    ageTo: "",
    tags: "",
    showAdvanced: false,
  });

  /* const patients = []; */

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      result = result?.filter((p) => p?.name?.toLowerCase()?.includes(query) || p?.patientId?.toLowerCase()?.includes(query) || p?.phone?.includes(query) || p?.email?.toLowerCase()?.includes(query));
    }

    if (filters?.status !== "all") {
      result = result?.filter((p) => p?.status === filters?.status);
    }

    if (filters?.appointmentStatus !== "all") {
      if (filters?.appointmentStatus === "none") {
        result = result?.filter((p) => !p?.nextAppointment);
      } else {
        result = result?.filter((p) => p?.appointmentStatus === filters?.appointmentStatus);
      }
    }

    if (filters?.insurance !== "all") {
      result = result?.filter((p) => p?.insurance === filters?.insurance);
    }

    if (filters?.treatment !== "all") {
      result = result?.filter((p) => p?.tags?.some((tag) => tag?.includes(filters?.treatment)));
    }

    if (filters?.ageFrom) {
      result = result?.filter((p) => p?.age >= parseInt(filters?.ageFrom));
    }

    if (filters?.ageTo) {
      result = result?.filter((p) => p?.age <= parseInt(filters?.ageTo));
    }

    if (filters?.tags) {
      const searchTags = filters?.tags
        ?.toLowerCase()
        ?.split(",")
        ?.map((t) => t?.trim());
      result = result?.filter((p) => searchTags?.some((tag) => p?.tags?.some((pTag) => pTag?.toLowerCase()?.includes(tag))));
    }

    return result;
  }, [filters, patients]);

  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients];

    sorted.sort((a, b) => {
      let aValue = a[sortConfig.column];
      let bValue = b[sortConfig.column];

      if (["nextAppointment", "createdAt"].includes(sortConfig.column)) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredPatients, sortConfig]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients?.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedPatients?.length / pageSize);

  const stats = useMemo(() => {
    return {
      total: patients?.length,
      active: patients?.filter((p) => p?.status === "active")?.length,
      upcoming: patients?.filter((p) => p?.appointmentStatus === "upcoming")?.length,
      overdue: patients?.filter((p) => p?.appointmentStatus === "overdue")?.length,
    };
  }, [patients]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      status: "all",
      appointmentStatus: "all",
      insurance: "all",
      treatment: "all",
      lastVisitFrom: "",
      lastVisitTo: "",
      ageFrom: "",
      ageTo: "",
      tags: "",
      showAdvanced: false,
    });
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      column,
      direction: prev?.column === column && prev?.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectPatient = (id, checked) => {
    setSelectedPatients((prev) => (checked ? [...prev, id] : prev?.filter((pId) => pId !== id)));
  };

  const handleSelectAll = (checked) => {
    setSelectedPatients(checked ? paginatedPatients?.map((p) => p?.id) : []);
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for patients:`, selectedPatients);
    alert(`${action?.charAt(0)?.toUpperCase() + action?.slice(1)} action performed on ${selectedPatients?.length} patient(s)`);
  };

  const handleQuickAction = (action, patient) => {
    /* Los action "message|call"  */
    switch (action) {
      case "message":
        // Verificamos si hay email. Si es un array o string, lo manejamos.
        const email = patient?.email;

        if (email) {
          // mailto: acepta uno o varios correos separados por comas
          const recipients = Array.isArray(email) ? email.join(",") : email;
          window.location.href = `mailto:${recipients}?subject=Consulta Médica - ${patient.name}`;
        } else {
          notifyWarning(`El paciente ${patient.name} no tiene un correo registrado.`);
        }
        break;

      case "call":
        const phone = patient?.phone || patient?.telefono;

        if (phone) {
          const texto = `${patient?.name}, te recuerdo que tienes una cita programada en nuestra clínica. Por favor, confirma tu asistencia. ¡Gracias!`;
          const mensaje = encodeURIComponent(texto);
          const cleanPhone = phone.toString().replace(/\s+/g, "").replace("+", "");

          // Abre WhatsApp con el mensaje listo para completar
          window.open(`https://wa.me/${cleanPhone}?text=` + mensaje, "_blank");
        } else {
          // Alerta específica si no hay número
          notifyWarning(`Error: El paciente ${patient.name} no tiene un número de teléfono configurado.`);
        }
        break;

      default:
        notifyInfo(`${action?.charAt(0)?.toUpperCase() + action?.slice(1)} ${patient?.name}`);
        break;
    }
  };

  const handleAddPatient = (formData) => {
    // Validación campos obligatorios
    if (!formData.name || !formData.dateOfBirth || !formData.email) {
      notifyError(t("patient.form.validation.required"));
      return;
    }
    const nextId = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1;

    const newPatient = {
      id: nextId,
      patientId: `PT-2026-${String(nextId).padStart(3, "0")}`,
      name: formData.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`,
      avatarAlt: "Patient avatar",
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone || "",
      email: formData.email,
      insurance: formData.insurance || "Otros",
      status: "active",
      nextAppointment: null,
      appointmentStatus: "none",
      tags: String(formData.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
      lastVisit: null,
      age: calculateAge(formData.dateOfBirth),
      createdAt: new Date().toISOString(),
    };

    setCurrentPage(1);
    setPatients((prev) => {
      const filtered = prev.filter((p) => p.id !== newPatient.id);
      return [newPatient, ...filtered];
    });
    notifySuccess(t("patient.created"));
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">{t("directory.title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground">{t("directory.subtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <ViewToggle currentView={view} onViewChange={setView} />
            <Button variant="default" iconName="UserPlus" iconPosition="left" onClick={() => setIsAddModalOpen(true)}>
              {t("directory.button.addNewPatient")}
            </Button>
          </div>
        </div>

        {/* <StatsOverview stats={stats} /> */}

        <SearchFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} onSearch={() => console.log("Search applied")} />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t("pagination.showing", { paginated: paginatedPatients?.length, sorted: sortedPatients?.length })}</p>
          {selectedPatients?.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedPatients([])} iconName="X" iconPosition="left">
              {t("pagination.clearSelection")}
            </Button>
          )}
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            {paginatedPatients?.map((patient) => (
              <PatientCard key={patient?.id} patient={patient} onQuickAction={handleQuickAction} />
            ))}
          </div>
        ) : (
          <PatientTable
            patients={paginatedPatients}
            selectedPatients={selectedPatients}
            onSelectPatient={handleSelectPatient}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        )}

        {sortedPatients?.length === 0 && (
          <div className="clinical-card p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-headline font-semibold text-foreground mb-2">{t("patientTable.noPatients")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("patientTable.tryAdjusting")}</p>
            <Button variant="outline" onClick={handleResetFilters}>
              {t("patientTable.resetFilters")}
            </Button>
          </div>
        )}

        {sortedPatients?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
      <BulkActions selectedCount={selectedPatients?.length} onAction={handleBulkAction} />
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(formData) => {
          handleAddPatient(formData);
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
};

export default PatientDirectory;
