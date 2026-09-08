export interface University {
  id: string;
  name: string;
  shortName?: string;
  logoUrl: string;
}

// Partner universities shown in the "Университети партньори" section and
// offered as options in the /apply form dropdown.
// To add/remove a university: edit this array (and drop a logo file in
// /public/logos/universities/).
export const UNIVERSITIES: University[] = [
  { id: "sofia-university", name: "Софийски университет „Св. Климент Охридски“", shortName: "СУ", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "uni-sofia-nbu", name: "Нов български университет", shortName: "НБУ", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "ue-varna", name: "Икономически университет – Варна", shortName: "ИУ-Варна", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "unwe", name: "УНСС", shortName: "УНСС", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "tu-sofia", name: "Технически университет – София", shortName: "ТУ-София", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "vtu", name: "Великотърновски университет „Св. св. Кирил и Методий“", shortName: "ВТУ", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "plovdiv-university", name: "Пловдивски университет „Паисий Хилендарски“", shortName: "ПУ", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "aubg", name: "Американски университет в България", shortName: "AUBG", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "vuzf", name: "ВУЗФ", shortName: "ВУЗФ", logoUrl: "/logos/universities/placeholder.svg" },
  { id: "burgas-free-university", name: "Бургаски свободен университет", shortName: "БСУ", logoUrl: "/logos/universities/placeholder.svg" },
];

// Sentinel value used in the apply form when the student's university is not
// in the list above — triggers the "Друг университет" free-text field.
export const OTHER_UNIVERSITY_VALUE = "other";
