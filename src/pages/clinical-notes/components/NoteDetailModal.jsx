import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import { formatDate } from "@/utils/notesUtils/notes";
import Modal from "@/pages/clinical-notes/components/Modal";
import TypeBadge from "@/pages/clinical-notes/components/TypeBadge";

const NoteDetailModal = memo(({ note, open, onClose, onEdit, onDelete, onTogglePrivate, isOwn }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t("clinicalNotes.detail.title")} maxWidth="max-w-xl">
      {note && (
        <div className="space-y-4">
          {/* Badges + fecha */}
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={note.type} />
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                note.is_private
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              <Icon name={note.is_private ? "Lock" : "Unlock"} size={11} />
              {note.is_private ? t("clinicalNotes.detail.private") : t("clinicalNotes.detail.public")}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
          </div>

          {/* Contenido */}
          <div className="bg-muted rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap min-h-[100px]">
            {note.content}
          </div>

          {/* Última edición (se muestra si realmente fue modificado) */}
          {note.updated_at && note.updated_at !== note.created_at && (
            <p className="text-xs text-muted-foreground">
              {t("clinicalNotes.detail.lastEdit", { date: formatDate(note.updated_at) })}
            </p>
          )}

          {/* Acciones (solo dueño) */}
          {isOwn && (
            <div className="flex gap-2 pt-1 border-t border-border">
              <button
                type="button"
                onClick={() => onTogglePrivate(note)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Icon name={note.is_private ? "Unlock" : "Lock"} size={13} />
                {note.is_private
                  ? t("clinicalNotes.detail.actionMakePublic")
                  : t("clinicalNotes.detail.actionMakePrivate")}
              </button>

              <button
                type="button"
                onClick={() => onEdit(note)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Icon name="Edit2" size={13} />
                {t("common.actions.edit")}
              </button>

              <button
                type="button"
                onClick={() => onDelete(note.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-all ml-auto"
              >
                <Icon name="Trash2" size={13} />
                {t("common.actions.delete")}
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
});

NoteDetailModal.displayName = "NoteDetailModal";

export default NoteDetailModal;
