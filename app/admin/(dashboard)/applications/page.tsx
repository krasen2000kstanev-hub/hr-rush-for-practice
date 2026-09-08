import { createClient } from "@/lib/supabase/server";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";
import type { StudentApplication } from "@/types/application";

export const metadata = { title: "Кандидатури" };

// Loaded once per page view and then filtered/sorted/exported entirely in
// the browser (see components/admin/ApplicationsTable.tsx). This keeps the
// admin UI simple and fast for the initiative's realistic data volume; if
// the applicant count grows well beyond a few thousand, swap this for
// server-side pagination (the RLS policies and indexes already support it).
const FETCH_LIMIT = 2000;

export default async function AdminApplicationsPage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("student_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  return (
    <ApplicationsTable
      initialApplications={(data as StudentApplication[]) ?? []}
      loadError={error?.message ?? null}
    />
  );
}
