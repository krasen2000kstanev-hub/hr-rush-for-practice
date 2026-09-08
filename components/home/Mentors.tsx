import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";
import { MENTORS } from "@/data/mentors";
import { Linkedin } from "lucide-react";

export function Mentors() {
  return (
    <Section id="mentori" className="bg-navy-950">
      <Eyebrow index="05" label="Ментори" tone="amber" />
      <h2 className="max-w-2xl text-display-md font-extrabold text-white text-balance">
        Хората, които подкрепят участниците.
      </h2>
      <p className="mt-4 max-w-xl text-navy-300">
        Опитни професионалисти, които дават обратна връзка, менторство и
        реална гледна точка от индустрията през целия сезон.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MENTORS.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-900 transition-colors hover:border-cyan-400/40"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={mentor.photoUrl}
                alt={`Снимка на ${mentor.name}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-bold text-white">{mentor.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                {mentor.position} · {mentor.company}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-300">{mentor.bio}</p>
              <a
                href={mentor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-cyan-400"
                aria-label={`LinkedIn профил на ${mentor.name}`}
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
