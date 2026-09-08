import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary:
    "bg-cyan-400 text-navy-950 hover:bg-cyan-300 hover:shadow-glow active:scale-[0.98]",
  secondary:
    "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98]",
  ghost: "text-white hover:bg-white/10 active:scale-[0.98]",
  outlineDark:
    "border border-navy-900/20 text-navy-900 hover:bg-navy-900 hover:text-white active:scale-[0.98]",
  dark: "bg-navy-950 text-white hover:bg-navy-900 active:scale-[0.98]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base",
};

interface CommonProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  withArrow?: boolean;
  loading?: boolean;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    withArrow,
    loading,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
      {withArrow && !loading && (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      )}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={cn(classes, "group")} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(classes, "group")} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
