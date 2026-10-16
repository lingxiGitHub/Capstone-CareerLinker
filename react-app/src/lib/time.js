const UNITS = [
  ["y", 365 * 24 * 3600],
  ["mo", 30 * 24 * 3600],
  ["w", 7 * 24 * 3600],
  ["d", 24 * 3600],
  ["h", 3600],
  ["m", 60],
];

/** LinkedIn-style compact age: "now", "5m", "3h", "2d", "1w", "4mo". */
export function timeAgo(iso) {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  for (const [label, size] of UNITS) {
    if (secs >= size) return `${Math.floor(secs / size)}${label}`;
  }
  return "now";
}

/** Longer form for jobs: "2 days ago", "1 week ago". */
export function timeAgoLong(iso) {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const names = { y: "year", mo: "month", w: "week", d: "day", h: "hour", m: "minute" };
  for (const [label, size] of UNITS) {
    if (secs >= size) {
      const n = Math.floor(secs / size);
      return `${n} ${names[label]}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}

export function monthYear(isoDate) {
  if (!isoDate) return "Present";
  const [y, m] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** "2 yrs 3 mos" between two YYYY-MM-DD dates (end defaults to today). */
export function duration(start, end) {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
  const yrs = Math.floor(months / 12);
  months %= 12;
  const parts = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

export function messageTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  const days = (now - d) / 86400000;
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
