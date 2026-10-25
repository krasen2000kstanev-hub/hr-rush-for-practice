import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/data/config";
import { PRIVACY_POLICY_VERSION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Политика за поверителност",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
          Версия {PRIVACY_POLICY_VERSION}
        </p>
        <h1 className="mt-2 text-display-sm font-extrabold text-navy-950">
          Политика за поверителност
        </h1>
        <p className="mt-4 text-sm text-navy-500">
          Този документ е шаблон и трябва да бъде прегледан и допълнен от
          юрист преди публично пускане на сайта, така че да отговаря напълно
          на изискванията на ОРЗД (GDPR) и приложимото българско
          законодателство.
        </p>

        <div className="prose prose-navy mt-10 max-w-none space-y-6 text-navy-700">
          <section>
            <h2 className="text-lg font-bold text-navy-950">1. Администратор на лични данни</h2>
            <p>
              Инициативата {SITE_CONFIG.name} се организира от {SITE_CONFIG.initiativeBy}.
              За въпроси, свързани с обработването на лични данни, можеш да се
              свържеш с нас на {SITE_CONFIG.contactEmail}.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-950">2. Какви данни събираме</h2>
            <p>При кандидатстване през формата на сайта събираме:</p>
            <ul className="list-disc pl-5">
              <li>Име, фамилия, имейл и телефон;</li>
              <li>Данни за образованието (университет, специалност, курс, степен);</li>
              <li>Информация за професионалния опит и кариерните интереси;</li>
              <li>LinkedIn профил (ако е предоставен);</li>
              <li>Автобиография (CV);</li>
              <li>Дата и час на съгласието с настоящата политика.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-950">3. Цели на обработването</h2>
            <p>
              Данните се използват единствено за администриране на
              кандидатурата ти в {SITE_CONFIG.name} — разглеждане на профила
              спрямо партньорски компании, комуникация относно следващи стъпки
              и участие в дейностите на инициативата.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-950">4. Съхранение</h2>
            <p>
              Данните се съхраняват в защитена база данни (Supabase), а
              автобиографиите — в частно (непублично достъпно) хранилище.
              Достъп до данните имат само оторизирани администратори на
              инициативата.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy-950">5. Твоите права</h2>
            <p>
              Имаш право на достъп, коригиране, изтриване и преносимост на
              данните си, както и право да оттеглиш съгласието си по всяко
              време, като се свържеш с нас на {SITE_CONFIG.contactEmail}.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
