// src/pages/settings-panel/components/ProvidersManagement.jsx
import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useTranslation } from "react-i18next";
import { useProviders } from "@/hooks/ProvidersHooks";

// ─── Delete confirmation modal (inline, same pattern as DeleteCategoryModal) ──
const DeleteProviderModal = ({ provider, onClose, onConfirm, isDeleting }) => {
  const { t } = useTranslation();
  const fullName = `${provider.first_name ?? ""} ${provider.last_name ?? ""}`.trim() || provider.specialty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Trash2" size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">
              {t("providers.management.deleteModal.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("providers.management.deleteModal.subtitle", { name: fullName })}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("providers.management.deleteModal.body")}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("providers.management.deleteModal.btnCancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(provider.id)}
            disabled={isDeleting}
          >
            {isDeleting
              ? t("providers.management.deleteModal.btnDeleting")
              : t("providers.management.deleteModal.btnConfirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── View detail modal ─────────────────────────────────────────────────────────
const ViewProviderModal = ({ provider, onClose, onEdit }) => {
  const { t } = useTranslation();
  const fullName = `${provider.first_name ?? ""} ${provider.last_name ?? ""}`.trim();

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const detail = (label, value) => (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="UserRound" size={22} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">{fullName || "—"}</h3>
              <p className="text-xs text-muted-foreground">{provider.specialty}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        {/* Status badge */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              provider.is_active
                ? "bg-green-100 text-green-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${provider.is_active ? "bg-green-500" : "bg-muted-foreground"}`}
            />
            {provider.is_active
              ? t("providers.management.status.active")
              : t("providers.management.status.inactive")}
          </span>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          {detail(t("providers.management.form.labelFirstName"), provider.first_name)}
          {detail(t("providers.management.form.labelLastName"), provider.last_name)}
          {detail(t("providers.management.form.labelEmail"), provider.email)}
          {detail(t("providers.management.form.labelPhone"), provider.phone)}
          {detail(t("providers.management.form.labelSpecialty"), provider.specialty)}
          {detail(t("providers.management.form.labelLicense"), provider.license_number)}
          {detail(t("providers.management.list.createdAt", { date: "" }), fmtDate(provider.created_at))}
          {detail(t("providers.management.list.updatedAt", { date: "" }), fmtDate(provider.updated_at))}
        </div>

        <div className="flex gap-3 justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("providers.management.viewModal.btnClose")}
          </Button>
          <Button variant="default" iconName="Edit" iconPosition="left" onClick={() => onEdit(provider)}>
            {t("providers.management.list.btnEdit")}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const ProvidersManagement = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "active" | "inactive"
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [providerToView, setProviderToView] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialty: "",
    license_number: "",
    is_active: true,
  });

  const {
    providers,
    loading,
    isSubmitting,
    isDeleting,
    fetchProviders,
    createProvider,
    updateProvider,
    toggleProviderStatus,
    deleteProvider,
  } = useProviders();

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // ─── Form helpers ────────────────────────────────────────────────────────────
  const EMPTY_FORM = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialty: "",
    license_number: "",
    is_active: true,
  };

  const openForm = (provider = null) => {
    setFormError(null);
    setProviderToView(null);
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        first_name: provider.first_name || "",
        last_name: provider.last_name || "",
        email: provider.email || "",
        phone: provider.phone || "",
        specialty: provider.specialty || "",
        license_number: provider.license_number || "",
        is_active: provider.is_active ?? true,
      });
    } else {
      setEditingProvider(null);
      setFormData(EMPTY_FORM);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProvider(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  };

  const handleFieldChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      specialty: formData.specialty.trim(),
      license_number: formData.license_number.trim(),
      is_active: formData.is_active,
    };

    if (!payload.first_name || !payload.last_name) {
      setFormError(t("providers.management.form.errorNameRequired"));
      return;
    }
    if (!payload.specialty) {
      setFormError(t("providers.management.form.errorSpecialtyRequired"));
      return;
    }
    if (!payload.license_number) {
      setFormError(t("providers.management.form.errorLicenseRequired"));
      return;
    }

    const result = editingProvider
      ? await updateProvider(editingProvider.id, payload)
      : await createProvider(payload);

    if (result?.success) {
      closeForm();
    } else {
      setFormError(result?.error || t("providers.management.form.errorUnexpected"));
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async (id) => {
    const result = await deleteProvider(id);
    if (result?.success) setProviderToDelete(null);
  };

  // ─── Filtering ────────────────────────────────────────────────────────────────
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const filteredProviders = providers.filter((p) => {
    const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      p.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.license_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && p.is_active) ||
      (filterStatus === "inactive" && !p.is_active);

    return matchesSearch && matchesStatus;
  });

  // ─── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t("providers.management.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          {/* Status filter */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm flex-shrink-0">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {t(`providers.management.filter.${status}`)}
              </button>
            ))}
          </div>
        </div>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={() => (showForm && !editingProvider ? closeForm() : openForm())}
          className="w-full sm:w-auto"
        >
          {t("providers.management.newProviderBtn")}
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: t("providers.management.stats.total"),
            value: providers.length,
            icon: "Users",
            color: "text-primary bg-primary/10",
          },
          {
            label: t("providers.management.stats.active"),
            value: providers.filter((p) => p.is_active).length,
            icon: "UserCheck",
            color: "text-green-600 bg-green-100",
          },
          {
            label: t("providers.management.stats.inactive"),
            value: providers.filter((p) => !p.is_active).length,
            icon: "UserX",
            color: "text-muted-foreground bg-muted",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-3 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
              <Icon name={stat.icon} size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground leading-none">{stat.value}</p>
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">
              {editingProvider
                ? t("providers.management.form.titleEdit")
                : t("providers.management.form.titleCreate")}
            </h4>
            <Button variant="ghost" size="icon" iconName="X" onClick={closeForm} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Names */}
              <Input
                label={t("providers.management.form.labelFirstName")}
                type="text"
                placeholder={t("providers.management.form.placeholderFirstName")}
                required
                value={formData.first_name}
                onChange={(e) => handleFieldChange("first_name", e.target.value)}
              />
              <Input
                label={t("providers.management.form.labelLastName")}
                type="text"
                placeholder={t("providers.management.form.placeholderLastName")}
                required
                value={formData.last_name}
                onChange={(e) => handleFieldChange("last_name", e.target.value)}
              />
              {/* Contact */}
              <Input
                label={t("providers.management.form.labelEmail")}
                type="email"
                placeholder={t("providers.management.form.placeholderEmail")}
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
              <Input
                label={t("providers.management.form.labelPhone")}
                type="tel"
                placeholder={t("providers.management.form.placeholderPhone")}
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
              {/* Professional */}
              <Input
                label={t("providers.management.form.labelSpecialty")}
                type="text"
                placeholder={t("providers.management.form.placeholderSpecialty")}
                required
                value={formData.specialty}
                onChange={(e) => handleFieldChange("specialty", e.target.value)}
              />
              <Input
                label={t("providers.management.form.labelLicense")}
                type="text"
                placeholder={t("providers.management.form.placeholderLicense")}
                required
                value={formData.license_number}
                onChange={(e) => handleFieldChange("license_number", e.target.value)}
              />
              {/* ID (read-only on edit) */}
              {editingProvider && (
                <Input
                  label={t("providers.management.form.labelId")}
                  type="text"
                  value={`#${editingProvider.id}`}
                  disabled
                  className="opacity-50"
                />
              )}
              {/* is_active toggle */}
              <div className="flex items-center gap-3 md:col-span-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_active}
                  onClick={() => handleFieldChange("is_active", !formData.is_active)}
                  className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    formData.is_active ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-foreground">
                  {formData.is_active
                    ? t("providers.management.status.active")
                    : t("providers.management.status.inactive")}
                </span>
              </div>

              {formError && (
                <p className="text-red-500 text-xs md:col-span-2">{formError}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" onClick={closeForm}>
                {t("providers.management.form.btnCancel")}
              </Button>
              <Button variant="default" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("providers.management.form.btnSaving")
                  : editingProvider
                    ? t("providers.management.form.btnSave")
                    : t("providers.management.form.btnCreate")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Provider list */}
      <div className="space-y-3">
        {filteredProviders.map((provider) => {
          const fullName =
            `${provider.first_name ?? ""} ${provider.last_name ?? ""}`.trim() || "—";
          const initials = [provider.first_name?.[0], provider.last_name?.[0]]
            .filter(Boolean)
            .join("")
            .toUpperCase() || "?";

          return (
            <div
              key={provider.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Left: avatar + info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar / initials */}
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-primary text-sm">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + status badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm md:text-base text-foreground">{fullName}</h4>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          provider.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            provider.is_active ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                        {provider.is_active
                          ? t("providers.management.status.active")
                          : t("providers.management.status.inactive")}
                      </span>
                    </div>

                    {/* Specialty + license */}
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                        <Icon name="Stethoscope" size={11} />
                        {provider.specialty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="BadgeCheck" size={11} />
                        {provider.license_number}
                      </span>
                    </div>

                    {/* Contact + dates */}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {provider.email && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Mail" size={11} />
                          {provider.email}
                        </span>
                      )}
                      {provider.phone && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Phone" size={11} />
                          {provider.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {t("providers.management.list.createdAt", {
                          date: fmtDate(provider.created_at),
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("providers.management.list.updatedAt", {
                          date: fmtDate(provider.updated_at),
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    className="flex-1 lg:flex-none"
                    onClick={() => setProviderToView(provider)}
                  >
                    {t("providers.management.list.btnView")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Edit"
                    className="flex-1 lg:flex-none"
                    onClick={() => openForm(provider)}
                  >
                    {t("providers.management.list.btnEdit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName={provider.is_active ? "ToggleRight" : "ToggleLeft"}
                    onClick={() => toggleProviderStatus(provider.id, provider.is_active)}
                    className={
                      provider.is_active
                        ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                    title={
                      provider.is_active
                        ? t("providers.management.list.btnDeactivate")
                        : t("providers.management.list.btnActivate")
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="Trash2"
                    onClick={() => setProviderToDelete(provider)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <Icon name="UserX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery || filterStatus !== "all"
              ? t("providers.management.list.emptySearch")
              : t("providers.management.list.emptyDefault")}
          </p>
        </div>
      )}

      {/* Modals */}
      {providerToView && (
        <ViewProviderModal
          provider={providerToView}
          onClose={() => setProviderToView(null)}
          onEdit={(p) => {
            setProviderToView(null);
            openForm(p);
          }}
        />
      )}

      {providerToDelete && (
        <DeleteProviderModal
          provider={providerToDelete}
          onClose={() => setProviderToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ProvidersManagement;
