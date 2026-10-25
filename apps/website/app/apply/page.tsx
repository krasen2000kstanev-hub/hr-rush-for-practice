import type { Metadata } from "next";
import { ApplyFormClient } from "@/components/forms/ApplyForm/ApplyFormClient";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Кандидатствай",
  description:
    "Кандидатствай за участие в HR:RUSH FOR PRACTICE — попълни кратката регистрационна форма за твоя сезон.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage() {
  return (
    <div className="bg-navy-50 py-14 sm:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Формуляр за кандидатстване
          </span>
          <h1 className="mt-3 text-display-sm font-extrabold text-navy-950 text-balance">
            Разкажи ни за себе си.
          </h1>
          <p className="mt-3 text-navy-600">
            Отнема около 5 минути. Информацията ти се пази поверително и се
            използва само във връзка с участието ти в HR:RUSH FOR PRACTICE.
          </p>
        </div>
        <ApplyFormClient />
      </Container>
    </div>
  );
}
