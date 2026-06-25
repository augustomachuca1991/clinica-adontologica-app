import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import TypeBadge from "@/pages/clinical-notes/components/TypeBadge";
import { formatDate } from "@/utils/notesUtils/notes";

const NoteCard = memo(({ note, onView, onEdit, onDelete, onTogglePrivate, isOwn }) => {
  const { t } = useTranslation();

  const preview = note.content.length > 140 ? note.content.slice(0, 140) + "…" : note.content;

  return (
    <div className="group bg-card border border-border rounded-lg p-4 md:p-5 shadow-clinical-sm hover:shadow-clinical transition-shadow duration-200 flex flex-col gap-3">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={note.type} />
          {note.is_private && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-amber-600 bg-amber-50 border border-amber-200">
              <Icon name="Lock" size={10} />
              {t("clinicalNotes.card.private")}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{formatDate(note.created_at)}</span>
      </div>

      {/* ── Preview ── */}
      <p className="text-sm text-foreground leading-relaxed flex-1">{preview}</p>

      {/* ── Acciones ── */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border/60">
        <button
          type="button"
          onClick={() => onView(note)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Icon name="Eye" size={13} />
          {t("clinicalNotes.card.actionView")}
        </button>

        {isOwn && (
          <>
            <button
              type="button"
              onClick={() => onEdit(note)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name="Edit2" size={13} />
              {t("common.actions.edit")}
            </button>

            <button
              type="button"
              onClick={() => onTogglePrivate(note)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name={note.is_private ? "Unlock" : "Lock"} size={13} />
              {note.is_private ? t("clinicalNotes.card.actionMakePublic") : t("clinicalNotes.card.actionMakePrivate")}
            </button>

            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label={t("common.actions.delete")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-all ml-auto"
            >
              <Icon name="Trash2" size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
});

NoteCard.displayName = "NoteCard";

export default NoteCard;
