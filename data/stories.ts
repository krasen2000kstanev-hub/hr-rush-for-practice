export interface Story {
  id: string;
  name: string;
  university: string;
  company: string;
  position: string;
  quote: string;
  photoUrl: string;
  isPlaceholder: true;
}

// IMPORTANT: There are no real testimonials yet. Per the brief, this is
// intentionally placeholder content, clearly marked as such in the UI
// (see components/home/Stories.tsx). Replace with real, consented stories
// once available and remove `isPlaceholder`.
export const STORIES: Story[] = [
  {
    id: "story-1",
    name: "Име Фамилия",
    university: "Университет",
    company: "Компания",
    position: "Позиция",
    quote:
      "Тук ще стои реална история на участник — какво е научил/а и как HR:RUSH FOR PRACTICE му/ѝ е помогнала за старта в кариерата.",
    photoUrl: "/photos/stories/placeholder.svg",
    isPlaceholder: true,
  },
  {
    id: "story-2",
    name: "Име Фамилия",
    university: "Университет",
    company: "Компания",
    position: "Позиция",
    quote:
      "Тук ще стои реална история на участник — какво е научил/а и как HR:RUSH FOR PRACTICE му/ѝ е помогнала за старта в кариерата.",
    photoUrl: "/photos/stories/placeholder.svg",
    isPlaceholder: true,
  },
  {
    id: "story-3",
    name: "Име Фамилия",
    university: "Университет",
    company: "Компания",
    position: "Позиция",
    quote:
      "Тук ще стои реална история на участник — какво е научил/а и как HR:RUSH FOR PRACTICE му/ѝ е помогнала за старта в кариерата.",
    photoUrl: "/photos/stories/placeholder.svg",
    isPlaceholder: true,
  },
];
