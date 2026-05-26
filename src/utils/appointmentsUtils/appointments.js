import * as Yup from "yup";

// ─── Helpers de fecha (evaluados en runtime, no en import) ─────────────────────
export const getCurrentDate = () => new Date().toISOString().split("T")[0];

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
};

// ─── Valores iniciales ─────────────────────────────────────────────────────────
// Función en vez de objeto estático — así date/time son frescos cada vez que se abre el modal
export const getInitialFormValues = () => ({
  patientId: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
  duration: "30",
  reason: "",
  notes: "",
  serviceId: null,
  status: "scheduled",
});

// ─── Opciones estáticas ────────────────────────────────────────────────────────
export const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];

export const STATUS_KEYS = ["confirmed", "pending", "cancelled", "scheduled", "in_progress", "completed", "no_show"];

// Construido en runtime para que t() esté disponible
export const getStatusOptions = (t) =>
  STATUS_KEYS.map((key) => ({
    value: key,
    label: t(`appointment.status.${key}`),
  }));

// ─── Schema de validación ──────────────────────────────────────────────────────
export const getAppointmentSchema = (t) =>
  Yup.object({
    patientId: Yup.string().required(t("appointment.errorNoPatient")),
    date: Yup.string().required(t("appointment.errorNoDate")),
    time: Yup.string().required(t("appointment.errorNoTime")),
    duration: Yup.string().required(t("appointment.errorNoDuration")),
    serviceId: Yup.number().typeError(t("appointment.errorNoService")).required(t("appointment.errorNoService")),
    reason: Yup.string().trim().required(t("appointment.errorNoReason")),
    notes: Yup.string(),
    status: Yup.string().required(),
  });

// ─── Builder del payload final para onSave ────────────────────────────────────
export const buildAppointmentPayload = (values, appointmentId) => ({
  id: appointmentId,
  patientId: values.patientId,
  date: `${values.date}T${values.time}:00`,
  duration: values.duration,
  reason: values.reason,
  serviceId: values.serviceId,
  notes: values.notes,
  status: values.status,
});

// ─── Mapper initialData → formik values ───────────────────────────────────────
export const mapInitialDataToValues = (initialData) => ({
  patientId: initialData.patientId || "",
  date: initialData.date || getCurrentDate(),
  time: initialData.time || getCurrentTime(),
  duration: initialData.duration?.toString().replace(" min", "") || "30",
  reason: initialData.treatment || "",
  notes: initialData.notes || "",
  status: initialData.status || "scheduled",
  serviceId: initialData.serviceId ? Number(initialData.serviceId) : null,
});
