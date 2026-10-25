import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { AboutSection } from "@/components/home/AboutSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ForWhom } from "@/components/home/ForWhom";
import { Mentors } from "@/components/home/Mentors";
import { Universities } from "@/components/home/Universities";
import { Companies } from "@/components/home/Companies";
import { Stories } from "@/components/home/Stories";
import { FAQSection } from "@/components/home/FAQSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AboutSection />
      <HowItWorks />
      <ForWhom />
      <Mentors />
      <Universities />
      <Companies />
      <Stories />
      <FAQSection />
      <ContactSection />
      <FinalCta />
    </>
  );
}
