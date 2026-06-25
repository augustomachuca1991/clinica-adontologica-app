export const STATUSES = {
  PLANNED: "planned",
  IN_PROGRESS: "inProgress",
  COMPLETED: "completed",
};

const TRANSITIONS = {
  [STATUSES.PLANNED]: [STATUSES.IN_PROGRESS],
  [STATUSES.IN_PROGRESS]: [STATUSES.COMPLETED],
  [STATUSES.COMPLETED]: [],
};

const ORDER = [STATUSES.PLANNED, STATUSES.IN_PROGRESS, STATUSES.COMPLETED];

export const canTransition = (from, to) => {
  if (!from || !to) return false;
  return TRANSITIONS[from]?.includes(to) ?? false;
};

export const getNextStatus = (current) => {
  const next = TRANSITIONS[current];
  return next?.length > 0 ? next[0] : null;
};

export const getAvailableStatuses = (current, isNew = false) => {
  if (isNew) return [STATUSES.PLANNED, STATUSES.IN_PROGRESS, STATUSES.COMPLETED];
  const available = [current];
  const next = getNextStatus(current);
  if (next) available.push(next);
  return available;
};

export const getStatusIndex = (status) => ORDER.indexOf(status);

export const isTerminal = (status) => status === STATUSES.COMPLETED;
