import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HEADLINE_STATS } from "@/data/stats";

const ACCENTS = ["text-cyan-500", "text-coral-500", "text-amber-500", "text-violet-600", "text-navy-900"];

export function StatsBar() {
  return (
    <section className="border-b border-navy-100 bg-white">
      <Container className="grid grid-cols-2 gap-y-8 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:py-14">
        {HEADLINE_STATS.map((stat, index) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className={`text-3xl font-extrabold sm:text-4xl ${ACCENTS[index % ACCENTS.length]}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-500">
              {stat.label}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
