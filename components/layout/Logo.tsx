import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-extrabold leading-none tracking-tight", className)}>
      <span className="text-white">HR</span>
      <span className="text-cyan-400">:</span>
      <span className="text-white">Rush</span>
      <span className="block text-[0.42em] font-semibold uppercase tracking-[0.25em] text-navy-300">
        for practice
      </span>
    </span>
  );
}
