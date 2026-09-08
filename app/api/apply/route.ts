import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicationServerSchema } from "@/lib/validation/applicationSchema";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  ACCEPTED_CV_EXTENSIONS,
  ACCEPTED_CV_MIME_TYPES,
  CV_STORAGE_BUCKET,
  MAX_CV_SIZE_BYTES,
  PRIVACY_POLICY_VERSION,
} from "@/lib/constants";
import { normalizeEmail, normalizePhone } from "@/lib/utils";
import { CURRENT_SEASON } from "@/data/config";
import { OTHER_UNIVERSITY_VALUE } from "@/data/universities";
import { syncApplicationToGoogleSheets } from "@/lib/googleSheets";
import type { StudentApplication } from "@/types/application";

export const runtime = "nodejs";

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

function isValidCvFile(file: File): boolean {
  const okType = (ACCEPTED_CV_MIME_TYPES as readonly string[]).includes(file.type);
  const okExt = ACCEPTED_CV_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  return (okType || okExt) && file.size > 0 && file.size <= MAX_CV_SIZE_BYTES;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-100);
}

export async function POST(request: NextRequest) {
  // --- Rate limiting (brief section 29) ---
  const ip = getClientIp(request.headers);
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    const response = jsonError(
      "Прекалено много опити. Моля, опитай отново по-късно.",
      429,
      "RATE_LIMITED"
    );
    if (retryAfterMs) {
      response.headers.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
    }
    return response;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Невалидни данни във формата.", 400, "INVALID_FORM_DATA");
  }

  // --- Honeypot (brief section 29) ---
  // Real visitors never see or fill this field. If it's non-empty, pretend
  // everything went fine (so simple bots don't learn anything) but skip all
  // real processing.
  const honeypot = String(formData.get("companyWebsite") ?? "");
  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const rawPayload = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    university: String(formData.get("university") ?? ""),
    customUniversity: String(formData.get("customUniversity") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    studyYear: String(formData.get("studyYear") ?? ""),
    degree: String(formData.get("degree") ?? ""),
    experienceLevel: String(formData.get("experienceLevel") ?? ""),
    careerInterests: formData.getAll("careerInterests").map(String),
    otherCareerInterest: String(formData.get("otherCareerInterest") ?? ""),
    opportunityPreferences: formData.getAll("opportunityPreferences").map(String),
    expectations: String(formData.get("expectations") ?? ""),
    developmentGoals: String(formData.get("developmentGoals") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    gdprConsent: formData.get("gdprConsent") === "true",
    companyWebsite: honeypot,
  };

  const parsed = applicationServerSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return jsonError(
      "Моля, провери отново въведените данни.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const data = parsed.data;

  const cvFile = formData.get("cvFile");
  if (!(cvFile instanceof File) || !isValidCvFile(cvFile)) {
    return jsonError(
      "Моля, прикачи валидна автобиография (PDF, DOC или DOCX, до 5 MB).",
      400,
      "INVALID_CV"
    );
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error("[api/apply] Supabase is not configured:", error);
    return jsonError(
      "Формата временно не е активна — свържи се с нас по имейл, за да кандидатстваш.",
      503,
      "SUPABASE_NOT_CONFIGURED"
    );
  }

  const normalizedEmail = normalizeEmail(data.email);
  const normalizedPhone = normalizePhone(data.phone);

  // --- Duplicate detection (brief sections 12 & 38) ---
  // Two separate, simple lookups (rather than a single `.or()` filter) so we
  // never have to worry about escaping user input inside a PostgREST filter
  // string. `email` has a case-insensitive unique index (see migration), so
  // this comparison mirrors that at the query level too.
  const [{ data: existingByEmail, error: emailLookupError }, { data: existingByPhone, error: phoneLookupError }] =
    await Promise.all([
      supabase
        .from("student_applications")
        .select("id")
        .ilike("email", normalizedEmail)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("student_applications")
        .select("id")
        .eq("phone", normalizedPhone)
        .limit(1)
        .maybeSingle(),
    ]);

  if (emailLookupError || phoneLookupError) {
    console.error("[api/apply] Duplicate lookup failed:", emailLookupError || phoneLookupError);
    return jsonError("Възникна грешка. Моля, опитай отново.", 500, "LOOKUP_FAILED");
  }

  if (existingByEmail || existingByPhone) {
    return jsonError(
      "Изглежда вече си кандидатствал/а с този имейл. Ако искаш да актуализираш информацията си, свържи се с нас.",
      409,
      "DUPLICATE_APPLICATION"
    );
  }

  // --- Upload CV to private storage (brief section 9) ---
  const fileExt = cvFile.name.includes(".") ? cvFile.name.split(".").pop() : "pdf";
  const storagePath = `${CURRENT_SEASON.replace(/\s+/g, "-")}/${randomUUID()}.${fileExt}`;
  const arrayBuffer = await cvFile.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(CV_STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: cvFile.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    console.error("[api/apply] CV upload failed:", uploadError);
    return jsonError(
      "Неуспешно качване на CV файла. Моля, опитай отново.",
      500,
      "CV_UPLOAD_FAILED"
    );
  }

  // --- Insert application row ---
  const nowIso = new Date().toISOString();
  const { data: inserted, error: insertError } = await supabase
    .from("student_applications")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: normalizedEmail,
      phone: normalizedPhone,
      university: data.university,
      custom_university: data.university === OTHER_UNIVERSITY_VALUE ? data.customUniversity : null,
      specialty: data.specialty,
      study_year: data.studyYear,
      degree: data.degree,
      experience_level: data.experienceLevel,
      career_interests: data.careerInterests,
      other_career_interest: data.otherCareerInterest || null,
      opportunity_preferences: data.opportunityPreferences,
      expectations: data.expectations,
      development_goals: data.developmentGoals,
      linkedin_url: data.linkedinUrl || null,
      cv_file_path: storagePath,
      cv_original_filename: sanitizeFilename(cvFile.name),
      gdpr_consent: true,
      consent_timestamp: nowIso,
      privacy_policy_version: PRIVACY_POLICY_VERSION,
      season: CURRENT_SEASON,
    })
    .select()
    .single();

  if (insertError || !inserted) {
    console.error("[api/apply] Insert failed:", insertError);
    // Best-effort cleanup of the uploaded file so we don't leak orphans.
    await supabase.storage.from(CV_STORAGE_BUCKET).remove([storagePath]);
    return jsonError("Възникна грешка. Моля, опитай отново.", 500, "INSERT_FAILED");
  }

  // --- Optional, non-blocking Google Sheets sync (brief section 19) ---
  await syncApplicationToGoogleSheets(inserted as StudentApplication);

  return NextResponse.json({ ok: true }, { status: 201 });
}
