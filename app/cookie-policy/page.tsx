import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/data/config";

export const metadata: Metadata = {
  title: "Политика за бисквитки",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-display-sm font-extrabold text-navy-950">
          Политика за бисквитки
        </h1>
        <p className="mt-4 text-sm text-navy-500">
          Този документ е шаблон — прегледай и допълни го преди публично
          пускане на сайта.
        </p>

        <div className="prose prose-navy mt-10 max-w-none space-y-6 text-navy-700">
          <section>
            <h2 className="text-lg font-bold text-navy-950">Какво са бисквитките</h2>
            <p>
              Бисквитките са малки текстови файлове, които се съхраняват на
              устройството ти, когато посещаваш уебсайт, и позволяват сайтът
              да запомня определена информация между посещенията.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy-950">Как ги използваме</h2>
            <p>
              {SITE_CONFIG.name} може да използва бисквитки на Google
              Analytics 4 и Meta Pixel за анализ на трафика и подобряване на
              сайта, само ако тези интеграции са конфигурирани. Административният
              панел използва технически необходими бисквитки за сесията за
              вход.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy-950">Управление на бисквитките</h2>
            <p>
              Можеш да управляваш или изтриваш бисквитки чрез настройките на
              своя браузър по всяко време.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
