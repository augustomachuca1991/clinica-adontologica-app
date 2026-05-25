import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "@/components/AppImage";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";
import { usePatients } from "@/hooks/PatientsHooks";
import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks";
import { notifyError } from "@/utils/notifications";
import QuickAddServicePanel from "@/pages/dashboard/components/QuickAddServicePanel";

// Array estático extraído del componente para liberar memoria en re-renders
const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
};

const INITIAL_FORM_STATE = {
  patientId: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
  duration: "30",
  reason: "",
  notes: "",
  serviceId: null,
  status: "scheduled",
};

const ScheduleAppointmentModal = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const { searchPatients } = usePatients();
  const { services, loading: loadingServices, refresh: refreshServices } = useTreatmentServices();

  const isEditing = !!initialData?.id;

  // Formateo optimizado de opciones de servicio (Corregido bug de "value")
  const serviceOptions = useMemo(() => {
    if (!services || !Array.isArray(services)) return [];
    return services.map((s) => ({
      value: String(s.id), // Corregido: Ahora el value es el ID real esperado
      label: s.name,
      duration: s.estimated_duration_min,
    }));
  }, [services]);

  const statusOptions = useMemo(
    () => [
      { value: "confirmed", label: t("appointment.status.confirmed") },
      { value: "pending", label: t("appointment.status.pending") },
      { value: "cancelled", label: t("appointment.status.cancelled") },
      { value: "scheduled", label: t("appointment.status.scheduled") },
      { value: "in_progress", label: t("appointment.status.in-progress") },
      { value: "completed", label: t("appointment.status.completed") },
      { value: "no_show", label: t("appointment.status.no-show") },
    ],
    [t]
  );

  // Manejador de inputs genérico y optimizado
  const handleInputChange = useCallback(
    (key) => (e) => {
      const value = e?.target ? e.target.value : e;
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // --- BUSCADOR DE PACIENTES (Debounce) ---
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setPatients([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await searchPatients(searchTerm);
        setPatients(results || []);
      } catch (error) {
        console.error("Error buscando pacientes:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounce = setTimeout(performSearch, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchPatients]);

  // --- CONTROL DE INICIALIZACIÓN / RESET DEL MODAL ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          patientId: initialData.patientId || "",
          date: initialData.date || getCurrentDate(),
          time: initialData.time || getCurrentTime(),
          duration: initialData.duration?.toString().replace(" min", "") || "30",
          reason: initialData.treatment || "",
          notes: initialData.notes || "",
          status: initialData.status || "scheduled",
          serviceId: initialData.serviceId ? Number(initialData.serviceId) : null,
        });

        if (initialData.patientId) {
          setSelectedPatient({
            id: initialData.patientId,
            name: initialData.patientName,
            avatar: initialData.patientImage,
          });
        }
      } else {
        setFormData(INITIAL_FORM_STATE);
        setSelectedPatient(null);
        setSearchTerm("");
        setPatients([]);
      }
    }
  }, [initialData, isOpen]);

  const handleServiceChange = (selectedId) => {
    const serviceInfo = serviceOptions.find((s) => s.value === String(selectedId));

    setFormData((prev) => ({
      ...prev,
      reason: serviceInfo ? serviceInfo.label : "",
      serviceId: serviceInfo ? Number(serviceInfo.value) : null,
      duration: serviceInfo?.duration ? String(serviceInfo.duration) : prev.duration,
    }));
  };

  const handleServiceSaved = (newService) => {
    setFormData((prev) => ({
      ...prev,
      reason: newService.name,
      duration: String(newService.duration),
    }));
    setShowQuickAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return notifyError(t("appointment.errorNoPatient"));

    const localDateTime = `${formData.date}T${formData.time}:00`;

    onSave({
      id: initialData?.id,
      patientId: selectedPatient.id,
      date: localDateTime,
      duration: formData.duration,
      reason: formData.reason,
      serviceId: formData.serviceId,
      notes: formData.notes,
      status: formData.status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 rounded-t-2xl">
          <h2 className="text-xl font-headline font-bold text-foreground flex items-center gap-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            {isEditing ? t("appointment.editTitle") : t("appointment.scheduleTitle")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Buscador de Paciente */}
          <div className="relative">
            {!selectedPatient ? (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Icon name="Search" size={18} className="text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder={t("appointment.patientPlaceholder")}
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}

                {patients.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
                    {patients.map((p) => (
                      <li
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors border-b border-border last:border-0"
                      >
                        <Image src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-foreground">
                          {p.name} - {p.patient_id}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-primary/30 bg-primary/5 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <Image src={selectedPatient.avatar} alt="" className="w-9 h-9 rounded-full" />
                  <span className="font-semibold text-sm text-foreground">{selectedPatient.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchTerm("");
                  }}
                >
                  {t("appointment.changePatient")}
                </Button>
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute left-3 top-[40px] z-10 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Icon name="Calendar" size={16} />
              </div>
              <Input
                required
                label={t("appointment.date")}
                type="date"
                className="pl-10 bg-white cursor-pointer custom-datetime-input"
                value={formData.date}
                onChange={handleInputChange("date")}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-[40px] z-10 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Icon name="Clock" size={16} />
              </div>
              <Input
                required
                label={t("appointment.time")}
                type="time"
                className="pl-10 bg-white cursor-pointer custom-datetime-input"
                value={formData.time}
                onChange={handleInputChange("time")}
              />
            </div>
          </div>

          {/* Procedimiento y Duración */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Select
                    label={t("appointment.procedure")}
                    required
                    options={serviceOptions}
                    value={formData.serviceId ? String(formData.serviceId) : ""}
                    onChange={handleServiceChange}
                    placeholder={loadingServices ? t("appointment.loadingServices") : t("appointment.selectService")}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(true)}
                  className="mb-0.5 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary bg-background transition-colors"
                >
                  <Icon name="Plus" size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <Select
                label={t("appointment.duration")}
                options={DURATION_OPTIONS}
                value={formData.duration}
                onChange={handleInputChange("duration")}
              />
            </div>
          </div>

          {/* Mostrar estado solo si se está editando */}
          {initialData && (
            <Select
              label={t("appointment.statusLabel")}
              options={statusOptions}
              value={formData.status}
              onChange={handleInputChange("status")}
              placeholder={t("appointment.statusPlaceholder")}
            />
          )}

          {/* Notas */}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">{t("appointment.notes")}</label>
            <textarea
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] text-sm text-foreground"
              placeholder={t("appointment.notesPlaceholder")}
              value={formData.notes}
              onChange={handleInputChange("notes")}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <Button variant="tertiary" className="flex-1" onClick={onClose} type="button">
              {t("common.cancel")}
            </Button>
            <Button variant="default" className="flex-1" type="submit" disabled={isLoading || !selectedPatient}>
              {isLoading ? t("appointment.scheduling") : t("appointment.confirm")}
            </Button>
          </div>
        </form>
      </div>

      <QuickAddServicePanel
        isOpen={showQuickAdd}
        onSaved={handleServiceSaved}
        onClose={() => setShowQuickAdd(false)}
        onRefresh={refreshServices}
      />
    </div>
  );
};

export default ScheduleAppointmentModal;
