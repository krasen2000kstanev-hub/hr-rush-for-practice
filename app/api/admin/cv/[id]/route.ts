import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CV_STORAGE_BUCKET } from "@/lib/constants";

export const runtime = "nodejs";

/**
 * Generates a short-lived signed URL for a candidate's private CV and
 * redirects to it. Requires an authenticated admin session — CVs are never
 * publicly reachable (brief section 9).
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Не сте влезли в системата." }, { status: 401 });
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return NextResponse.json({ error: "Нямате администраторски достъп." }, { status: 403 });
  }

  // RLS also allows this select for admins, but we already verified above.
  const { data: application, error } = await supabase
    .from("student_applications")
    .select("cv_file_path")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !application?.cv_file_path) {
    return NextResponse.json({ error: "CV файлът не е намерен." }, { status: 404 });
  }

  const adminClient = createAdminClient();
  const { data: signed, error: signError } = await adminClient.storage
    .from(CV_STORAGE_BUCKET)
    .createSignedUrl(application.cv_file_path, 60);

  if (signError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Неуспешно генериране на връзка за изтегляне." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
