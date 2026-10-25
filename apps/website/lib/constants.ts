// A handful of small, project-wide constants that are not sensitive enough
// to warrant an environment variable but that you may still want to bump
// occasionally (e.g. whenever the privacy policy changes).

/** Bump this whenever privacy-policy.md / the /privacy-policy page content changes materially. */
export const PRIVACY_POLICY_VERSION = "1.0";

/** Max CV upload size, in bytes (5 MB). */
export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ACCEPTED_CV_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

/** Name of the private Supabase Storage bucket used for CVs. */
export const CV_STORAGE_BUCKET = "cv-uploads";

export const SITE_NAME = "HR:RUSH FOR PRACTICE";
