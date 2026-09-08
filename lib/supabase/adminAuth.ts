import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifies the current request is an authenticated Supabase Auth user AND a
 * member of the `admins` table (see supabase/migrations/0001_init.sql).
 * Redirects to /admin/login if either check fails. Call this at the top of
 * every protected admin Server Component — middleware.ts already blocks
 * signed-out visitors, but this adds a second, explicit check for admin
 * *membership* (a signed-in-but-not-admin Supabase Auth user should still be
 * turned away).
 */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/admin/login?error=not_admin");
  }

  return { user, admin: adminRow };
}
