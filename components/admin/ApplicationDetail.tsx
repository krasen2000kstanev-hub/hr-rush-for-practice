"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Save, CheckCircle2 } from "lucide-react";
import type { StudentApplication } from "@/types/application";
import { DEGREE_LEVEL_LABELS, EXPERIENCE_LEVEL_LABELS, type ApplicationStatus } from "@/types/application";
import { StatusSelect } from "./StatusSelect";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { CAREER_INTERESTS, OPPORTUNITY_PREFERENCES, STUDY_YEAR_OPTIONS } from "@/data/formOptions";
import { Button } from "@/components/ui/Button";

function labelize(values: string[], options: { value: string; label: string }[]) {
  if (!values?.length) return "—";
  return values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ");
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2.5 text-sm">
      <dt className="text-navy-500">{label}</dt>
      <dd className="col-span-2 font-medium text-navy-900">{value || "—"}</dd>
    </div>
  );
}

export function ApplicationDetail({ application }: { application: StudentApplication }) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(application.application_status);
  const [notes, setNotes] = useState(application.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const university =
    application.university === "other" ? application.custom_university || "Друг" : application.university;

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("student_applications")
      .update({ application_status: status, admin_notes: notes })
      .eq("id", application.id);

    setSaving(false);

    if (updateError) {
      setError("Неуспешен запис. Опитай отново.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-navy-100 bg-white p-6">
          <h2 className="mb-3 text-lg font-bold text-navy-950">
            {application.first_name} {application.last_name}
          </h2>
          <dl className="divide-y divide-navy-100">
            <InfoRow label="Имейл" value={application.email} />
            <InfoRow label="Телефон" value={application.phone} />
            <InfoRow label="Дата на кандидатстване" value={formatDate(application.created_at, true)} />
            <InfoRow label="Сезон" value={application.season} />
          </dl>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">Образование</h3>
          <dl className="divide-y divide-navy-100">
            <InfoRow label="Университет" value={university} />
            <InfoRow label="Специалност" value={application.specialty} />
            <InfoRow
              label="Курс"
              value={STUDY_YEAR_OPTIONS.find((o) => o.value === application.study_year)?.label ?? application.study_year}
            />
            <InfoRow label="Степен" value={DEGREE_LEVEL_LABELS[application.degree]} />
          </dl>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">
            Професионален профил
          </h3>
          <dl className="divide-y divide-navy-100">
            <InfoRow label="Опит" value={EXPERIENCE_LEVEL_LABELS[application.experience_level]} />
            <InfoRow
              label="Кариерни интереси"
              value={labelize(application.career_interests ?? [], CAREER_INTERESTS)}
            />
            {application.other_career_interest && (
              <InfoRow label="Друго направление" value={application.other_career_interest} />
            )}
            <InfoRow
              label="Тип възможност"
              value={labelize(application.opportunity_preferences ?? [], OPPORTUNITY_PREFERENCES)}
            />
            <InfoRow
              label="LinkedIn"
              value={
                application.linkedin_url ? (
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-600 hover:underline"
                  >
                    Профил <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null
              }
            />
          </dl>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-navy-500">Очаквания</p>
              <p className="mt-1 text-sm text-navy-700">{application.expectations || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-navy-500">Цели за развитие</p>
              <p className="mt-1 text-sm text-navy-700">{application.development_goals || "—"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 bg-white p-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">CV и GDPR</h3>
          <dl className="divide-y divide-navy-100">
            <InfoRow
              label="CV файл"
              value={
                application.cv_file_path ? (
                  <a
                    href={`/api/admin/cv/${application.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-600 hover:underline"
                  >
                    {application.cv_original_filename || "Отвори CV"} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null
              }
            />
            <InfoRow
              label="GDPR съгласие"
              value={`Да, версия ${application.privacy_policy_version} (${formatDate(application.consent_timestamp, true)})`}
            />
          </dl>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-navy-100 bg-white p-6 lg:sticky lg:top-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-navy-500">Управление на кандидатурата</h3>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800">Статус</label>
          <StatusSelect value={status} onChange={setStatus} disabled={saving} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-800">Вътрешна бележка</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            disabled={saving}
            placeholder="Бележки, видими само за администратори..."
            className="w-full resize-none rounded-xl border border-navy-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
        </div>

        {error && <p className="text-sm text-coral-600">{error}</p>}
        {saved && !error && (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Записано успешно.
          </p>
        )}

        <Button onClick={handleSave} loading={saving} disabled={saving} className="w-full">
          <Save className="h-4 w-4" /> Запази промените
        </Button>
      </aside>
    </div>
  );
}
