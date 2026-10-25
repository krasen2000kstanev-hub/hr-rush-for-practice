"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { SignOutButton } from "./SignOutButton";

const LINKS = [
  { href: "/admin", label: "Табло", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Кандидатури", icon: Users },
];

export function AdminSidebar({ adminName }: { adminName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-navy-950 p-5 lg:sticky lg:top-0 lg:flex">
      <Link href="/admin">
        <Logo className="text-lg" />
      </Link>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-500">
        Admin panel
      </p>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-cyan-400/10 text-cyan-300" : "text-navy-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4">
        {adminName && <p className="mb-2 truncate px-3 text-xs text-navy-500">{adminName}</p>}
        <SignOutButton />
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 lg:hidden">
      <nav className="flex items-center gap-1 overflow-x-auto">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium",
                active ? "bg-cyan-400/10 text-cyan-700" : "text-navy-500"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <SignOutButton variant="light" />
    </div>
  );
}
