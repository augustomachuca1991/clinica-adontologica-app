import React, { useState, useEffect, useMemo } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Image from "../../../components/AppImage";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";
import { useTranslation } from "react-i18next";
import { usePatients } from "../../../hooks/PatientsHooks";
import { useTreatmentServices } from "../../../hooks/TreatmentServicesHooks";

const ScheduleAppointmentModal = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const { t } = useTranslation();
  const { searchPatients } = usePatients();
  const { services, loading: loadingServices } = useTreatmentServices();

  const isEditing = !!initialData;

  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  };

  const [formData, setFormData] = useState({
    patientId: "",
    date: getCurrentDate(),
    time: getCurrentTime(),
    duration: "30",
    reason: "",
    notes: "",
    serviceId: null,
    status: "scheduled",
  });

  const durationOptions = [
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "60 min" },
    { value: "90", label: "90 min" },
    { value: "120", label: "120 min" },
  ];

  const serviceOptions = useMemo(() => {
    return services.map((s) => ({
      value: s.name,
      label: s.name,
      id: s.id,
      duration: s.estimated_duration_min,
    }));
  }, [services]);

  const statusOptions = useMemo(
    () => [
      { value: "confirmed", label: t("appointment.status.confirmed") },
      { value: "pending", label: t("appointment.status.pending") },
      { value: "cancelled", label: t("appointment.status.cancelled") },
      { value: "scheduled", label: t("appointment.status.scheduled") },
      { value: "in-progress", label: t("appointment.status.in-progress") },
      { value: "completed", label: t("appointment.status.completed") },
      { value: "no-show", label: t("appointment.status.no-show") },
    ],
    [t]
  );

  // Buscador de pacientes en tiempo real
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setPatients([]);
        return;
      }
      setIsSearching(true);
      const results = await searchPatients(searchTerm);
      setPatients(results);
      setIsSearching(false);
    };
    const delayDebounce = setTimeout(performSearch, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchPatients]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // MODO EDICIÓN: Cargamos lo que viene de la base de datos
        const d = new Date(initialData.date);
        setFormData({
          patientId: initialData.patientId || "",
          date: d.toISOString().split("T")[0],
          time: d.toTimeString().slice(0, 5),
          duration: initialData.duration?.replace(" min", "") || "30",
          reason: initialData.treatment || "",
          notes: initialData.notes || "",
          status: initialData.status || "scheduled",
          serviceId: initialData.serviceId || null,
        });
        // Importante: Marcar el paciente como seleccionado
        setSelectedPatient({
          id: initialData.patientId,
          name: initialData.patientName,
          avatar: initialData.patientImage,
        });
      } else {
        // MODO NUEVO: Valores por defecto
        setFormData({
          patientId: "",
          date: getCurrentDate(),
          time: getCurrentTime(),
          duration: "30",
          reason: "",
          notes: "",
          serviceId: null,
          status: "scheduled",
        });
        setSelectedPatient(null);
        setSearchTerm("");
      }
    }
  }, [initialData, isOpen]);

  const handleServiceChange = (selectedName) => {
    const serviceInfo = serviceOptions.find((s) => s.value === selectedName);

    setFormData((prev) => ({
      ...prev,
      reason: selectedName,
      serviceId: serviceInfo?.id ? Number(serviceInfo.id) : null,
      duration: serviceInfo?.duration ? String(serviceInfo.duration) : prev.duration,
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        date: getCurrentDate(),
        time: getCurrentTime(),
      }));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert(t("appointment.errorNoPatient"));

    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    onSave({
      patientId: selectedPatient.id,
      date: appointmentDateTime,
      duration: formData.duration,
      reason: formData.reason,
      serviceId: formData.serviceId,
      notes: formData.notes,
      status: formData.status, // <--- No olvides el status aquí
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl overflow-visible border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="text-xl font-headline font-bold text-foreground flex items-center gap-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            {isEditing ? t("appointment.editTitle") : t("appointment.scheduleTitle")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-1">
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
                <Input type="text" placeholder={t("appointment.patientPlaceholder")} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  </div>
                )}

                {patients.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
                    {patients.map((p) => (
                      <li key={p.id} onClick={() => setSelectedPatient(p)} className="p-3 hover:bg-muted cursor-pointer flex items-center gap-3 transition-colors border-b border-border last:border-0">
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
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchTerm("");
                  }}
                  className="text-primary hover:text-primary-hover text-xs font-bold"
                >
                  {t("appointment.changePatient")}
                </Button>
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <Input required label={t("appointment.date")} type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <Input required label={t("appointment.time")} type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
          </div>

          {/* Procedimiento y Duración */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Select
                label={t("appointment.procedure")}
                required
                options={serviceOptions}
                value={formData.reason}
                onChange={handleServiceChange}
                placeholder={loadingServices ? t("appointment.loadingServices") : t("appointment.selectService")}
              />
            </div>
            <div className="flex flex-col">
              <Select label={t("appointment.duration")} options={durationOptions} value={formData.duration} onChange={(val) => setFormData({ ...formData, duration: val })} />
            </div>
          </div>

          {initialData && (
            <div className="space-y-1.5">
              <Select
                label={t("appointment.statusLabel")}
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                placeholder={t("appointment.statusPlaceholder")}
              />
            </div>
          )}

          <div className="relative z-[10]">
            <label className="text-sm font-medium mb-1.5 block text-foreground">{t("appointment.notes")}</label>
            <textarea
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] text-sm text-foreground"
              placeholder={t("appointment.notesPlaceholder") || "Observaciones de la cita..."}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Footer Botones */}
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
    </div>
  );
};

export default ScheduleAppointmentModal;
