import type { Metadata } from "next";
import { PartyPopper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Кандидатурата е изпратена",
  robots: { index: false, follow: false },
};

export default function ApplySuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center bg-navy-950">
      <Container className="py-20 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
            <PartyPopper className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-display-sm font-extrabold text-white text-balance">
            Готово! Кандидатурата ти е при нас. 🎉
          </h1>
          <p className="mt-4 text-navy-300">
            Благодарим ти, че кандидатства за HR:RUSH FOR PRACTICE. Ще се
            свържем с теб, когато имаме подходяща следваща стъпка или
            възможност.
          </p>
          <Button href="/" size="lg" className="mt-8">
            Обратно към началната страница
          </Button>
        </div>
      </Container>
    </div>
  );
}
