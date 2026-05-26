import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import Icon from "@/components/AppIcon";
import { FILTER_TYPES, PRIVACY_OPTIONS } from "@/utils/notesUtils/notes";

const NotesFilters = memo(({ search, type, privacy, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* ── Search Input ── */}
      <div className="relative flex-1">
        <Icon
          name="Search"
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onChange("search", e.target.value)}
          placeholder={t("clinicalNotes.filters.searchPlaceholder")}
          className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {/* ── Selector de Tipo ── */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => onChange("type", e.target.value)}
          className="appearance-none bg-muted border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        >
          {FILTER_TYPES.map((typeOption) => (
            <option key={typeOption.value} value={typeOption.value}>
              {t(`clinicalNotes.filters.types.${typeOption.value}`, { defaultValue: typeOption.label })}
            </option>
          ))}
        </select>
        <Icon
          name="ChevronDown"
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>

      {/* ── Selector de Privacidad ── */}
      <div className="relative">
        <select
          value={privacy}
          onChange={(e) => onChange("privacy", e.target.value)}
          className="appearance-none bg-muted border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        >
          {PRIVACY_OPTIONS.map((privacyOption) => (
            <option key={privacyOption.value} value={privacyOption.value}>
              {t(`clinicalNotes.filters.privacy.${privacyOption.value}`, { defaultValue: privacyOption.label })}
            </option>
          ))}
        </select>
        <Icon
          name="ChevronDown"
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    </div>
  );
});

NotesFilters.displayName = "NotesFilters";

export default NotesFilters;
