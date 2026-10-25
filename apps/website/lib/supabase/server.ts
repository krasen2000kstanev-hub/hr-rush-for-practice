import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Respects the current user's session (via cookies) and
 * therefore Row Level Security — it can only do what the signed-in user
 * (typically an admin) is allowed to do.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Called from a Server Component during a static render — the
          // middleware is responsible for refreshing the session cookie in
          // that case, so this can be safely ignored.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // See note above.
        }
      },
    },
  });
}
