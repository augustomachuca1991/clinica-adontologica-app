import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { useClinicalNotes } from "@/hooks/ClinicalNotesHooks";
import { notifySuccess, notifyError, notifyConfirm } from "@/utils/notifications";

// ─── Constantes ───────────────────────────────────────────────────────────────
const NOTE_TYPES = ["treatment", "followUp", "observation", "general", "diagnosis", "prescription", "progress"];

const NOTE_TYPE_STYLES = {
  followUp: "bg-purple-100 text-purple-700 border-purple-200",
  treatment: "bg-green-100  text-green-700  border-green-200",
  observation: "bg-amber-100  text-amber-700  border-amber-200",
  general: "bg-blue-100   text-blue-700   border-blue-200",
  diagnosis: "bg-purple-50 text-purple-700 border-purple-200",
  prescription: "bg-green-50 text-green-700 border-green-200",
  progress: "bg-teal-50 text-teal-700 border-teal-200",
};
// ─── Subcomponente: formulario inline de crear / editar ───────────────────────
const NoteForm = ({ initial = null, providerId, recordId, onSave, onCancel, isSubmitting, t }) => {
  const [content, setContent] = useState(initial?.content ?? "");
  const [type, setType] = useState(initial?.type ?? "treatment");
  const [isPrivate, setIsPrivate] = useState(initial?.is_private ?? false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave({ content, type, isPrivate });
  };

  return (
    <div className="bg-muted border border-border rounded-lg p-4 space-y-3">
      {/* Tipo + privacidad */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 flex-wrap">
          {NOTE_TYPES.map((nt) => (
            <button
              key={nt}
              type="button"
              onClick={() => setType(nt)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors duration-150 font-medium
                ${type === nt ? NOTE_TYPE_STYLES[nt] : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
            >
              {t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.${nt}`)}
            </button>
          ))}
        </div>

        {/* Toggle privada */}
        <button
          type="button"
          onClick={() => setIsPrivate((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors duration-150 font-medium
            ${
              isPrivate
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
        >
          <Icon name={isPrivate ? "Lock" : "Unlock"} size={12} />
          {isPrivate
            ? t("records.recordsModal.tabs.clinicalNotes.private")
            : t("records.recordsModal.tabs.clinicalNotes.public")}
        </button>
      </div>

      {/* Textarea */}
      <textarea
        autoFocus
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("records.recordsModal.tabs.clinicalNotes.placeholder")}
        className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
      />

      {/* Acciones */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSubmitting}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          iconName={isSubmitting ? "Loader2" : "Check"}
          iconPosition="left"
        >
          {isSubmitting ? t("common.saving") : t("common.save")}
        </Button>
      </div>
    </div>
  );
};

// ─── Subcomponente: tarjeta de nota individual ────────────────────────────────
const NoteCard = ({ note, isOwn, onEdit, onDelete, onTogglePrivate, t, i18n }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`bg-muted border rounded-lg p-4 transition-all duration-150
      ${note.is_private ? "border-destructive/20 bg-destructive/5" : "border-border"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">
              {note?.provider_id ?? t("common.unknown")}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(note.created_at).toLocaleDateString(i18n.language, {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Badge tipo */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${NOTE_TYPE_STYLES[note.type] ?? NOTE_TYPE_STYLES.general}`}
          >
            {t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.${note.type}`)}
          </span>

          {/* Badge privada */}
          {note.is_private && (
            <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1">
              <Icon name="Lock" size={10} />
              {t("records.recordsModal.tabs.clinicalNotes.private")}
            </span>
          )}

          {/* Menú acciones (solo si es propia) */}
          {isOwn && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-border transition-colors"
              >
                <Icon name="MoreVertical" size={16} />
              </button>
              {menuOpen && (
                <>
                  {/* Overlay para cerrar */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-7 z-20 bg-card border border-border rounded-lg shadow-clinical-xl py-1 min-w-[140px]">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(note);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon name="Pencil" size={14} />
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onTogglePrivate(note);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon name={note.is_private ? "Unlock" : "Lock"} size={14} />
                      {note.is_private
                        ? t("records.recordsModal.tabs.clinicalNotes.makePublic")
                        : t("records.recordsModal.tabs.clinicalNotes.makePrivate")}
                    </button>
                    <div className="h-px bg-border mx-2 my-1" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(note.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                      {t("common.delete")}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
    </div>
  );
};

// ─── Componente principal: ClinicalNotesTab ───────────────────────────────────
/**
 * Uso dentro de RecordDetailsModal:
 *
 *   {activeTab === "notes" && (
 *     <ClinicalNotesTab record={record} />
 *   )}
 */
const ClinicalNotesTab = ({ record }) => {
  const { t, i18n } = useTranslation();

  const {
    notes,
    loading,
    isSubmitting,
    currentProviderId,
    fetchNotes,
    fetchCurrentProvider,
    createNote,
    updateNote,
    deleteNote,
    togglePrivate,
    isOwnNote,
  } = useClinicalNotes();

  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // nota que se está editando
  const [filterType, setFilterType] = useState("all"); // filtro activo

  // Cargar notas y provider al montar
  useEffect(() => {
    if (record?.id) {
      fetchNotes(record.id);
      fetchCurrentProvider();
    }
  }, [record?.id, fetchNotes, fetchCurrentProvider]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async ({ content, type, isPrivate }) => {
    const result = await createNote({
      recordId: record.id,
      providerId: currentProviderId,
      content,
      type,
      isPrivate,
    });
    if (result.success) {
      notifySuccess(t("records.recordsModal.tabs.clinicalNotes.createSuccess"));
      setShowCreateForm(false);
    } else {
      notifyError(result.error);
    }
  };

  const handleUpdate = async ({ content, type, isPrivate }) => {
    const result = await updateNote(editingNote.id, { content, type, isPrivate });
    if (result.success) {
      notifySuccess(t("records.recordsModal.tabs.clinicalNotes.updateSuccess"));
      setEditingNote(null);
    } else {
      notifyError(result.error);
    }
  };

  const handleDelete = (id) => {
    notifyConfirm(
      t("records.recordsModal.tabs.clinicalNotes.confirmDelete.title"),
      t("records.recordsModal.tabs.clinicalNotes.confirmDelete.description"),
      async () => {
        const result = await deleteNote(id);
        if (result.success) {
          notifySuccess(t("delete"));
        } else {
          notifyError(result.error);
        }
      }
    );
  };

  const handleTogglePrivate = async (note) => {
    const result = await togglePrivate(note);
    if (!result.success) notifyError(result.error);
  };

  // ─── Filtrado ───────────────────────────────────────────────────────────────
  const filteredNotes = filterType === "all" ? notes : notes.filter((n) => n.type === filterType);

  const typeCounts = notes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] ?? 0) + 1;
    return acc;
  }, {});

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Cabecera ── */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-headline font-semibold text-foreground">
            {t("records.recordsModal.tabs.clinicalNotes.name")}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {notes.length > 0
              ? t("records.recordsModal.tabs.clinicalNotes.noteCount", { count: notes.length })
              : t("records.recordsModal.tabs.clinicalNotes.noNotes")}
          </p>
        </div>
        {!showCreateForm && (
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => {
              setShowCreateForm(true);
              setEditingNote(null);
            }}
          >
            {t("records.recordsModal.tabs.clinicalNotes.addClinicalNote")}
          </Button>
        )}
      </div>

      {/* ── Formulario crear ── */}
      {showCreateForm && (
        <NoteForm
          providerId={currentProviderId}
          recordId={record.id}
          onSave={handleCreate}
          onCancel={() => setShowCreateForm(false)}
          isSubmitting={isSubmitting}
          t={t}
        />
      )}

      {/* ── Filtros por tipo ── */}
      {notes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType("all")}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors
              ${
                filterType === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              }`}
          >
            {t("common.all")} ({notes.length})
          </button>
          {NOTE_TYPES.filter((nt) => typeCounts[nt]).map((nt) => (
            <button
              key={nt}
              onClick={() => setFilterType(nt)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors
                ${filterType === nt ? NOTE_TYPE_STYLES[nt] : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
            >
              {t(`records.recordsModal.tabs.clinicalNotes.noteTypeOptions.${nt}`)} ({typeCounts[nt]})
            </button>
          ))}
        </div>
      )}

      {/* ── Lista de notas ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Icon name="Loader2" size={28} className="animate-spin mb-2" />
          <p className="text-sm">{t("common.loading")}</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="space-y-3">
          {filteredNotes.map((note) =>
            editingNote?.id === note.id ? (
              // Formulario de edición inline
              <NoteForm
                key={note.id}
                initial={note}
                providerId={currentProviderId}
                recordId={record.id}
                onSave={handleUpdate}
                onCancel={() => setEditingNote(null)}
                isSubmitting={isSubmitting}
                t={t}
              />
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                isOwn={isOwnNote(note)}
                onEdit={setEditingNote}
                onDelete={handleDelete}
                onTogglePrivate={handleTogglePrivate}
                t={t}
                i18n={i18n}
              />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/20 border-2 border-dashed border-border rounded-lg">
          <Icon name="Clipboard" size={32} className="mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground italic">
            {filterType !== "all"
              ? t("records.recordsModal.tabs.clinicalNotes.noNotesForType")
              : t("records.recordsModal.tabs.clinicalNotes.noNotes")}
          </p>
          {filterType !== "all" && (
            <button
              onClick={() => setFilterType("all")}
              className="mt-2 text-xs text-primary underline underline-offset-2"
            >
              {t("common.clearFilter")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicalNotesTab;
