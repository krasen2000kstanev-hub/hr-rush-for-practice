"use client";

import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/data/config";
import { GraduationCap, Building2, School } from "lucide-react";
import { trackEvent } from "@/components/analytics/track";

const CARDS = [
  {
    icon: GraduationCap,
    title: "Аз съм студент",
    description: "Кандидатствай директно през формата на инициативата.",
    ctaLabel: "Кандидатствай",
    href: "/apply",
    analyticsEvent: "apply_button_click" as const,
  },
  {
    icon: Building2,
    title: "Представлявам компания",
    description: "Открийте мотивирани млади таланти и включете реални позиции.",
    ctaLabel: "Свържете се с нас",
    href: `mailto:${SITE_CONFIG.contactEmail}?subject=Компания%20-%20HR:RUSH%20FOR%20PRACTICE`,
    analyticsEvent: "contact_company_click" as const,
  },
  {
    icon: School,
    title: "Представлявам университет",
    description: "Станете партньор и дайте на студентите си достъп до практика.",
    ctaLabel: "Свържете се с нас",
    href: `mailto:${SITE_CONFIG.contactEmail}?subject=Университет%20-%20HR:RUSH%20FOR%20PRACTICE`,
    analyticsEvent: undefined,
  },
];

export function ContactSection() {
  return (
    <Section id="kontakti" className="bg-navy-950">
      <Eyebrow index="10" label="Контакти" tone="violet" />
      <h2 className="max-w-2xl text-display-md font-extrabold text-white text-balance">
        Избери своята роля.
      </h2>
      <p className="mt-4 max-w-xl text-navy-300">
        Каквато и да е ролята ти, има директен път да се включиш в HR:RUSH FOR
        PRACTICE.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="flex flex-col rounded-2xl border border-white/10 bg-navy-900 p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
              <card.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-white">{card.title}</h3>
            <p className="mt-2 flex-1 text-sm text-navy-300">{card.description}</p>
            <Button
              href={card.href}
              variant="secondary"
              className="mt-6"
              withArrow
              onClick={() => card.analyticsEvent && trackEvent(card.analyticsEvent, { location: "contact_section" })}
            >
              {card.ctaLabel}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-sm text-navy-400">
        Или пиши директно на{" "}
        <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="font-semibold text-cyan-400">
          {SITE_CONFIG.contactEmail}
        </a>
      </div>
    </Section>
  );
}
