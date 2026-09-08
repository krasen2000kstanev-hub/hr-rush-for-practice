"use client";

import { Section, Eyebrow } from "@/components/ui/Section";
import { FOR_WHOM } from "@/data/forWhom";
import { GraduationCap, Rocket, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/components/analytics/track";

const ICONS = [GraduationCap, Rocket, Briefcase, Users];
const ACCENTS = ["border-cyan-400/40 text-cyan-500", "border-coral-400/40 text-coral-500", "border-amber-400/40 text-amber-500", "border-violet-400/40 text-violet-600"];

export function ForWhom() {
  return (
    <Section id="za-studenti" className="bg-white">
      <Eyebrow index="04" label="За кого е инициативата" tone="violet" />
      <h2 className="max-w-2xl text-display-md font-extrabold text-navy-950 text-balance">
        Каквото и да е нивото ти, има място за теб.
      </h2>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FOR_WHOM.map((item, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <div
              key={item.title}
              className="group flex flex-col rounded-2xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${ACCENTS[index % ACCENTS.length]}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          href="/apply"
          size="lg"
          withArrow
          onClick={() => trackEvent("apply_button_click", { location: "for_whom" })}
        >
          Кандидатствай сега
        </Button>
      </div>
    </Section>
  );
}
