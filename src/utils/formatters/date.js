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

  const date = new Date(dateString);

  // Opciones para mostrar: "10 de enero de 2026" o "January 10, 2026"
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(language, options).format(date);
};
