/**
 * Public site origin for absolute URLs (metadata, share). No trailing slash.
 * Returns "" when neither NEXT_PUBLIC_SITE_URL nor VERCEL_URL is set — use root-relative paths.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "";
}
