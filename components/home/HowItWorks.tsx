import { Section, Eyebrow } from "@/components/ui/Section";
import { PROCESS_STEPS } from "@/data/forWhom";
import { IMPACT_STATS } from "@/data/stats";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STAT_COLORS = ["text-coral-500", "text-cyan-500", "text-amber-500", "text-emerald-500"];

export function HowItWorks() {
  return (
    <Section id="kak-raboti" className="bg-navy-950">
      <Eyebrow index="02" label="Как работи" tone="cyan" />
      <h2 className="max-w-3xl text-display-md font-extrabold text-white text-balance">
        От първата мисия до <span className="text-cyan-400">реалното наемане.</span>
      </h2>
      <p className="mt-4 max-w-2xl text-navy-300">
        Един ясен процес, който превежда теорията през реалните етапи на подбор
        и превръща усилията на екипа в измерим резултат.
      </p>

      <ol className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {PROCESS_STEPS.map((item) => (
          <li key={item.step} className="grid gap-2 py-6 sm:grid-cols-[80px_1fr] sm:items-center sm:gap-6">
            <span className="text-sm font-bold text-amber-400">
              {String(item.step).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <h3 className="text-lg font-bold text-white sm:text-xl">{item.title}</h3>
              <p className="text-sm text-navy-300 sm:max-w-md">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <Eyebrow index="03" label="Ефектът" tone="coral" />
        <h3 className="max-w-2xl text-display-sm font-extrabold text-white text-balance">
          Резултати, които се <span className="text-coral-400">броят.</span>
        </h3>
        <p className="mt-4 max-w-xl text-navy-300">
          Зад всяко число има студент, който е натрупал опит, кандидат, който е
          получил възможност, и компания, която е открила човек с потенциал.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT_STATS.map((stat, index) => (
            <div key={stat.label} className="bg-navy-900 p-8">
              <p className={`text-4xl font-extrabold ${STAT_COLORS[index % STAT_COLORS.length]}`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
