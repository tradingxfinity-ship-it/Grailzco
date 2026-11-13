"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, SplitHeadline } from "@/components/ui/Reveal";
import { HeroCards } from "@/components/visuals/HeroCards";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:-mt-20 md:pt-20">
      <div
        aria-hidden="true"
        className="grid-faint absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_55%,black_15%,transparent_65%)]"
      />

      <div className="container-grail relative flex flex-col items-center pb-20 pt-8 text-center md:pb-28 md:pt-10">
        <SplitHeadline
          id="hero-title"
          as="h1"
          immediate
          delay={0.1}
          lines={["Your Cards.", "Our *Passion.*"]}
          className="font-display text-[clamp(3rem,6.8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white"
        />

        <div className="mt-10 w-full sm:mt-12">
          <HeroCards />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="lede mt-6 max-w-[34rem] sm:mt-8"
        >
          Great collections deserve great opportunities. Discover a simpler way to sell your collectible trading cards
          with Grailz Co.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
          className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-7"
        >
          <ButtonLink href="/sell" size="lg">
            Sell Your Cards
          </ButtonLink>
          <Link
            href="#about"
            className="group inline-flex items-center gap-2 text-[0.98rem] font-semibold text-white/80 transition-colors hover:text-mint"
          >
            Explore Grailz Co
            <ArrowDown aria-hidden="true" className="size-4 transition-transform group-hover:translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
