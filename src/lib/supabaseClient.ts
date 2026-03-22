/**
 * Browser Supabase client for use in Client Components.
 * Uses cookies for auth so session is available on refresh and across tabs.
 * Returns null when env vars are missing (e.g. during build) so app can still compile.
 *
 * Singleton client + serialized auth.getUser() to avoid "Lock was stolen by another request"
 * when multiple components call auth.getUser() or touch session storage at once.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

type AuthGetUserResult = Awaited<ReturnType<SupabaseClient["auth"]["getUser"]>>;

/** Serialize auth.getUser() so concurrent calls don't steal the session lock. */
let authGetUserQueue: Promise<AuthGetUserResult> = Promise.resolve({
  data: { user: null },
  error: null,
} as unknown as AuthGetUserResult);

function createClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (browserClient) return browserClient;
  const client = createBrowserClient(url, anonKey);
  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = function getuserSerialized() {
    authGetUserQueue = authGetUserQueue
      .then(() => originalGetUser())
      .catch((err) => {
        authGetUserQueue = Promise.resolve({
          data: { user: null },
          error: err,
        } as unknown as AuthGetUserResult);
        return authGetUserQueue;
      });
    return authGetUserQueue;
  };
  browserClient = client;
  return browserClient;
}

export { createClient };
