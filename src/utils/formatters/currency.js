// utils/formatters/currency.js

/**
 * Formatea un número a moneda (Peso Argentino por defecto)
 * Ej: 24999 -> $ 24.999
 */
export const formatCurrency = (amount, currency = "ARS", locale = "es-AR") => {
  if (amount === null || amount === undefined) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
