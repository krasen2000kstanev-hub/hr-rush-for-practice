export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

// Companies "standing behind" the initiative's young talent (brief section 22).
// To add/remove a company: edit this array (and drop a logo file in
// /public/logos/companies/).
export const COMPANIES: Company[] = [
  { id: "company-1", name: "Компания 1", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-2", name: "Компания 2", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-3", name: "Компания 3", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-4", name: "Компания 4", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-5", name: "Компания 5", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-6", name: "Компания 6", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-7", name: "Компания 7", logoUrl: "/logos/companies/placeholder.svg" },
  { id: "company-8", name: "Компания 8", logoUrl: "/logos/companies/placeholder.svg" },
];
