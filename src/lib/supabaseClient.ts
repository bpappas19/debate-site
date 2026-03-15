/**
 * Browser Supabase client for use in Client Components.
 * Uses cookies for auth so session is available on refresh and across tabs.
 * Returns null when env vars are missing (e.g. during build) so app can still compile.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
