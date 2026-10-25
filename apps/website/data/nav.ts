export interface NavItem {
  label: string;
  href: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "Начало", href: "/" },
  { label: "За инициативата", href: "/#za-initsiativata" },
  { label: "Как работи", href: "/#kak-raboti" },
  { label: "За студенти", href: "/#za-studenti" },
  { label: "Ментори", href: "/#mentori" },
  { label: "Компании", href: "/#kompanii" },
  { label: "Университети", href: "/#universiteti" },
  { label: "FAQ", href: "/#faq" },
  { label: "Контакти", href: "/#kontakti" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "За инициативата", href: "/#za-initsiativata" },
  { label: "За студенти", href: "/#za-studenti" },
  { label: "За компании", href: "/#kompanii" },
  { label: "Университети", href: "/#universiteti" },
  { label: "Ментори", href: "/#mentori" },
  { label: "FAQ", href: "/#faq" },
  { label: "Контакти", href: "/#kontakti" },
];

export const FOOTER_LEGAL_NAV: NavItem[] = [
  { label: "Политика за поверителност", href: "/privacy-policy" },
  { label: "Политика за бисквитки", href: "/cookie-policy" },
];
