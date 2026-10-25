export interface FormOption {
  value: string;
  label: string;
}

export const CAREER_INTERESTS: FormOption[] = [
  { value: "marketing", label: "Маркетинг" },
  { value: "sales", label: "Продажби" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Финанси" },
  { value: "accounting", label: "Счетоводство" },
  { value: "it", label: "IT" },
  { value: "business_development", label: "Business Development" },
  { value: "project_management", label: "Project Management" },
  { value: "customer_service", label: "Customer Service" },
  { value: "operations", label: "Operations" },
  { value: "design", label: "Design" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Други" },
];

export const OTHER_CAREER_INTEREST_VALUE = "other";

export const OPPORTUNITY_PREFERENCES: FormOption[] = [
  { value: "internship", label: "Стаж" },
  { value: "job", label: "Работа" },
  { value: "practice", label: "Практика" },
  { value: "project", label: "Проект" },
  { value: "training", label: "Обучение" },
  { value: "not_sure", label: "Все още не съм сигурен/а" },
];

export const DEGREE_OPTIONS: FormOption[] = [
  { value: "bachelor", label: "Бакалавър" },
  { value: "master", label: "Магистър" },
  { value: "phd", label: "Докторант" },
  { value: "other", label: "Друго" },
];

export const EXPERIENCE_OPTIONS: FormOption[] = [
  { value: "none", label: "Нямам" },
  { value: "under_1_year", label: "Под 1 година" },
  { value: "1_2_years", label: "1-2 години" },
  { value: "over_2_years", label: "Над 2 години" },
];

export const STUDY_YEAR_OPTIONS: FormOption[] = [
  { value: "1", label: "1-ви курс" },
  { value: "2", label: "2-ри курс" },
  { value: "3", label: "3-ти курс" },
  { value: "4", label: "4-ти курс" },
  { value: "5", label: "5-ти курс" },
  { value: "graduated", label: "Завършил/а" },
];
