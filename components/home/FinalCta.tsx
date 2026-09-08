"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/components/analytics/track";
import { SITE_CONFIG } from "@/data/config";

export function FinalCta() {
  return (
    <Section className="bg-navy-900 text-center">
      <div className="mx-auto max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Следващият сезон започва с теб
        </span>
        <h2 className="mt-4 text-display-md font-extrabold text-balance">
          <span className="text-white">Не чакай опита. </span>
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-coral-300 bg-clip-text text-transparent">
            Създай го.
          </span>
        </h2>
        <p className="mt-5 text-navy-300">
          Избери своята роля в HR:RUSH FOR PRACTICE и стани част от
          инициативата, която свързва потенциала с реалните възможности.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/apply"
            size="lg"
            withArrow
            onClick={() => trackEvent("apply_button_click", { location: "final_cta" })}
          >
            Кандидатствай като студент
          </Button>
          <Button
            href="#kontakti"
            variant="secondary"
            size="lg"
            onClick={() => trackEvent("contact_company_click", { location: "final_cta" })}
          >
            Включи компания
          </Button>
        </div>
        <p className="mt-6 text-xs text-navy-500">
          Формата за участие и актуалните условия се публикуват от {SITE_CONFIG.initiativeBy}.
        </p>
      </div>
    </Section>
  );
}
