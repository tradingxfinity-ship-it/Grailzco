"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, Reveal } from "@/components/ui/Reveal";
import { categories } from "@/content/copy";
import { images } from "@/content/images";
import { cn } from "@/lib/cn";

type CategoryKey = (typeof categories)[number]["key"];

/** Fan positions for the Lots category: left, centre (front), right. */
const FAN = [
  "absolute left-0 top-[8%] w-[44%] -rotate-[12deg]",
  "absolute left-1/2 top-0 z-10 w-[46%] -translate-x-1/2",
  "absolute right-0 top-[8%] w-[44%] rotate-[12deg]",
];

/** The card(s) shown for a category: one card, a slab, or a three-card fan for lots. */
function CategoryVisual({ k, size }: { k: CategoryKey; size: "lg" | "sm" }) {
  const cards = images.categoryCards[k];
  const lg = size === "lg";
  const sizes = lg ? "(min-width: 1024px) 16vw, 0px" : "96px";
  const card = (c: (typeof cards)[number], slab = false) => (
    <div
      className={cn(
        "relative overflow-hidden shadow-[0_24px_50px_-18px_rgb(0_0_0/0.8)] ring-1 ring-white/10",
        slab ? "aspect-[425/721] rounded-[0.5rem]" : "aspect-[330/460]",
        !slab && (lg ? "rounded-[0.8rem]" : "rounded-[0.35rem]"),
      )}
    >
      <Image src={c.src} alt={c.alt} fill sizes={sizes} className="object-cover" />
    </div>
  );

  if (k === "lots") {
    return (
      <div className={cn("relative", lg ? "aspect-[1/0.74] w-[84%]" : "h-[5.5rem] w-28")}>
        {cards.map((c, i) => (
          <div key={c.label} className={FAN[i]}>
            {card(c)}
          </div>
        ))}
      </div>
    );
  }
  if (k === "graded") return <div className={lg ? "w-[46%]" : "w-[3.6rem]"}>{card(cards[0], true)}</div>;
  return <div className={lg ? "w-[58%]" : "w-20"}>{card(cards[0])}</div>;
}

export function Categories() {
  const [active, setActive] = useState(0);
  const current = categories[active];
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The row crossing the middle of the viewport becomes active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="look-title" className="relative overflow-clip bg-navy-900 py-24 md:py-36">
      <div aria-hidden="true" className="absolute -left-40 top-1/3 size-[36rem] rounded-full bg-mint/[0.06] blur-[120px]" />
      <div className="container-grail relative">
        <h2 id="look-title" className="sr-only">
          What we look for
        </h2>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sticky showcase (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[max(7rem,calc(50vh-15rem))]">
              <div className="relative mx-auto aspect-[4/5] max-w-[26rem]">
                <div aria-hidden="true" className="absolute inset-[8%] rounded-[2rem] border border-line" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.key}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CategoryVisual k={current.key} size="lg" />
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
              <li
                key={c.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
              >
                <Reveal
                  delay={i * 0.06}
                  className={cn(
                    "grid w-full grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-t border-line py-8 md:grid-cols-[4rem_1fr_7rem] md:gap-x-8 md:py-10 lg:py-16",
                    i === categories.length - 1 && "border-b",
                  )}
                >
                  <span
                    className={cn(
                      "pt-2 font-mono text-sm transition-colors duration-500",
                      active === i ? "text-mint" : "text-mint lg:text-haze",
                    )}
                  >
                    {c.index}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block font-display text-[2rem] font-semibold leading-none tracking-[-0.035em] transition-colors duration-500 sm:text-[2.6rem] md:text-[3.25rem]",
                        active === i ? "text-white" : "text-white lg:text-white/30",
                      )}
                    >
                      {c.title}
                    </span>
                    <span
                      className={cn(
                        "mt-4 block max-w-lg text-[0.98rem] leading-relaxed transition-colors duration-500",
                        active === i ? "text-mist" : "text-mist lg:text-haze/60",
                      )}
                    >
                      {c.body}
                    </span>
                  </span>
                  {/* Inline thumbnail on small screens / right-hand thumbnail on md */}
                  <span className="col-span-2 mt-2 flex items-center gap-4 lg:hidden md:col-span-1 md:mt-0 md:justify-end">
                    <CategoryVisual k={c.key} size="sm" />
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze md:hidden">{c.meta}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden h-px self-center bg-mint transition-all duration-500 ease-[var(--ease-grail)] lg:block",
                      active === i ? "w-full" : "w-0",
                    )}
                  />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
