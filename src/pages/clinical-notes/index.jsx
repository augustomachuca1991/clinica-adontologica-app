import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useClinicalNotes } from "@/hooks/ClinicalNotesHooks";

import Icon from "@/components/AppIcon";
import NoteCard from "@/pages/clinical-notes/components/NoteCard";
import NoteForm from "@/pages/clinical-notes/components/NoteForm";
import NotesFilters from "@/pages/clinical-notes/components/NotesFilters";
import StatsBar from "@/pages/clinical-notes/components/StatsBar";
import Modal from "@/pages/clinical-notes/components/Modal";
import NoteDetailModal from "@/pages/clinical-notes/components/NoteDetailModal";
import ConfirmDeleteModal from "@/pages/clinical-notes/components/ConfirmDeleteModal";

import { filterNotes, INITIAL_FILTERS } from "@/utils/notesUtils/notes";

export default function ClinicalNotesPage({ providerId }) {
  const { t } = useTranslation();
  const {
    notes,
    loading,
    isSubmitting,
    fetchAllProviderNotes,
    createNote,
    updateNote,
    togglePrivate,
    deleteNote,
    isOwnNote,
  } = useClinicalNotes();

  // ── Filtros ────────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleFilter = useCallback((key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // ── Notas filtradas ────────────────────────────────────────────────────────
  const filtered = useMemo(() => filterNotes(notes, filters), [notes, filters]);

  // ── Modales ────────────────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [detailNote, setDetailNote] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (providerId) fetchAllProviderNotes(providerId);
  }, [providerId, fetchAllProviderNotes]);

  // ── Handlers CRUD ──────────────────────────────────────────────────────────
  const handleCreate = useCallback(
    async ({ content, type, isPrivate }) => {
      const res = await createNote({ providerId, content, type, isPrivate });
      if (res.success) {
        setCreateOpen(false);
        fetchAllProviderNotes(providerId);
      }
    },
    [providerId, createNote, fetchAllProviderNotes]
  );

  const handleUpdate = useCallback(
    async (values) => {
      if (!editNote) return;
      const res = await updateNote(editNote.id, values);
      if (res.success) setEditNote(null);
    },
    [editNote, updateNote]
  );

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    await deleteNote(deleteId);
    setDeleteId(null);
    setDetailNote(null);
  }, [deleteId, deleteNote]);

  // ── Helpers de navegación entre modales ───────────────────────────────────
  const handleOpenEdit = useCallback((note) => {
    setDetailNote(null);
    setEditNote(note);
  }, []);

  const handleOpenDelete = useCallback((id) => {
    setDeleteId(id);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
            {t("clinicalNotes.title")}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">{t("clinicalNotes.subtitle")}</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-clinical-sm"
        >
          <Icon name="Plus" size={16} />
          {t("clinicalNotes.buttonNew")}
        </button>
      </div>

      {/* ── Stats ── */}
      {!loading && notes.length > 0 && <StatsBar notes={notes} />}

      {/* ── Filtros ── */}
      <NotesFilters search={filters.search} type={filters.type} privacy={filters.privacy} onChange={handleFilter} />

      {/* ── Lista ── */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-clinical-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">
              {t("clinicalNotes.listTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t("clinicalNotes.count", { count: filtered.length })}</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin mb-4">
              <Icon name="RefreshCw" size={32} />
            </div>
            <p className="text-sm">{t("clinicalNotes.loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <h3 className="text-lg font-headline font-semibold text-foreground mb-2">
              {notes.length === 0
                ? t("clinicalNotes.emptyState.noNotesTitle")
                : t("clinicalNotes.emptyState.noResultsTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {notes.length === 0
                ? t("clinicalNotes.emptyState.noNotesDescription")
                : t("clinicalNotes.emptyState.noResultsDescription")}
            </p>
            {notes.length === 0 ? (
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <Icon name="Plus" size={14} />
                {t("clinicalNotes.buttonNew")}
              </button>
            ) : (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Icon name="RefreshCw" size={14} />
                {t("clinicalNotes.emptyState.buttonClear")}
              </button>
            )}
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isOwn={isOwnNote(note)}
                onView={setDetailNote}
                onEdit={setEditNote}
                onDelete={handleOpenDelete}
                onTogglePrivate={togglePrivate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: Crear ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t("clinicalNotes.modals.createTitle")}>
        <NoteForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isSubmitting={isSubmitting} />
      </Modal>

      {/* ── Modal: Editar ── */}
      <Modal open={!!editNote} onClose={() => setEditNote(null)} title={t("clinicalNotes.modals.editTitle")}>
        {editNote && (
          <NoteForm
            initial={editNote}
            onSubmit={handleUpdate}
            onCancel={() => setEditNote(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* ── Modal: Detalle ── */}
      <NoteDetailModal
        open={!!detailNote}
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onTogglePrivate={togglePrivate}
        isOwn={detailNote ? isOwnNote(detailNote) : false}
      />

      {/* ── Modal: Confirmar eliminación ── */}
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
