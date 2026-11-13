"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CardArt } from "@/components/visuals/CardArt";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { categories } from "@/content/copy";
import { images } from "@/content/images";
import { cn } from "@/lib/cn";

const HUE: Record<string, number> = { vintage: -25, modern: 30, graded: 0, lots: 15 };

export function Categories() {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <section aria-labelledby="look-title" className="relative overflow-hidden bg-navy-900 py-24 md:py-36">
      <div aria-hidden="true" className="absolute -left-40 top-1/3 size-[36rem] rounded-full bg-mint/[0.06] blur-[120px]" />
      <div className="container-grail relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="02">What we look for</SectionLabel>
            <SplitHeadline id="look-title" lines={["Cards worth", "a *closer* look."]} className="display-lg mt-8" />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-mist md:text-right">
              Examples of what collectors submit. Every submission is reviewed individually — these aren&apos;t a promise
              we&apos;ll purchase every category.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* Sticky showcase (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative mx-auto aspect-[4/5] max-w-[26rem]">
                <div aria-hidden="true" className="absolute inset-[8%] rounded-[2rem] border border-line" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, y: 30, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: -20, rotate: 2 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CardArt
                      slot={images[current.image]}
                      variant={current.variant}
                      hue={HUE[current.key]}
                      className={current.variant === "slab" ? "w-[56%]" : "w-[62%]"}
                      sizes="(min-width: 1024px) 18vw, 0px"
                    />
                  </motion.div>
                </AnimatePresence>
                <p className="absolute bottom-0 left-0 right-0 text-center font-mono text-[0.68rem] uppercase tracking-[0.14em] text-haze">
                  {current.meta}
                </p>
              </div>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {categories.map((c, i) => (
              <Reveal as="li" key={c.key} delay={i * 0.06}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "group grid w-full grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-t border-line py-8 text-left transition-colors md:grid-cols-[4rem_1fr_7rem] md:gap-x-8 md:py-10",
                    i === categories.length - 1 && "border-b",
                  )}
                >
                  <span
                    className={cn(
                      "pt-2 font-mono text-sm transition-colors",
                      active === i ? "text-mint" : "text-mint lg:text-haze lg:group-hover:text-mist",
                    )}
                  >
                    {c.index}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block font-display text-[2rem] font-semibold leading-none tracking-[-0.035em] transition-colors sm:text-[2.6rem] md:text-[3.25rem]",
                        active === i ? "text-white" : "text-white lg:text-white/45 lg:group-hover:text-white/80",
                      )}
                    >
                      {c.title}
                    </span>
                    <span
                      className={cn(
                        "mt-4 block max-w-lg text-[0.98rem] leading-relaxed transition-colors",
                        active === i ? "text-mist" : "text-mist lg:text-haze",
                      )}
                    >
                      {c.body}
                    </span>
                  </span>
                  {/* Inline thumbnail on small screens / right-hand thumbnail on md */}
                  <span className="col-span-2 mt-2 flex items-center gap-4 lg:hidden md:col-span-1 md:mt-0 md:justify-end">
                    <CardArt
                      slot={images[c.image]}
                      variant={c.variant}
                      hue={HUE[c.key]}
                      className={c.variant === "slab" ? "w-[4.5rem]" : "w-20"}
                      sizes="96px"
                    />
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze md:hidden">{c.meta}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden h-px self-center bg-mint transition-all duration-500 ease-[var(--ease-grail)] lg:block",
                      active === i ? "w-full" : "w-0",
                    )}
                  />
                </button>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
