"use client";

import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";
import { COMPANIES } from "@/data/companies";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/components/analytics/track";

export function Companies() {
  return (
    <Section id="kompanii" className="bg-navy-50">
      <Eyebrow index="07" label="Компании" tone="coral" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-2xl text-display-sm font-extrabold text-navy-950 text-balance">
          Компании, които застават зад младите таланти.
        </h2>
        <Button
          href="#kontakti"
          variant="outlineDark"
          withArrow
          onClick={() => trackEvent("contact_company_click", { location: "companies_section" })}
        >
          Искате да включите компанията си?
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {COMPANIES.map((company) => (
          <div
            key={company.id}
            className="flex h-20 items-center justify-center rounded-xl border border-navy-100 bg-white p-3 grayscale transition-all hover:grayscale-0"
            title={company.name}
          >
            <div className="relative h-8 w-full">
              <Image
                src={company.logoUrl}
                alt={company.name}
                fill
                sizes="120px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
