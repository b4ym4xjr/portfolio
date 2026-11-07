import { Sparkle } from "@/components/ui/motion";
import { disciplines } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Infinite ticker. Content is duplicated so the -50% loop is seamless. */
export function Marquee({
  items = disciplines,
  className,
  sparkleClass = "text-accent",
}: {
  items?: readonly string[];
  className?: string;
  sparkleClass?: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-8 md:px-14">{item}</span>
          <Sparkle className={cn("size-[0.55em] shrink-0", sparkleClass)} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div className="flex w-max animate-marquee">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
