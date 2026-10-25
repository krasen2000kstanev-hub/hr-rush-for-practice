import "server-only";
import { google } from "googleapis";
import type { StudentApplication } from "@/types/application";
import { googleSheetsEnv, isGoogleSheetsConfigured } from "@/lib/env";

/**
 * Optional, best-effort sync of a newly created application into a Google
 * Sheet. Controlled entirely by env vars (GOOGLE_SHEETS_ENABLED and
 * friends) — if they're missing, this is a no-op and MUST NEVER throw, so a
 * misconfigured or absent Google integration can never block a real
 * candidate's submission (brief section 19).
 *
 * Supabase remains the single source of truth; this is a one-way,
 * fire-and-forget mirror for convenience.
 */
export async function syncApplicationToGoogleSheets(application: StudentApplication): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;

  try {
    const auth = new google.auth.JWT({
      email: googleSheetsEnv.serviceAccountEmail,
      key: googleSheetsEnv.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const university =
      application.university === "other"
        ? application.custom_university || "Друг"
        : application.university;

    await sheets.spreadsheets.values.append({
      spreadsheetId: googleSheetsEnv.sheetId,
      range: "A:Z",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            application.created_at,
            application.first_name,
            application.last_name,
            application.email,
            application.phone,
            university,
            application.specialty,
            application.study_year,
            application.degree,
            application.experience_level,
            (application.career_interests ?? []).join(", "),
            (application.opportunity_preferences ?? []).join(", "),
            application.linkedin_url ?? "",
            application.application_status,
            application.season,
          ],
        ],
      },
    });
  } catch (error) {
    // Swallow errors on purpose — see the doc comment above. Log for
    // observability only.
    console.error("[googleSheets] Non-blocking sync failed:", error);
  }
}
