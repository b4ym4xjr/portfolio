import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "outline" | "accent";
  children: ReactNode;
};

/**
 * Pill button with a colour-wipe hover: a fill slides up from the bottom edge.
 */
export function Button({ variant = "solid", className, children, ...rest }: Props) {
  const base =
    "group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-6 text-[15px] font-medium tracking-tight";
  const styles = {
    solid: "bg-ink text-paper",
    outline: "border border-ink text-ink",
    accent: "bg-ink text-paper",
  }[variant];
  const wipe = {
    solid: "bg-accent",
    outline: "bg-ink",
    accent: "bg-paper",
  }[variant];
  const wipeText = {
    solid: "group-hover:text-ink",
    outline: "group-hover:text-paper",
    accent: "group-hover:text-ink",
  }[variant];

  return (
    <a data-cursor="link" className={cn(base, styles, className)} {...rest}>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0",
          wipe,
        )}
      />
      <span className={cn("relative z-10 inline-flex items-center gap-2.5 transition-colors duration-300", wipeText)}>
        {children}
      </span>
    </a>
  );
}
