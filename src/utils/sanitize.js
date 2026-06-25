const ENTITY_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export const escapeHtml = (str) =>
  String(str).replace(/[&<>"'\/]/g, (ch) => ENTITY_MAP[ch]);

export const stripHtml = (str) =>
  String(str).replace(/<\/?[^>]+(>|$)/g, "");

export const sanitizeText = (str) =>
  escapeHtml(stripHtml(String(str))).trim();
