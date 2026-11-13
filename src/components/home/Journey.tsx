"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ConversationVisual, ReviewVisual, ShareVisual } from "@/components/home/StageVisuals";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { journey } from "@/content/copy";
import { cn } from "@/lib/cn";

const STAGE_VISUALS = [ShareVisual, ReviewVisual, ConversationVisual];

/** How it works: three animated stages on a timeline that fills as you scroll. */
export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  return (
    <section id="how-it-works" aria-labelledby="journey-title" className="relative border-t border-line bg-navy-900 py-24 md:py-36">
      <div className="container-grail">
        <div className="max-w-3xl">
          <SectionLabel index="02">How it works</SectionLabel>
          <SplitHeadline id="journey-title" lines={["Three stages,", "one *clear* path."]} className="display-lg mt-8" />
        </div>

        <ol ref={ref} className="relative mt-20 md:mt-28">
          <span aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line md:left-1/2" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-0 left-[1.15rem] top-0 w-px origin-top bg-mint md:left-1/2"
          />
          {journey.map((s, i) => {
            const flip = i % 2 === 1;
            const Visual = STAGE_VISUALS[i];
            return (
              <li key={s.index} className="relative grid gap-10 pb-24 pl-14 last:pb-0 md:grid-cols-2 md:gap-20 md:pl-0">
                <span className="absolute left-0 top-1 z-10 flex size-[2.3rem] items-center justify-center rounded-full border border-mint bg-navy-900 font-mono text-xs text-mint md:left-1/2 md:-translate-x-1/2">
                  {s.index}
                </span>
                <Reveal className={cn("md:pt-0", flip ? "md:order-2 md:pl-4" : "md:pr-4 md:text-right")}>
                  <span
                    aria-hidden="true"
                    className="block font-display text-[5rem] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(55_245_199/0.45)] md:text-[8rem]"
                  >
                    {s.index}
                  </span>
                  <h3 className="mt-6 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2.6rem]">{s.title}</h3>
                  <p className={cn("mt-4 max-w-md leading-relaxed text-mist", !flip && "md:ml-auto")}>{s.body}</p>
                  <ul className={cn("mt-6 flex flex-wrap gap-2", !flip && "md:justify-end")}>
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-mist">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal y={50} delay={0.1} className={cn("flex", flip ? "md:order-1 md:justify-end md:pr-4" : "md:pl-4")}>
                  <div className="hairline relative w-full max-w-[24rem] rounded-[1.75rem] bg-navy-800/80 p-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:p-4">
                    <Visual />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
