import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";
import { STORIES } from "@/data/stories";
import { Badge } from "@/components/ui/Badge";
import { Quote } from "lucide-react";

export function Stories() {
  return (
    <Section id="istorii" className="bg-white">
      <Eyebrow index="08" label="От участие до кариера" tone="amber" />
      <h2 className="max-w-2xl text-display-sm font-extrabold text-navy-950 text-balance">
        Истории на участници.
      </h2>
      <p className="mt-4 max-w-xl text-navy-600">
        Съдържанието по-долу е примерна структура — реалните истории на
        участници ще бъдат добавени тук през идните сезони.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="relative flex flex-col rounded-2xl border border-navy-100 bg-navy-50/50 p-6"
          >
            <Badge className="absolute right-4 top-4 bg-amber-100 text-amber-800">
              Placeholder
            </Badge>
            <Quote className="h-6 w-6 text-cyan-400" />
            <p className="mt-4 flex-1 text-sm italic leading-relaxed text-navy-700">
              „{story.quote}“
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-navy-200">
                <Image src={story.photoUrl} alt="" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-950">{story.name}</p>
                <p className="text-xs text-navy-500">
                  {story.university} · {story.company}, {story.position}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
