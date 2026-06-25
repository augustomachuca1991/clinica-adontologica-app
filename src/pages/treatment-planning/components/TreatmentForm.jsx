import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";
import StatusStepper from "@/pages/treatment-planning/components/StatusStepper";
import { useTranslation } from "react-i18next";

const getInitialValues = (editingTreatment) =>
  editingTreatment
    ? {
        procedure: (editingTreatment.procedure || editingTreatment.service_id)?.toString() || "",
        cost: editingTreatment.cost ?? "",
        duration: editingTreatment.duration ?? "",
        priority: editingTreatment.priority || "medium",
        status: editingTreatment.status === "in-progress" ? "inProgress" : editingTreatment.status || "planned",
        notes: editingTreatment.notes ?? "",
      }
    : {
        procedure: "",
        cost: "",
        duration: "",
        priority: "medium",
        status: "planned",
        notes: "",
      };

const TreatmentForm = ({
  services,
  loading,
  selectedTeeth,
  onSubmit,
  onCancel,
  editingTreatment,
  isEditingHistory,
}) => {
  const { t } = useTranslation();

  const displayTeeth = editingTreatment ? [editingTreatment.toothNumber] : (selectedTeeth || []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        procedure: Yup.string().required(t("treatment.validation.procedureRequired")),
        cost: Yup.number()
          .typeError(t("treatment.validation.costInvalid"))
          .required(t("common.errors.required"))
          .min(0, t("treatment.validation.costMin")),
        duration: Yup.number()
          .typeError(t("treatment.validation.durationInvalid"))
          .integer(t("treatment.validation.durationInteger"))
          .min(1, t("treatment.validation.durationMin"))
          .nullable(true)
          .transform((value) => (isNaN(value) ? null : value)),
        priority: Yup.string().required(t("common.errors.required")),
        status: Yup.string().required(t("common.errors.required")),
      }),
    [t]
  );

  const formik = useFormik({
    initialValues: getInitialValues(editingTreatment),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const toothCount = displayTeeth?.length || 1;
      onSubmit({
        ...values,
        id: editingTreatment?.id || Date.now(),
        cost: parseFloat(values.cost) / toothCount,
        duration: values.duration ? String(Math.round(parseInt(values.duration, 10) / toothCount)) : "",
      });
    },
  });

  const priorityOptions = [
    { value: "urgent", label: t("treatment.priority.urgent") },
    { value: "high", label: t("treatment.priority.high") },
    { value: "medium", label: t("treatment.priority.medium") },
    { value: "low", label: t("treatment.priority.low") },
  ];

  const procedureOptions = useMemo(() => {
    if (!services || !Array.isArray(services) || services.length === 0) {
      return [];
    }

    return services.map((s) => {
      const actualService = s.service ? s.service : s;

      return {
        value: actualService.id?.toString() || "",
        label: actualService.name || t("common.unknown"),
      };
    });
  }, [services]);

  const handleProcedureChange = (serviceId) => {
    const idStr = serviceId?.toString();
    formik.setFieldValue("procedure", idStr);

    const selectedService = services.find((s) => {
      const actualService = s.service ? s.service : s;
      return actualService.id?.toString() === idStr;
    });

    const serviceData = selectedService?.service ? selectedService.service : selectedService;
    const toothCount = displayTeeth?.length || 1;

    if (serviceData) {
      const unitCost = serviceData.base_cost;
      const unitDuration = serviceData.estimated_duration_min;
      formik.setFieldValue("cost", unitCost ? (parseFloat(unitCost) * toothCount).toString() : "");
      formik.setFieldValue("duration", unitDuration ? String(unitDuration * toothCount) : "");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t("treatment.formLabel.toothNumber")}
          </label>
          <div className="flex flex-wrap gap-2">
            {displayTeeth.map((toothNum) => (
              <span
                key={toothNum}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium"
              >
                <Icon name="Hash" size={14} />
                {toothNum}
              </span>
            ))}
          </div>
        </div>

        <Select
          label={loading ? t("loading") : t("treatment.formLabel.procedure")}
          options={procedureOptions}
          value={formik.values.procedure}
          onChange={handleProcedureChange}
          disabled={loading || isEditingHistory}
          error={formik.touched.procedure && formik.errors.procedure}
          required
        />

        <Input
          label={t("treatment.formLabel.estimatedCost")}
          type="number"
          placeholder={t("treatment.formPlaceholder.estimatedCost")}
          value={formik.values.cost}
          disabled={isEditingHistory}
          onChange={formik.handleChange("cost")}
          onBlur={formik.handleBlur("cost")}
          error={formik.touched.cost && formik.errors.cost}
          required
        />
        <Input
          label={t("treatment.formLabel.duration")}
          type="number"
          min={1}
          placeholder={t("treatment.formPlaceholder.duration")}
          value={formik.values.duration}
          onChange={formik.handleChange("duration")}
          onBlur={formik.handleBlur("duration")}
          disabled={isEditingHistory}
          error={formik.touched.duration && formik.errors.duration}
          suffix={t("treatment.durationUnit")}
        />

        <Select
          label={t("treatment.formLabel.priority")}
          options={priorityOptions}
          value={formik.values.priority}
          onChange={(value) => formik.setFieldValue("priority", value)}
          error={formik.touched.priority && formik.errors.priority}
          required
        />

        <StatusStepper
          currentStatus={formik.values.status}
          onChange={(value) => formik.setFieldValue("status", value)}
          isNew={!editingTreatment}
        />
      </div>
      <Input
        label={t("treatment.formLabel.notes")}
        type="text"
        placeholder={t("treatment.formPlaceholder.notes")}
        value={formik.values.notes}
        onChange={formik.handleChange("notes")}
      />
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="default" fullWidth>
          {editingTreatment ? t("treatment.updateTreatment") : t("treatment.addTreatment")}
        </Button>
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          {t("common.actions.cancel")}
        </Button>
      </div>
    </form>
  );
};

export default TreatmentForm;
