// Small helpers around environment variables so the rest of the codebase
// never touches `process.env` directly and never throws at import-time in
// environments where optional integrations (Google Sheets, GA4, Meta Pixel)
// are not configured yet.

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Check your .env file (see .env.example).`
    );
  }
  return value;
}

export const env = {
  // Public Supabase config (safe to expose to the browser).
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  // Server-only, never imported from a "use client" file.
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  },
};

export const analyticsEnv = {
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
};

export const googleSheetsEnv = {
  get enabled() {
    return process.env.GOOGLE_SHEETS_ENABLED === "true";
  },
  sheetId: process.env.GOOGLE_SHEET_ID || "",
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  // Private keys are usually stored with literal "\n" sequences in .env files.
  get privateKey() {
    return (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  },
};

export function isGoogleSheetsConfigured() {
  return Boolean(
    googleSheetsEnv.enabled &&
      googleSheetsEnv.sheetId &&
      googleSheetsEnv.serviceAccountEmail &&
      googleSheetsEnv.privateKey
  );
}
