"use client";

// Thin wrapper around GA4 (gtag) and Meta Pixel (fbq) so the rest of the app
// can fire events without caring whether either integration is actually
// configured (brief section 28). Both scripts are only injected when their
// respective env var is set — see components/analytics/Analytics.tsx — so
// these calls are safe no-ops otherwise.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | "apply_button_click"
  | "application_started"
  | "application_submitted"
  | "contact_company_click";

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never break the app.
  }

  try {
    window.fbq?.("trackCustom", event, params);
  } catch {
    // Analytics must never break the app.
  }
}
