// utils/formatters/date.js

/**
 * ISO date (yyyy-mm-dd | yyyy-mm-ddTHH:mm:ss) → dd/mm/yyyy
 * Uso exclusivo de UI
 */
export const formatDateForUI = (isoDate) => {
  if (!isoDate) return "";

  const [datePart] = isoDate.split("T");
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
};

/**
 * ISO datetime → dd/mm/yyyy HH:mm
 * Ej: 2026-01-18T10:00:00 → 18/01/2026 10:00
 */
export const formatDateWithTimeForUI = (isoDateTime) => {
  if (!isoDateTime) return "";

  const date = new Date(isoDateTime);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * ISO date → mm/yyyy
 * Ej: 2026-01-18 → 01/2026
 */
export const formatMonthYear = (isoDate) => {
  if (!isoDate) return "";

  const [datePart] = isoDate.split("T");
  const [year, month] = datePart.split("-");

  if (!year || !month) return "";

  return `${month}/${year}`;
};

export const formatDateLang = (dateString, language = "es") => {
  if (!dateString) return "";

  try {
    // 1. Limpiamos el string por si viene con hora (ISO 8601 completo)
    const [onlyDate] = dateString.split("T");
    const parts = onlyDate.split("-");

    // Validamos que tengamos las 3 partes necesarias
    if (parts.length !== 3) return dateString;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Enero es 0 en JS
    const day = parseInt(parts[2], 10);

    // 2. Creamos el objeto Date local
    const date = new Date(year, month, day);

    // Validamos que la fecha sea válida (ej. no 31 de febrero)
    if (isNaN(date.getTime())) return dateString;

    // 3. Formateo con Intl (Estándar moderno de navegación)
    return new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Fallback al string original si algo falla
  }
};
