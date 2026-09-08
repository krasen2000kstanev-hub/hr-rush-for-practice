export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "instagram" | "facebook";
}

// Replace these placeholder URLs with the initiative's real social profiles.
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hr-rush-for-practice", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/hrrushforpractice", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/hrrushforpractice", icon: "facebook" },
];
