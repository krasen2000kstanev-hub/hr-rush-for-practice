import { Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

const STUDENT_POINTS = [
  "Практически HR умения",
  "Менторство и обратна връзка",
  "Работа по реални позиции",
  "Контакти с работодатели",
];

const COMPANY_POINTS = [
  "Достъп до мотивирани студенти",
  "Съдържание и позициониране",
  "Подкрепа по реални позиции",
  "Участие в ключови събития",
];

export function AboutSection() {
  return (
    <section id="za-initsiativata" className="scroll-mt-20 bg-white">
      <Container className="pt-20 sm:pt-24">
        <Eyebrow index="01" label="За инициативата" tone="coral" />
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <h2 className="text-display-md font-extrabold text-navy-950 text-balance">
            Не симулация.
            <br />
            <span className="text-cyan-500">Реален старт.</span>
          </h2>
          <p className="text-lg leading-relaxed text-navy-600">
            HR:RUSH FOR PRACTICE е практическо състезание, което открива, развива
            и свързва хора с потенциал. Студентите влизат в ролята на HR екипи,
            а компаниите получават достъп до мотивирани млади таланти.
            Компанията не е просто лого в програмата — тя участва с реален
            бизнес казус, среща хората зад резултатите и изгражда връзка със
            следващото поколение професионалисти.
          </p>
        </div>
      </Container>

      <div className="mt-16 grid lg:grid-cols-2">
        <div className="bg-navy-900 px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-md">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-coral-400">
              За студентите
            </span>
            <h3 className="mt-3 text-display-sm font-extrabold text-white text-balance">
              Покажи какво можеш, преди първата си работа.
            </h3>
            <p className="mt-4 text-navy-300">
              За проактивни студенти, които искат да учат чрез действие, да
              работят в екип и да превърнат знанията си в реален опит.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {STUDENT_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-navy-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  {point}
                </li>
              ))}
            </ul>
            <Button href="#kak-raboti" variant="secondary" className="mt-8" withArrow>
              Виж как протича
            </Button>
          </div>
        </div>

        <div className="bg-cyan-400 px-6 py-14 text-navy-950 sm:px-10 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-md">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-navy-900/70">
              За компаниите
            </span>
            <h3 className="mt-3 text-display-sm font-extrabold text-balance">
              Открийте талантите, докато още се развиват.
            </h3>
            <p className="mt-4 text-navy-900/80">
              Включете реални позиции, работете със студентски HR екипи и
              изградете разпознаваема работодателска марка сред младите хора.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {COMPANY_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-900" />
                  {point}
                </li>
              ))}
            </ul>
            <Button href="#kontakti" variant="dark" className="mt-8" withArrow>
              Възможности за участие
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
