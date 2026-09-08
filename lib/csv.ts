import type { StudentApplication } from "@/types/application";
import {
  APPLICATION_STATUS_LABELS,
  DEGREE_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
} from "@/types/application";
import { formatDate } from "@/lib/utils";
import { CAREER_INTERESTS, OPPORTUNITY_PREFERENCES } from "@/data/formOptions";

function csvEscape(value: string): string {
  const needsQuoting = /[";\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

function labelize(values: string[], options: { value: string; label: string }[]): string {
  return values
    .map((v) => options.find((o) => o.value === v)?.label ?? v)
    .join(", ");
}

const HEADERS = [
  "Дата на кандидатстване",
  "Име",
  "Фамилия",
  "Имейл",
  "Телефон",
  "Университет",
  "Специалност",
  "Курс",
  "Степен",
  "Професионален опит",
  "Кариерни интереси",
  "Друго направление",
  "Предпочитан тип възможност",
  "LinkedIn",
  "Статус",
  "Сезон",
  "Бележки (админ)",
];

/**
 * Builds an Excel/Google-Sheets-friendly CSV string for the given
 * applications. Uses `;` as the field separator (the default list separator
 * for European/Bulgarian locale Excel) and a UTF-8 BOM so Cyrillic text
 * renders correctly when double-clicked open in Excel.
 */
export function applicationsToCsv(applications: StudentApplication[]): string {
  const rows = applications.map((a) => {
    const university =
      a.university === "other" ? a.custom_university || "Друг" : a.university;
    return [
      formatDate(a.created_at, true),
      a.first_name,
      a.last_name,
      a.email,
      a.phone,
      university,
      a.specialty,
      a.study_year,
      DEGREE_LEVEL_LABELS[a.degree] ?? a.degree,
      EXPERIENCE_LEVEL_LABELS[a.experience_level] ?? a.experience_level,
      labelize(a.career_interests ?? [], CAREER_INTERESTS),
      a.other_career_interest ?? "",
      labelize(a.opportunity_preferences ?? [], OPPORTUNITY_PREFERENCES),
      a.linkedin_url ?? "",
      APPLICATION_STATUS_LABELS[a.application_status] ?? a.application_status,
      a.season,
      a.admin_notes ?? "",
    ].map((v) => csvEscape(String(v)));
  });

  const lines = [HEADERS.map(csvEscape).join(";"), ...rows.map((r) => r.join(";"))];
  const BOM = "﻿";
  return BOM + lines.join("\r\n");
}
