// src/pages/settings-panel/components/ServicesManagement.jsx
import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useTranslation } from "react-i18next";
import DeleteCategoryModal from "@/pages/settings-panel/components/DeleteCategoryModal";
import { useServices } from "@/hooks/ServiceCategoriesHooks";

const ServicesManagement = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const {
    categories,
    loading,
    isSubmitting,
    isDeleting,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useServices();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openForm = (category = null) => {
    setFormError(null);
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name || "", description: category.description || "" });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormError(null);
  };

  const fmtDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      setFormError(t("services.management.form.errorNameRequired"));
      return;
    }

    const result = editingCategory
      ? await updateCategory(editingCategory.id, { name, description })
      : await createCategory({ name, description });

    if (result?.success) {
      closeForm();
    } else {
      setFormError(result?.error || t("services.management.form.errorUnexpected"));
    }
  };

  const handleConfirmDelete = async (id) => {
    const result = await deleteCategory(id);
    if (result?.success) setCategoryToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y acción */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 w-full lg:w-auto">
          <Input
            type="search"
            placeholder={t("services.management.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => (showForm && !editingCategory ? closeForm() : openForm())}
          className="w-full sm:w-auto"
        >
          {t("services.management.newCategoryBtn")}
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 md:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-semibold text-base text-foreground">
              {editingCategory ? t("services.management.form.titleEdit") : t("services.management.form.titleCreate")}
            </h4>
            <Button variant="ghost" size="icon" iconName="X" onClick={closeForm} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("services.management.form.labelName")}
                type="text"
                placeholder={t("services.management.form.placeholderName")}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label={t("services.management.form.labelId")}
                type="text"
                value={editingCategory ? `#${editingCategory.id}` : t("services.management.form.autoGeneratedId")}
                disabled
                className="opacity-50"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("services.management.form.labelDescription")}
                </label>
                <textarea
                  placeholder={t("services.management.form.placeholderDescription")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              {formError && <p className="text-red-500 text-xs md:col-span-2">{formError}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" type="button" onClick={closeForm}>
                {t("common.actions.cancel")}
              </Button>
              <Button variant="default" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.saving")
                  : editingCategory
                    ? t("services.management.form.btnSave")
                    : t("services.management.form.btnCreate")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Listado */}
      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-clinical-md transition-all duration-base"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Stethoscope" size={18} color="var(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-sm md:text-base text-foreground">{category.name}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                      <Icon name="Tag" size={11} />
                      ID {category.id}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    {category.description || t("services.management.list.noDescription")}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {t("services.management.list.createdAt", { date: fmtDate(category.created_at) })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("services.management.list.updatedAt", { date: fmtDate(category.updated_at) })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  className="flex-1 lg:flex-none"
                  onClick={() => openForm(category)}
                >
                  {t("common.actions.edit")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Trash2"
                  onClick={() => setCategoryToDelete(category)}
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FolderOff" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? t("services.management.list.emptySearch") : t("services.management.list.emptyDefault")}
          </p>
        </div>
      )}

      {categoryToDelete && (
        <DeleteCategoryModal
          category={categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
