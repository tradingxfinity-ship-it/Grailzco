import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/content/copy";
import { cn } from "@/lib/cn";

export function Why() {
  return (
    <section aria-labelledby="why-title" className="relative py-16 md:py-24">
      <div className="container-grail">
        <h2 id="why-title" className="sr-only">
          Why Grailz Co
        </h2>

        <div className="grid gap-px overflow-hidden rounded-[1.75rem] bg-line sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal
              key={p.index}
              delay={i * 0.08}
              className={cn(
                "group relative flex min-h-[15rem] flex-col justify-between bg-navy p-8 transition-colors duration-500 hover:bg-navy-800 md:min-h-[19rem] md:p-12",
              )}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-[4.5rem] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(55_245_199/0.55)] md:text-[6rem]">
                  {p.index}
                </span>
                <span aria-hidden="true" className="mt-3 size-2 rounded-full bg-white/15 transition-colors duration-500 group-hover:bg-mint" />
              </div>
              <div className="mt-10">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-white md:text-[1.9rem]">{p.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-mist">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
