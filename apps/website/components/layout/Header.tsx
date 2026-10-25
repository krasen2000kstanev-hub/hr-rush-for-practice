"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { MAIN_NAV } from "@/data/nav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/components/analytics/track";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-navy-950/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1320px] items-center justify-between container-px">
        <Link href="/" aria-label="HR:RUSH FOR PRACTICE — начало" className="shrink-0">
          <Logo className="text-xl" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основна навигация">
          {MAIN_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            href="/apply"
            size="sm"
            withArrow
            onClick={() => trackEvent("apply_button_click", { location: "header" })}
          >
            Кандидатствай
          </Button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
