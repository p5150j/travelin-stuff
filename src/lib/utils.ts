import { Timestamp } from "firebase/firestore";

export function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "Jun 14" — compact enough for a dense archive row, where the year is already
    carried by the group heading. */
export function formatDayMonth(ts: Timestamp | null | undefined): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length = 160): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

/**
 * City name → URL segment. Was inlined in six places; any change to the rule
 * had to be made in all of them or links silently 404.
 */
export function citySlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-");
}

/**
 * "Mar 2025" · "Mar – Jun 2025" · "Nov 2024 – Feb 2025".
 * Collapses to a single month when the stay didn't cross one, and only repeats
 * the year when the range spans two.
 */
export function formatDateRange(from: Timestamp | null, to: Timestamp | null): string {
  const start = from ?? to;
  const end = to ?? from;
  if (!start || !end) return "";

  const a = start.toDate();
  const b = end.toDate();
  const monthYear = { month: "short", year: "numeric" } as const;

  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
    return a.toLocaleDateString("en-US", monthYear);
  }
  if (a.getFullYear() === b.getFullYear()) {
    return `${a.toLocaleDateString("en-US", { month: "short" })} – ${b.toLocaleDateString("en-US", monthYear)}`;
  }
  return `${a.toLocaleDateString("en-US", monthYear)} – ${b.toLocaleDateString("en-US", monthYear)}`;
}
