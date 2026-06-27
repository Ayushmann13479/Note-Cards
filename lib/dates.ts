export function todayDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function isDueTodayOrEarlier(dateString: string, today = todayDateString()) {
  return dateString <= today;
}

export function daysUntil(dateString: string, today = todayDateString()) {
  const start = new Date(`${today}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.round((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatRelativeReviewDate(dateString: string, today = todayDateString()) {
  const delta = daysUntil(dateString, today);

  if (delta < 0) {
    return "Overdue";
  }

  if (delta === 0) {
    return "Due today";
  }

  if (delta === 1) {
    return "Due tomorrow";
  }

  return `Due in ${delta} days`;
}
