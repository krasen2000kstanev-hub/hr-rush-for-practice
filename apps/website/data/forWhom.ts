export interface ForWhomItem {
  title: string;
  description: string;
}

// Brief section 8 — "За кого е инициативата".
export const FOR_WHOM: ForWhomItem[] = [
  {
    title: "Студенти без опит",
    description: "За хора, които искат да направят първата реална крачка в кариерата си.",
  },
  {
    title: "Студенти с първи опит",
    description: "За хора, които вече имат стаж или работа, но искат следващото си развитие.",
  },
  {
    title: "Завършващи студенти",
    description: "За хора, които търсят първата си постоянна професионална позиция.",
  },
  {
    title: "Млади професионалисти",
    description: "За хора в началото на кариерата си, които искат да открият нова възможност.",
  },
];

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

// Brief section 7 — "Как работи HR:RUSH FOR PRACTICE".
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Кандидатстваш",
    description: "Попълваш кратката регистрационна форма.",
  },
  {
    step: 2,
    title: "Откриваме подходящите възможности",
    description: "Профилът ти се разглежда спрямо компаниите и позициите в инициативата.",
  },
  {
    step: 3,
    title: "Участваш",
    description: "Включваш се в практически задачи, срещи, интервюта и активности.",
  },
  {
    step: 4,
    title: "Показваш какво можеш",
    description:
      "Не разчиташ само на CV. Компаниите виждат реалните ти умения, мотивация и начин на работа.",
  },
  {
    step: 5,
    title: "Получаваш възможност",
    description:
      "Най-добрите участници могат да получат стаж, работа или друга възможност за развитие.",
  },
];
