"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, ArrowUpDown, ExternalLink, AlertTriangle } from "lucide-react";
import type { StudentApplication } from "@/types/application";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, EXPERIENCE_LEVEL_LABELS } from "@/types/application";
import { StatusBadge } from "./StatusBadge";
import { formatDate, cn } from "@/lib/utils";
import { applicationsToCsv } from "@/lib/csv";
import { STUDY_YEAR_OPTIONS, CAREER_INTERESTS } from "@/data/formOptions";

type SortKey = "created_at" | "name" | "university" | "application_status";

function universityLabel(app: StudentApplication) {
  return app.university === "other" ? app.custom_university || "Друг" : app.university;
}

function downloadCsv(rows: StudentApplication[]) {
  const csv = applicationsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hr-rush-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ApplicationsTable({
  initialApplications,
  loadError,
}: {
  initialApplications: StudentApplication[];
  loadError?: string | null;
}) {
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [experience, setExperience] = useState("");
  const [careerInterest, setCareerInterest] = useState("");
  const [status, setStatus] = useState("");
  const [season, setSeason] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const universities = useMemo(
    () => Array.from(new Set(initialApplications.map(universityLabel))).sort(),
    [initialApplications]
  );
  const specialties = useMemo(
    () => Array.from(new Set(initialApplications.map((a) => a.specialty))).sort(),
    [initialApplications]
  );
  const seasons = useMemo(
    () => Array.from(new Set(initialApplications.map((a) => a.season))).sort(),
    [initialApplications]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const rows = initialApplications.filter((app) => {
      if (q) {
        const haystack = [
          app.first_name,
          app.last_name,
          app.email,
          app.phone,
          universityLabel(app),
          app.specialty,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (university && universityLabel(app) !== university) return false;
      if (specialty && app.specialty !== specialty) return false;
      if (studyYear && app.study_year !== studyYear) return false;
      if (experience && app.experience_level !== experience) return false;
      if (careerInterest && !(app.career_interests ?? []).includes(careerInterest)) return false;
      if (status && app.application_status !== status) return false;
      if (season && app.season !== season) return false;
      return true;
    });

    const sorted = [...rows].sort((a, b) => {
      let result = 0;
      switch (sortKey) {
        case "name":
          result = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`, "bg");
          break;
        case "university":
          result = universityLabel(a).localeCompare(universityLabel(b), "bg");
          break;
        case "application_status":
          result = a.application_status.localeCompare(b.application_status);
          break;
        case "created_at":
        default:
          result = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortDir === "asc" ? result : -result;
    });

    return sorted;
  }, [initialApplications, search, university, specialty, studyYear, experience, careerInterest, status, season, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950">Кандидатури</h1>
          <p className="text-sm text-navy-500">
            {filtered.length} от общо {initialApplications.length} кандидатури
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(filtered)}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {loadError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-coral-200 bg-coral-50 p-4 text-sm text-coral-700">
          <AlertTriangle className="h-4 w-4" /> Грешка при зареждане: {loadError}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-4">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Търси по име, имейл, телефон, университет, специалност..."
            className="w-full rounded-xl border border-navy-200 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <FilterSelect label="Университет" value={university} onChange={setUniversity} options={universities.map((u) => ({ value: u, label: u }))} />
          <FilterSelect label="Специалност" value={specialty} onChange={setSpecialty} options={specialties.map((s) => ({ value: s, label: s }))} />
          <FilterSelect label="Курс" value={studyYear} onChange={setStudyYear} options={STUDY_YEAR_OPTIONS} />
          <FilterSelect
            label="Опит"
            value={experience}
            onChange={setExperience}
            options={Object.entries(EXPERIENCE_LEVEL_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <FilterSelect label="Интерес" value={careerInterest} onChange={setCareerInterest} options={CAREER_INTERESTS} />
          <FilterSelect
            label="Статус"
            value={status}
            onChange={setStatus}
            options={APPLICATION_STATUSES.map((s) => ({ value: s, label: APPLICATION_STATUS_LABELS[s] }))}
          />
          <FilterSelect label="Сезон" value={season} onChange={setSeason} options={seasons.map((s) => ({ value: s, label: s }))} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-navy-100 bg-white lg:block">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-navy-100 bg-navy-50/70 text-xs font-semibold uppercase tracking-wide text-navy-500">
            <tr>
              <SortableHeader label="Дата" sortKey="created_at" current={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortableHeader label="Име" sortKey="name" current={sortKey} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Email</th>
              <SortableHeader label="Университет" sortKey="university" current={sortKey} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3">Специалност</th>
              <th className="px-4 py-3">Курс</th>
              <th className="px-4 py-3">Интереси</th>
              <th className="px-4 py-3">Опит</th>
              <SortableHeader label="Статус" sortKey="application_status" current={sortKey} dir={sortDir} onSort={toggleSort} />
              <th className="px-4 py-3">CV</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-navy-50/50">
                <td className="whitespace-nowrap px-4 py-3 text-navy-500">{formatDate(app.created_at)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-navy-900">
                  {app.first_name} {app.last_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-600">{app.phone}</td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-600">{app.email}</td>
                <td className="max-w-[160px] truncate px-4 py-3 text-navy-600" title={universityLabel(app)}>
                  {universityLabel(app)}
                </td>
                <td className="max-w-[140px] truncate px-4 py-3 text-navy-600">{app.specialty}</td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-600">
                  {STUDY_YEAR_OPTIONS.find((o) => o.value === app.study_year)?.label ?? app.study_year}
                </td>
                <td className="max-w-[160px] truncate px-4 py-3 text-navy-600">
                  {(app.career_interests ?? [])
                    .map((v) => CAREER_INTERESTS.find((o) => o.value === v)?.label ?? v)
                    .join(", ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-navy-600">
                  {EXPERIENCE_LEVEL_LABELS[app.experience_level]}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={app.application_status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {app.cv_file_path ? (
                    <a
                      href={`/api/admin/cv/${app.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-cyan-600 hover:underline"
                    >
                      CV <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-navy-300">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Link href={`/admin/applications/${app.id}`} className="font-semibold text-navy-900 hover:text-cyan-600">
                    Преглед
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-10 text-center text-sm text-navy-400">Няма кандидатури, отговарящи на филтрите.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((app) => (
          <Link
            key={app.id}
            href={`/admin/applications/${app.id}`}
            className="block rounded-2xl border border-navy-100 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-navy-950">
                  {app.first_name} {app.last_name}
                </p>
                <p className="text-xs text-navy-500">{formatDate(app.created_at)}</p>
              </div>
              <StatusBadge status={app.application_status} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-navy-600">
              <p>{app.email}</p>
              <p>{app.phone}</p>
              <p className="truncate">{universityLabel(app)} · {app.specialty}</p>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-navy-100 bg-white p-10 text-center text-sm text-navy-400">
            Няма кандидатури, отговарящи на филтрите.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-navy-200 px-2.5 py-2 text-xs font-medium text-navy-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
    >
      <option value="">{label}: всички</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SortableHeader({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th className="px-4 py-3">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn("inline-flex items-center gap-1", active && "text-cyan-700")}
      >
        {label}
        <ArrowUpDown className={cn("h-3 w-3", active && dir === "asc" && "rotate-180")} />
      </button>
    </th>
  );
}
