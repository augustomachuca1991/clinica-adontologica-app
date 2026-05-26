import * as Yup from "yup";

// ─── Tipos de nota ─────────────────────────────────────────────────────────────
// Quitamos las etiquetas fijas (label) ya que las resolvemos dinámicamente con t()
export const TYPE_CONFIG = {
  treatment: { color: "bg-blue-50 text-blue-700 border-blue-200" },
  diagnosis: { color: "bg-purple-50 text-purple-700 border-purple-200" },
  followUp: { color: "bg-amber-50 text-amber-700 border-amber-200" },
  prescription: { color: "bg-green-50 text-green-700 border-green-200" },
  observation: { color: "bg-slate-50 text-slate-600 border-slate-200" },
  progress: { color: "bg-teal-50 text-teal-700 border-teal-200" },
};

// Generamos el mapeo usando el value (la clave del objeto) como etiqueta por defecto (fallback)
export const NOTE_TYPES = Object.keys(TYPE_CONFIG).map((value) => ({
  value,
  label: value,
}));

export const FILTER_TYPES = [{ value: "all", label: "all" }, ...NOTE_TYPES];

export const PRIVACY_OPTIONS = [
  { value: "all", label: "all" },
  { value: "public", label: "public" },
  { value: "private", label: "private" },
];

// ─── Filtros e Iniciales ───────────────────────────────────────────────────────
export const INITIAL_FILTERS = { search: "", type: "all", privacy: "all" };

export const NOTE_FORM_INITIAL_VALUES = {
  content: "",
  type: "treatment",
  isPrivate: false,
};

// ─── Schema de validación reactivo ─────────────────────────────────────────────
// Recibe 't' desde el componente para que los errores cambien en caliente
export const getNoteValidationSchema = (t) =>
  Yup.object({
    content: Yup.string()
      .trim()
      .min(3, t("clinicalNotes.validation.contentMin"))
      .required(t("clinicalNotes.validation.contentRequired")),
    type: Yup.string()
      .oneOf(Object.keys(TYPE_CONFIG), t("clinicalNotes.validation.typeInvalid"))
      .required(t("clinicalNotes.validation.typeRequired")),
    isPrivate: Yup.boolean().required(),
  });

// ─── Formateo de fechas adaptado al Localizador ────────────────────────────────
// Usamos undefined en la configuración regional para que tome automáticamente la del navegador/i18next
export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "—";
  }
};

// ─── Filtrado de notas ─────────────────────────────────────────────────────────
export const filterNotes = (notes, { search, type, privacy }) =>
  notes.filter((n) => {
    if (type !== "all" && n.type !== type) return false;
    if (privacy === "private" && !n.is_private) return false;
    if (privacy === "public" && n.is_private) return false;
    if (search && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

// ─── Cómputo de Estadísticas ───────────────────────────────────────────────────
export const computeStats = (notes) => {
  const total = notes.length;
  const privadas = notes.filter((n) => n.is_private).length;

  // Inicializamos contadores por cada tipo registrado en TYPE_CONFIG
  const porTipo = Object.keys(TYPE_CONFIG).reduce(
    (acc, k) => ({ ...acc, [k]: notes.filter((n) => n.type === k).length }),
    {}
  );

  // Obtenemos el tipo con mayor cantidad de notas de forma limpia
  const [topKey] = Object.entries(porTipo).sort((a, b) => b[1] - a[1])[0] ?? [];

  return {
    total,
    privadas,
    publicas: total - privadas,
    // CRUCIAL: Devolvemos la key pura ('treatment', 'diagnosis') en lugar de texto plano.
    // El componente StatsBar se encargará de pasarle esta key a t()
    topType: topKey || null,
  };
};
