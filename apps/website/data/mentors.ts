export interface Mentor {
  id: string;
  name: string;
  position: string;
  company: string;
  bio: string;
  photoUrl: string;
  linkedinUrl: string;
}

// PLACEHOLDER mentor content — replace with real mentors before launch.
// To add/remove a mentor: edit this array (and drop a photo in
// /public/photos/mentors/).
export const MENTORS: Mentor[] = [
  {
    id: "mentor-1",
    name: "Име Фамилия",
    position: "HR Business Partner",
    company: "Компания",
    bio: "Кратка биография на ментора — опит, фокус и с какво може да помогне на участниците в програмата. (placeholder съдържание)",
    photoUrl: "/photos/mentors/placeholder.svg",
    linkedinUrl: "https://www.linkedin.com/",
  },
  {
    id: "mentor-2",
    name: "Име Фамилия",
    position: "Talent Acquisition Lead",
    company: "Компания",
    bio: "Кратка биография на ментора — опит, фокус и с какво може да помогне на участниците в програмата. (placeholder съдържание)",
    photoUrl: "/photos/mentors/placeholder.svg",
    linkedinUrl: "https://www.linkedin.com/",
  },
  {
    id: "mentor-3",
    name: "Име Фамилия",
    position: "Marketing Manager",
    company: "Компания",
    bio: "Кратка биография на ментора — опит, фокус и с какво може да помогне на участниците в програмата. (placeholder съдържание)",
    photoUrl: "/photos/mentors/placeholder.svg",
    linkedinUrl: "https://www.linkedin.com/",
  },
  {
    id: "mentor-4",
    name: "Име Фамилия",
    position: "Team Lead, Product",
    company: "Компания",
    bio: "Кратка биография на ментора — опит, фокус и с какво може да помогне на участниците в програмата. (placeholder съдържание)",
    photoUrl: "/photos/mentors/placeholder.svg",
    linkedinUrl: "https://www.linkedin.com/",
  },
];
