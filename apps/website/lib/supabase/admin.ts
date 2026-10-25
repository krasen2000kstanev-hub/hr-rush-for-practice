import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * SECURITY: import this ONLY from server-only code that never ships to the
 * browser (Route Handlers, Server Actions). The `server-only` import above
 * makes Next.js throw a build error if it's ever pulled into a client
 * bundle. Used for: inserting new applications (which must succeed for
 * anonymous visitors even though direct anonymous SELECT is blocked), the
 * duplicate-email/phone pre-check, and signed CV download URLs.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
