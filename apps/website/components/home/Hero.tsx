"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CURRENT_SEASON, SEASON_DATES } from "@/data/config";
import { trackEvent } from "@/components/analytics/track";
import { formatDate } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />
      <Container className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Практическо HR състезание
          </div>

          <h1 className="text-display-lg font-extrabold text-white text-balance">
            Твоята кариера не започва с{" "}
            <span className="text-navy-300 line-through decoration-coral-400/70">CV</span>.
            <br />
            Започва с{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              практика.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">
            HR:RUSH FOR PRACTICE свързва студенти с реални компании, практически
            задачи, ментори и възможности за кариерен старт.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              href="/apply"
              size="lg"
              withArrow
              onClick={() => trackEvent("apply_button_click", { location: "hero" })}
            >
              Кандидатствай сега
            </Button>
            <Button href="#kak-raboti" variant="secondary" size="lg">
              Виж как работи
            </Button>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950">
              {CURRENT_SEASON}
            </span>
            <span className="text-sm font-medium text-navy-200">
              {formatDate(SEASON_DATES.start)} – {formatDate(SEASON_DATES.end)}
            </span>
          </div>
        </div>

        <div className="relative animate-fade-in [animation-delay:150ms]">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 shadow-glow">
            <Image
              src="/hero/placeholder.svg"
              alt="Студенти и ментори работят заедно по практическа HR задача"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-navy-900/90 px-5 py-4 backdrop-blur sm:block">
            <p className="text-2xl font-extrabold text-cyan-300">73+</p>
            <p className="text-xs text-navy-300">компании партньори</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
