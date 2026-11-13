"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, SplitHeadline } from "@/components/ui/Reveal";
import { HeroCards } from "@/components/visuals/HeroCards";
import { Particles } from "@/components/visuals/Particles";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:-mt-20 md:pt-20">
      {/* Grid floor: the 72px grid tilted back in perspective, horizon behind the cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[52%] [perspective:420px] [perspective-origin:50%_0%] [mask-image:linear-gradient(to_bottom,transparent,black_35%),linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
      >
        <div className="grid-floor absolute -left-1/2 -right-1/2 top-0 h-[300%] origin-top [transform:rotateX(64deg)]" />
      </div>

      <Particles />

      <div className="container-grail relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center py-[min(2.5rem,4svh)] text-center md:min-h-[calc(100svh-5rem)]">
        <SplitHeadline
          id="hero-title"
          as="h1"
          immediate
          delay={0.1}
          lines={["Your Cards.", "Our *Passion.*"]}
          className="font-display text-[clamp(2.6rem,min(6.8vw,8.6svh),6.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white"
        />

        <div className="mt-[min(3rem,4.5svh)] w-full">
          <HeroCards />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="lede mt-[min(2rem,3svh)] max-w-[36rem] lg:max-w-[44rem]"
        >
          Great collections deserve great opportunities. Discover a simpler way to sell your collectible trading cards
          with Grailz Co.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
          className="mt-[min(2rem,3.5svh)] flex flex-col items-center gap-4 sm:flex-row sm:gap-7"
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
