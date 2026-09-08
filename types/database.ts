// Hand-written Supabase database types.
// Regenerate with `supabase gen types typescript` once your project is live
// and swap this file out — see README.md.

import type { ApplicationStatus, DegreeLevel, ExperienceLevel } from "./application";

export interface Database {
  public: {
    Tables: {
      student_applications: {
        Row: {
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
        };
        Insert: Partial<Database["public"]["Tables"]["student_applications"]["Row"]> & {
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          university: string;
          specialty: string;
          study_year: string;
          degree: DegreeLevel;
          experience_level: ExperienceLevel;
          gdpr_consent: boolean;
          consent_timestamp: string;
          privacy_policy_version: string;
          season: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_applications"]["Row"]>;
      };
      admins: {
        Row: {
          user_id: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admins"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
