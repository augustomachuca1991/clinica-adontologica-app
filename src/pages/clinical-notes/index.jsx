import { useState, useEffect, useCallback } from "react";
import { useClinicalNotes } from "@/hooks/ClinicalNotesHooks";

// ─── Iconos inline (lucide-style, sin dependencia extra) ──────────────────────
const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    Plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    Edit2: (
      <>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </>
    ),
    Trash2: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    ),
    Eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    EyeOff: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
    Lock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    Unlock: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ),
    X: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    ChevronDown: (
      <>
        <polyline points="6 9 12 15 18 9" />
      </>
    ),
    FileText: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
    RefreshCw: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </>
    ),
    Check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    AlertCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    Search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    Filter: (
      <>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </>
    ),
    Stethoscope: (
      <>
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

// ─── Badge de tipo de nota ─────────────────────────────────────────────────────
const TYPE_CONFIG = {
  treatment: { label: "Tratamiento", color: "bg-blue-50 text-blue-700 border-blue-200" },
  diagnosis: { label: "Diagnóstico", color: "bg-purple-50 text-purple-700 border-purple-200" },
  followUp: { label: "Seguimiento", color: "bg-amber-50 text-amber-700 border-amber-200" },
  prescription: { label: "Prescripción", color: "bg-green-50 text-green-700 border-green-200" },
  observation: { label: "Observación", color: "bg-slate-50 text-slate-600 border-slate-200" },
  progress: { label: "Progreso", color: "bg-teal-50 text-teal-700 border-teal-200" },
};

const TypeBadge = ({ type }) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.observation;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ─── Formato de fecha ──────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

// ─── Modal reutilizable ────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative z-10 w-full ${maxWidth} bg-card border border-border rounded-xl shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-headline font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ─── Formulario de nota (Create / Edit) ───────────────────────────────────────
const NOTE_TYPES = Object.entries(TYPE_CONFIG).map(([value, { label }]) => ({ value, label }));

const NoteForm = ({ initial = {}, onSubmit, onCancel, isSubmitting }) => {
  const [form, setForm] = useState({
    content: initial.content || "",
    type: initial.type || "treatment",
    isPrivate: initial.is_private ?? false,
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target ? e.target.value : e }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Tipo de nota</label>
        <div className="relative">
          <select
            value={form.type}
            onChange={set("type")}
            className="w-full appearance-none bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-8"
          >
            {NOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Icon
            name="ChevronDown"
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Contenido */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Contenido</label>
        <textarea
          value={form.content}
          onChange={set("content")}
          rows={5}
          placeholder="Escribí el contenido de la nota clínica..."
          className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          required
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">{form.content.length} caracteres</p>
      </div>

      {/* Privacidad */}
      <button
        type="button"
        onClick={() => setForm((f) => ({ ...f, isPrivate: !f.isPrivate }))}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
          form.isPrivate
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-muted border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon name={form.isPrivate ? "Lock" : "Unlock"} size={15} />
        {form.isPrivate ? "Nota privada — solo visible para vos" : "Nota pública — visible para el equipo"}
        <span
          className={`ml-auto w-8 h-4 rounded-full transition-colors relative ${form.isPrivate ? "bg-amber-400" : "bg-muted-foreground/30"}`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${form.isPrivate ? "left-4" : "left-0.5"}`}
          />
        </span>
      </button>

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !form.content.trim()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Icon name="Check" size={14} />
              Guardar nota
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Modal de detalle ──────────────────────────────────────────────────────────
const NoteDetailModal = ({ note, open, onClose, onEdit, onDelete, onTogglePrivate, isOwn }) => (
  <Modal open={open} onClose={onClose} title="Detalle de nota" maxWidth="max-w-xl">
    {note && (
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={note.type} />
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${note.is_private ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}
          >
            <Icon name={note.is_private ? "Lock" : "Unlock"} size={11} />
            {note.is_private ? "Privada" : "Pública"}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
        </div>

        <div className="bg-muted rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap min-h-[100px]">
          {note.content}
        </div>

        {note.updated_at && note.updated_at !== note.created_at && (
          <p className="text-xs text-muted-foreground">Última edición: {formatDate(note.updated_at)}</p>
        )}

        {isOwn && (
          <div className="flex gap-2 pt-1 border-t border-border">
            <button
              onClick={() => onTogglePrivate(note)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name={note.is_private ? "Unlock" : "Lock"} size={13} />
              {note.is_private ? "Hacer pública" : "Hacer privada"}
            </button>
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name="Edit2" size={13} />
              Editar
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-all ml-auto"
            >
              <Icon name="Trash2" size={13} />
              Eliminar
            </button>
          </div>
        )}
      </div>
    )}
  </Modal>
);

// ─── Tarjeta de nota ───────────────────────────────────────────────────────────
const NoteCard = ({ note, onView, onEdit, onDelete, onTogglePrivate, isOwn }) => {
  const preview = note.content.length > 140 ? note.content.slice(0, 140) + "…" : note.content;

  return (
    <div className="group bg-card border border-border rounded-lg p-4 md:p-5 shadow-clinical-sm hover:shadow-clinical transition-shadow duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={note.type} />
          {note.is_private && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-amber-600 bg-amber-50 border border-amber-200">
              <Icon name="Lock" size={10} />
              Privada
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{formatDate(note.created_at)}</span>
      </div>

      {/* Contenido preview */}
      <p className="text-sm text-foreground leading-relaxed flex-1">{preview}</p>

      {/* Footer / acciones */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border/60">
        <button
          onClick={() => onView(note)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Icon name="Eye" size={13} />
          Ver
        </button>

        {isOwn && (
          <>
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name="Edit2" size={13} />
              Editar
            </button>
            <button
              onClick={() => onTogglePrivate(note)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Icon name={note.is_private ? "Unlock" : "Lock"} size={13} />
              {note.is_private ? "Publicar" : "Privatizar"}
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-all ml-auto"
            >
              <Icon name="Trash2" size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
const ConfirmDeleteModal = ({ open, onClose, onConfirm, isSubmitting }) => (
  <Modal open={open} onClose={onClose} title="Eliminar nota" maxWidth="max-w-sm">
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <Icon name="AlertCircle" size={18} className="text-red-600 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700">
          Esta acción no se puede deshacer. La nota clínica será eliminada permanentemente.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Icon name="Trash2" size={14} />
          )}
          Eliminar
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Filtros ───────────────────────────────────────────────────────────────────
const FILTER_TYPES = [{ value: "all", label: "Todos" }, ...NOTE_TYPES];

const NotesFilters = ({ search, type, privacy, onChange }) => (
  <div className="flex flex-col sm:flex-row gap-3">
    {/* Search */}
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
        placeholder="Buscar en notas..."
        className="w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>
    {/* Tipo */}
    <div className="relative">
      <select
        value={type}
        onChange={(e) => onChange("type", e.target.value)}
        className="appearance-none bg-muted border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      >
        {FILTER_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <Icon
        name="ChevronDown"
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
    {/* Privacidad */}
    <div className="relative">
      <select
        value={privacy}
        onChange={(e) => onChange("privacy", e.target.value)}
        className="appearance-none bg-muted border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      >
        <option value="all">Todas</option>
        <option value="public">Públicas</option>
        <option value="private">Privadas</option>
      </select>
      <Icon
        name="ChevronDown"
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  </div>
);

// ─── Stats ─────────────────────────────────────────────────────────────────────
const StatsBar = ({ notes }) => {
  const total = notes.length;
  const privadas = notes.filter((n) => n.is_private).length;
  const porTipo = Object.keys(TYPE_CONFIG).reduce(
    (acc, k) => ({ ...acc, [k]: notes.filter((n) => n.type === k).length }),
    {}
  );
  const masUsado = Object.entries(porTipo).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[
        { label: "Total de notas", value: total, icon: "FileText" },
        { label: "Notas privadas", value: privadas, icon: "Lock" },
        { label: "Notas públicas", value: total - privadas, icon: "Unlock" },
        { label: "Tipo más frecuente", value: masUsado ? TYPE_CONFIG[masUsado[0]]?.label : "—", icon: "Stethoscope" },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-lg p-4 shadow-clinical-sm">
          <div className="flex items-center gap-2 mb-1">
            <Icon name={s.icon} size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <p className="text-2xl font-headline font-bold text-foreground">{s.value}</p>
        </div>
      ))}
    </div>
  );
};

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
/**
 * ClinicalNotesPage
 *
 * Props:
 *   recordId   — UUID del registro clínico al que pertenecen las notas (requerido)
 *   providerId — UUID del provider logueado (requerido para crear notas)
 */
export default function ClinicalNotesPage({ recordId, providerId }) {
  const {
    notes,
    loading,
    isSubmitting,
    fetchNotes,
    fetchCurrentProvider,
    fetchAllProviderNotes,
    createNote,
    updateNote,
    togglePrivate,
    deleteNote,
    isOwnNote,
  } = useClinicalNotes();

  // Filtros
  const [filters, setFilters] = useState({ search: "", type: "all", privacy: "all" });
  const handleFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  // Modales
  const [createOpen, setCreateOpen] = useState(false);
  const [editNote, setEditNote] = useState(null); // nota a editar
  const [detailNote, setDetailNote] = useState(null); // nota en detalle
  const [deleteId, setDeleteId] = useState(null); // id a eliminar

  useEffect(() => {
    const init = async () => {
      const providerId = await fetchCurrentProvider();
      if (providerId) fetchAllProviderNotes(providerId);
    };
    init();
  }, []);

  // ── Handlers CRUD ──────────────────────────────────────────────────────────
  const handleCreate = async ({ content, type, isPrivate }) => {
    const res = await createNote({
      recordId: null, // sin registro clínico asociado
      providerId: currentProviderId, // ← esto faltaba
      content,
      type,
      isPrivate,
    });
    if (res.success) {
      setCreateOpen(false);
      fetchAllProviderNotes(currentProviderId); // refrescar lista
    }
  };

  const handleUpdate = async ({ content, type, isPrivate }) => {
    if (!editNote) return;
    const res = await updateNote(editNote.id, { content, type, isPrivate });
    if (res.success) setEditNote(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteNote(deleteId);
    setDeleteId(null);
    setDetailNote(null);
  };

  const handleTogglePrivate = async (note) => {
    await togglePrivate(note);
  };

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const filtered = notes.filter((n) => {
    if (filters.type !== "all" && n.type !== filters.type) return false;
    if (filters.privacy === "private" && !n.is_private) return false;
    if (filters.privacy === "public" && n.is_private) return false;
    if (filters.search && !n.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
            Notas Clínicas
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Historial de notas clínicas del registro</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-clinical-sm"
        >
          <Icon name="Plus" size={16} />
          Nueva nota
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
            <h2 className="text-lg md:text-xl font-headline font-semibold text-foreground">Listado de notas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} {filtered.length === 1 ? "nota encontrada" : "notas encontradas"}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin mb-4">
              <Icon name="RefreshCw" size={32} />
            </div>
            <p className="text-sm">Cargando notas clínicas…</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty */
          <div className="text-center py-16">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <h3 className="text-lg font-headline font-semibold text-foreground mb-2">
              {notes.length === 0 ? "Sin notas aún" : "Sin resultados"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {notes.length === 0
                ? "Creá la primera nota clínica para este registro."
                : "Probá ajustando los filtros de búsqueda."}
            </p>
            {notes.length === 0 ? (
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                <Icon name="Plus" size={14} />
                Nueva nota
              </button>
            ) : (
              <button
                onClick={() => setFilters({ search: "", type: "all", privacy: "all" })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Icon name="RefreshCw" size={14} />
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          /* Grid de cards */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isOwn={isOwnNote(note)}
                onView={(n) => setDetailNote(n)}
                onEdit={(n) => setEditNote(n)}
                onDelete={(id) => setDeleteId(id)}
                onTogglePrivate={handleTogglePrivate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: Crear ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nueva nota clínica">
        <NoteForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} isSubmitting={isSubmitting} />
      </Modal>

      {/* ── Modal: Editar ── */}
      <Modal open={!!editNote} onClose={() => setEditNote(null)} title="Editar nota clínica">
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
        onEdit={(n) => {
          setDetailNote(null);
          setEditNote(n);
        }}
        onDelete={(id) => {
          setDeleteId(id);
        }}
        onTogglePrivate={handleTogglePrivate}
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
