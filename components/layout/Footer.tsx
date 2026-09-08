import Link from "next/link";
import { Logo } from "./Logo";
import { FOOTER_NAV, FOOTER_LEGAL_NAV } from "@/data/nav";
import { SOCIAL_LINKS } from "@/data/social";
import { SITE_CONFIG } from "@/data/config";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const ICONS = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook };

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 pb-10 pt-16">
      <div className="mx-auto w-full max-w-[1320px] container-px">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-8">
          <div>
            <Logo className="text-xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Навигация
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-navy-200 hover:text-cyan-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Правна информация</h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-navy-200 hover:text-cyan-400">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="text-sm text-navy-200 hover:text-cyan-400"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Инициатива на {SITE_CONFIG.initiativeBy}.
          </p>
          <Link href="/admin/login" className="hover:text-navy-200">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
