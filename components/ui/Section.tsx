import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  containerClassName?: string;
  as?: "section" | "div";
}

export function Section({
  id,
  className,
  containerClassName,
  children,
  as = "section",
  ...props
}: SectionProps) {
  const Comp = as;
  return (
    <Comp id={id} className={cn("py-16 sm:py-20 lg:py-28 scroll-mt-20", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </Comp>
  );
}

export function Eyebrow({
  index,
  label,
  tone = "cyan",
}: {
  index?: string;
  label: string;
  tone?: "cyan" | "coral" | "amber" | "violet";
}) {
  const toneClasses: Record<string, string> = {
    cyan: "text-cyan-400",
    coral: "text-coral-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
  };
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className={cn("h-px w-8", toneClasses[tone].replace("text-", "bg-"))} />
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.2em]",
          toneClasses[tone]
        )}
      >
        {index ? `${index} / ` : ""}
        {label}
      </span>
    </div>
  );
}
