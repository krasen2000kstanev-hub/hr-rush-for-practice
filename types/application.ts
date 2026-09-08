// Central domain types for a student application, shared between the
// public /apply form, the API route, and the admin panel.

export const APPLICATION_STATUSES = [
  "new",
  "reviewed",
  "contact",
  "interview",
  "approved",
  "hired",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Bulgarian labels shown in the admin UI (section 17 of the brief).
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Нова",
  reviewed: "Разгледана",
  contact: "За контакт",
  interview: "Интервю",
  approved: "Одобрена",
  hired: "Назначен/а",
  rejected: "Отказана",
};

export const APPLICATION_STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  new: "bg-navy-100 text-navy-700",
  reviewed: "bg-violet-100 text-violet-700",
  contact: "bg-amber-100 text-amber-800",
  interview: "bg-cyan-100 text-cyan-800",
  approved: "bg-emerald-100 text-emerald-800",
  hired: "bg-emerald-600 text-white",
  rejected: "bg-coral-100 text-coral-700",
};

export const EXPERIENCE_LEVELS = [
  "none",
  "under_1_year",
  "1_2_years",
  "over_2_years",
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  none: "Нямам",
  under_1_year: "Под 1 година",
  "1_2_years": "1-2 години",
  over_2_years: "Над 2 години",
};

export const DEGREE_LEVELS = ["bachelor", "master", "phd", "other"] as const;
export type DegreeLevel = (typeof DEGREE_LEVELS)[number];

export const DEGREE_LEVEL_LABELS: Record<DegreeLevel, string> = {
  bachelor: "Бакалавър",
  master: "Магистър",
  phd: "Докторант",
  other: "Друго",
};

export interface StudentApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  university: string;
  custom_university: string | null;
  specialty: string;
  study_year: string;
  degree: DegreeLevel;
  experience_level: ExperienceLevel;
  career_interests: string[];
  other_career_interest: string | null;
  opportunity_preferences: string[];
  expectations: string | null;
  development_goals: string | null;
  linkedin_url: string | null;
  cv_file_path: string | null;
  cv_original_filename: string | null;
  gdpr_consent: boolean;
  consent_timestamp: string;
  privacy_policy_version: string;
  application_status: ApplicationStatus;
  admin_notes: string | null;
  season: string;
  created_at: string;
  updated_at: string;
}

export type StudentApplicationInsert = Omit<
  StudentApplication,
  | "id"
  | "application_status"
  | "admin_notes"
  | "created_at"
  | "updated_at"
  | "cv_file_path"
> & {
  cv_file_path?: string | null;
};
