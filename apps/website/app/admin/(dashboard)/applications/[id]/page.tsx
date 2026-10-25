import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ApplicationDetail } from "@/components/admin/ApplicationDetail";
import type { StudentApplication } from "@/types/application";

export const metadata = { title: "Профил на кандидат" };

export default async function AdminApplicationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("student_applications")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/applications"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-500 hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" /> Всички кандидатури
      </Link>
      <ApplicationDetail application={data as StudentApplication} />
    </div>
  );
}
