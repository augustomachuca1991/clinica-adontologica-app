export const formatDuration = (totalMinutes) => {
  if (!totalMinutes || isNaN(totalMinutes)) return "N/A";

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours} ${hours === 1 ? "hora" : "horas"}`;
};
