/**
 * One-off CLI helper to create an admin user.
 *
 * Usage:
 *   npm run create-admin -- --email admin@example.com --password "StrongPass123!" --name "Ана Иванова"
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL to be set
 * (loaded from .env via dotenv below). This is the only supported way to
 * create an admin account — there is no public sign-up UI anywhere in the
 * app (see supabase/migrations/0001_init.sql and README.md).
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const email = getArg("email");
  const password = getArg("password");
  const name = getArg("name") ?? null;

  if (!email || !password) {
    console.error(
      'Usage: npm run create-admin -- --email admin@example.com --password "StrongPass123!" [--name "Full Name"]'
    );
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env file."
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !userData.user) {
    console.error("Failed to create auth user:", createError?.message);
    process.exit(1);
  }

  const { error: adminInsertError } = await supabase
    .from("admins")
    .insert({ user_id: userData.user.id, full_name: name });

  if (adminInsertError) {
    console.error(
      "Auth user was created, but adding them to the `admins` table failed:",
      adminInsertError.message
    );
    console.error(`You can add them manually with SQL:\n
insert into public.admins (user_id, full_name) values ('${userData.user.id}', ${
      name ? `'${name.replace(/'/g, "''")}'` : "null"
    });`);
    process.exit(1);
  }

  console.log(`✅ Admin created: ${email} (user_id: ${userData.user.id})`);
  console.log("You can now log in at /admin/login with this email and password.");
}

main();
