export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

// Headline numbers shown in the hero/social-proof bar (brief section 6).
export const HEADLINE_STATS: StatItem[] = [
  { value: 1130, suffix: "+", label: "участвали студенти" },
  { value: 8000, suffix: "+", label: "открити кандидати" },
  { value: 900, suffix: "+", label: "проведени интервюта" },
  { value: 250, suffix: "+", label: "наети участници" },
  { value: 73, suffix: "+", label: "компании" },
];

// Secondary stats shown further down the page (matches the live reference
// design's "Резултати, които се броят" section).
export const IMPACT_STATS: StatItem[] = [
  { value: 690, suffix: "+", label: "реални позиции" },
  { value: 8000, suffix: "+", label: "намерени кандидати" },
  { value: 900, suffix: "+", label: "проведени интервюта" },
  { value: 250, suffix: "+", label: "наети таланти" },
];
