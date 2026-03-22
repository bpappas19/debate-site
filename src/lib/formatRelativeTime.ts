/**
 * Compact social-style relative time for debate cards.
 * Pass `now` for tests only.
 */
export function formatRelativeTimeShort(date: Date, now: Date = new Date()): string {
  const ms = now.getTime() - date.getTime();
  const s = Math.floor(ms / 1000);
  if (s < 0) return "just now";
  if (s < 45) return "just now";
  if (s < 3600) {
    const m = Math.floor(s / 60);
    return m < 1 ? "just now" : `${m}m ago`;
  }
  if (s < 86400) {
    const h = Math.floor(s / 3600);
    return `${h}h ago`;
  }
  const d = Math.floor(s / 86400);
  return `${d}d ago`;
}
