import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import SearchFilters from "@/pages/patient-directory/components/SearchFilters";
import ViewToggle from "@/pages/patient-directory/components/ViewToggle";
import PatientCard from "@/pages/patient-directory/components/PatientCard";
import PatientTable from "@/pages/patient-directory/components/PatientTable";
import BulkActions from "@/pages/patient-directory/components/BulkActions";
import Pagination from "@/pages/patient-directory/components/Pagination";
import AddPatientModal from "@/pages/patient-directory/components/AddPatientModal";
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from "@/utils/notifications";
import { usePatients } from "@/hooks/PatientsHooks";
import Icon from "@/components/AppIcon";
import StatsOverview from "@/pages/patient-directory/components/StatsOverview";

const FILTERS = {
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
};

const PatientDirectory = () => {
  const [view, setView] = useState("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ column: "createdAt", direction: "des" });

  const { t } = useTranslation();

  const [filters, setFilters] = useState(FILTERS);

  const { sortedPatients, loading, refresh, addPatient } = usePatients(filters, sortConfig);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedPatients?.slice(startIndex, startIndex + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedPatients?.length / pageSize);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(FILTERS);
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

  const onSavePatient = async (formData, imageFile) => {
    if (!formData.name || !formData.dateOfBirth || !formData.email) {
      notifyError(t("patient.form.validation.required"));
      return;
    }

    const result = await addPatient(formData, imageFile);
    if (result.success) {
      await refresh();
      notifySuccess(t("patient.created"));
      setIsAddModalOpen(false);
    } else {
      console.error(result.error);
      notifyError("Error: " + result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b97beb]"></div>
      </div>
    );
  }

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

        <SearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onSearch={() => console.log("Search applied")}
        />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("pagination.showing", { paginated: paginatedPatients?.length, sorted: sortedPatients?.length })}
          </p>
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
      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={onSavePatient} />
    </>
  );
};

export default PatientDirectory;
