import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";
import { useTreatmentServices } from "@/hooks/TreatmentServicesHooks";
import QuickAddServicePanel from "@/pages/dashboard/components/QuickAddServicePanel";
import PatientSearchInput from "@/pages/dashboard/components/PatientSearchInput";

import {
  DURATION_OPTIONS,
  getAppointmentSchema,
  getInitialFormValues,
  mapInitialDataToValues,
  buildAppointmentPayload,
} from "@/utils/appointmentsUtils/appointments";
import { ALLOWED_TRANSITIONS, STATUS_CONFIG } from "@/utils/appointmentStatuses";

const ScheduleAppointmentModal = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const { t } = useTranslation();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { services, loading: loadingServices, refresh: refreshServices } = useTreatmentServices();

  const isEditing = !!initialData?.id;

  // ── Opciones memoizadas ────────────────────────────────────────────────────
  const serviceOptions = useMemo(() => {
    if (!services?.length) return [];
    return services.map((s) => ({
      value: String(s.id),
      label: s.name,
      duration: s.estimated_duration_min,
    }));
  }, [services]);

  const statusOptions = useMemo(() => {
    if (!isEditing || !initialData?.status) return [];
    const current = initialData.status.replace(/-/g, "_");
    const transitions = ALLOWED_TRANSITIONS[current] ?? [];
    const options = [{ value: current, label: t(`common.status.${current}`), disabled: true }];
    transitions.forEach((key) => {
      options.push({ value: key, label: t(`common.status.${key}`) });
    });
    return options;
  }, [t, isEditing, initialData?.status]);

  const validationSchema = useMemo(() => getAppointmentSchema(t), [t]);

  // ── Formik ─────────────────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: getInitialFormValues(),
    validationSchema,
    validateOnChange: false, // valida solo al submit o al blur para no molestar
    validateOnBlur: true,
    onSubmit: (values) => {
      onSave(buildAppointmentPayload(values, initialData?.id));
    },
  });

  // ── Reset / populate al abrir ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      formik.setValues(mapInitialDataToValues(initialData));
      if (initialData.patientId) {
        setSelectedPatient({
          id: initialData.patientId,
          name: initialData.patientName,
          avatar: initialData.patientImage,
        });
      }
    } else {
      formik.resetForm({ values: getInitialFormValues() });
      setSelectedPatient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // ── Sincronizar paciente seleccionado → formik.values.patientId ───────────
  const handlePatientChange = useCallback(
    (patient) => {
      setSelectedPatient(patient);
      formik.setFieldValue("patientId", patient?.id ?? "");
      if (patient) formik.setFieldTouched("patientId", true);
    },
    [formik]
  );

  // ── Servicio seleccionado → rellena reason y duration ─────────────────────
  const handleServiceChange = useCallback(
    (selectedId) => {
      const service = serviceOptions.find((s) => s.value === String(selectedId));
      formik.setValues((prev) => ({
        ...prev,
        reason: service?.label ?? "",
        serviceId: service ? Number(service.value) : null,
        duration: service?.duration ? String(service.duration) : prev.duration,
      }));
    },
    [serviceOptions, formik]
  );

  // ── Servicio creado desde QuickAdd ─────────────────────────────────────────
  const handleServiceSaved = useCallback(
    (newService) => {
      formik.setValues((prev) => ({
        ...prev,
        reason: newService.name,
        duration: String(newService.duration),
      }));
      setShowQuickAdd(false);
      refreshServices();
    },
    [formik, refreshServices]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl border border-border">
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 rounded-t-2xl">
          <h2 className="text-xl font-headline font-bold text-foreground flex items-center gap-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            {isEditing ? t("appointment.editTitle") : t("appointment.scheduleTitle")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          {/* Paciente */}
          <PatientSearchInput
            value={selectedPatient}
            onChange={handlePatientChange}
            error={formik.touched.patientId && formik.errors.patientId}
          />

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
                className="pl-10 cursor-pointer"
                {...formik.getFieldProps("date")}
                error={formik.touched.date && formik.errors.date}
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
                className="pl-10 cursor-pointer"
                {...formik.getFieldProps("time")}
                error={formik.touched.time && formik.errors.time}
              />
            </div>
          </div>

          {/* Servicio y Duración */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Select
                    label={t("appointment.procedure")}
                    required
                    options={serviceOptions}
                    value={formik.values.serviceId ? String(formik.values.serviceId) : ""}
                    onChange={handleServiceChange}
                    placeholder={loadingServices ? t("appointment.loadingServices") : t("appointment.selectService")}
                    error={formik.touched.serviceId && formik.errors.serviceId}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(true)}
                  className="mb-0.5 h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary bg-background transition-colors"
                  title={t("appointment.addService")}
                >
                  <Icon name="Plus" size={18} />
                </button>
              </div>
            </div>

            <Select
              label={t("appointment.duration")}
              options={DURATION_OPTIONS}
              value={formik.values.duration}
              onChange={(val) => formik.setFieldValue("duration", val)}
            />
          </div>

          {/* Estado — solo en edición */}
          {isEditing && (
            <Select
              label={t("appointment.statusLabel")}
              options={statusOptions}
              value={formik.values.status}
              onChange={(val) => formik.setFieldValue("status", val)}
              placeholder={t("appointment.statusPlaceholder")}
            />
          )}

          {/* Notas */}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">{t("appointment.notes")}</label>
            <textarea
              {...formik.getFieldProps("notes")}
              className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] text-sm text-foreground resize-none"
              placeholder={t("appointment.notesPlaceholder")}
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

      {/* Panel QuickAdd */}
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
