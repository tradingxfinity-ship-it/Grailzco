"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, SplitHeadline } from "@/components/ui/Reveal";
import { HeroCards } from "@/components/visuals/HeroCards";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:-mt-20 md:pt-20"
    >
      <div
        aria-hidden="true"
        className="grid-faint absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_70%)]"
      />

      <div className="container-grail relative grid items-center gap-10 pb-16 pt-10 md:pb-24 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-6">
        <div className="relative z-10 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="inline-block size-1.5 rounded-full bg-mint" />
            Pokémon &amp; collectible trading cards
          </motion.p>

          <SplitHeadline
            id="hero-title"
            as="h1"
            immediate
            delay={0.1}
            lines={["Your Cards.", "Our *Passion.*"]}
            className="display-xl mt-6 text-white"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="lede mt-7 max-w-[37rem]"
          >
            Great collections deserve great opportunities. Discover a simpler way to sell your collectible trading cards
            with Grailz Co.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/sell" size="lg">
              Sell Your Cards
            </ButtonLink>
            <ButtonLink href="#about" size="lg" variant="outline" icon="none" className="gap-3">
              Explore Grailz Co
              <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover/btn:translate-y-0.5" />
            </ButtonLink>
          </motion.div>
        </div>

        <div className="relative lg:col-span-5 lg:-mr-10 xl:-mr-16">
          <HeroCards />
        </div>
      </div>

      {/* Category strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative border-y border-line"
      >
        <div className="container-grail">
          <ul className="grid grid-cols-2 gap-px bg-line font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mist md:grid-cols-4">
            {["Vintage", "Modern", "Graded", "Collections & lots"].map((c, i) => (
              <li key={c} className="flex items-center gap-3 bg-navy px-1 py-4 md:px-6 md:first:pl-0">
                <span className="text-mint">0{i + 1}</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
