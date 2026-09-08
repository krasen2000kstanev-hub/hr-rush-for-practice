"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MAIN_NAV } from "@/data/nav";
import { trackEvent } from "@/components/analytics/track";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Затвори менюто" : "Отвори менюто"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy-950/98 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Logo className="text-lg" />
            <button
              type="button"
              aria-label="Затвори менюто"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
            {MAIN_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-lg font-semibold text-white/90 hover:bg-white/5"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="border-t border-white/10 p-5">
            <Button
              href="/apply"
              size="lg"
              className="w-full"
              withArrow
              onClick={() => {
                trackEvent("apply_button_click", { location: "mobile_menu" });
                setOpen(false);
              }}
            >
              Кандидатствай
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
