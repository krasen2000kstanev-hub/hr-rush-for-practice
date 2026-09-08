import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";
import { UNIVERSITIES } from "@/data/universities";

export function Universities() {
  return (
    <Section id="universiteti" className="bg-white">
      <Eyebrow index="06" label="Университети партньори" tone="cyan" />
      <h2 className="max-w-2xl text-display-sm font-extrabold text-navy-950 text-balance">
        Водещи университети застават зад инициативата.
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {UNIVERSITIES.map((uni) => (
          <div
            key={uni.id}
            className="flex h-24 items-center justify-center rounded-xl border border-navy-100 bg-navy-50/60 p-4 grayscale transition-all hover:grayscale-0"
            title={uni.name}
          >
            <div className="relative h-10 w-full">
              <Image
                src={uni.logoUrl}
                alt={uni.name}
                fill
                sizes="140px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
