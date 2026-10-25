import { Section, Eyebrow } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/data/faq";

export function FAQSection() {
  return (
    <Section id="faq" className="bg-white">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow index="09" label="Въпроси" tone="coral" />
          <h2 className="text-display-sm font-extrabold text-navy-950 text-balance">
            Преди да се включиш.
          </h2>
          <p className="mt-4 max-w-sm text-navy-600">
            Не намери отговор на въпроса си? Пиши ни през секция „Контакти“ по-долу.
          </p>
        </div>
        <Accordion items={FAQ_ITEMS} />
      </div>
    </Section>
  );
}
