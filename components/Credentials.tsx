import {ArrowUpRight} from "lucide-react";
import {Reveal} from "@/components/ui/motion";
import {credentials, type CredentialItem} from "@/lib/data";
import {cn} from "@/lib/utils";

export function Availability({className, dotClassName}: { className?: string; dotClassName?: string }) {
    const {availability} = credentials;
    return (
        <p className={cn("mono-label flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      <span className="inline-flex items-center gap-2.5">
        <span
            aria-hidden
            className={cn("size-2 rounded-full", availability.open ? (dotClassName ?? "bg-accent") : "border border-current")}
        />
          {availability.status}
      </span>
            <span aria-hidden>—</span>
            <span>{availability.response}</span>
        </p>
    );
}

function Item({item}: { item: CredentialItem }) {
    const body = (
        <>
      <span className="block text-[1.05rem] font-medium leading-tight tracking-tight">
        {item.title}
          {item.href && (
              <ArrowUpRight className="ml-1 inline size-4 align-[-0.1em]" strokeWidth={1.5} aria-hidden/>
          )}
      </span>
            <span className="mono-label mt-1.5 block text-ink/75">{item.meta}</span>
        </>
    );
    return (
        <li
            className="border-t py-4 border-ink/20">
            {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" data-cursor="link" className="block">
                    {body}
                </a>
            ) : (
                body
            )}
        </li>
    );
}

export function Credentials() {
    if (!credentials.show) return null;
    return (
        <div className="mt-24 border-t border-ink pt-8 md:mt-32">
            <Reveal className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <h3 className="mono-label">Credentials</h3>
                <Availability/>
            </Reveal>

            <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2">
                {credentials.groups.map((g, i) => (
                    <Reveal key={g.label} delay={i * 0.08}>
                        <h4 className="font-serif text-[1.7rem] italic leading-none">{g.label}</h4>
                        <ul className="mt-5">
                            {g.items.map((item, j) => (
                                <Item key={`${item.title}-${j}`} item={item}/>
                            ))}
                        </ul>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}
