"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { EASE } from "@/components/ui/Reveal";
import { images } from "@/content/images";
import { cn } from "@/lib/cn";

/** Resting pose for each card in the fan: tilt (deg) and drop (% of card height). */
const POSE = [
  { rotate: -9, y: 9 },
  { rotate: -3, y: 2 },
  { rotate: 4, y: -1 },
  { rotate: -2, y: -3 },
  { rotate: 3, y: 1 },
  { rotate: 8, y: 7 },
];

/**
 * Overlapping fan of real cards. Each card lifts and straightens on hover;
 * the row is sized with --card so all six fit at every viewport width.
 */
export function HeroCards() {
  return (
    <div className="relative mx-auto w-[calc(var(--card)*4.1)] max-w-full [--card:clamp(4.6rem,min(21vw,19.5svh),13.25rem)]">
      {/* Speech-bubble tags */}
      <Bubble className="left-[2%] top-[-1.5rem] sm:top-[-2rem]" tone="light" delay={1.1} tail="left">
        Your next grail?
      </Bubble>
      <Bubble className="right-[-2%] top-[-1rem] sm:top-[-1.5rem]" tone="mint" delay={1.25} tail="right">
        @grailzco
      </Bubble>

      <ul className="flex items-center justify-center py-[min(2rem,3svh)]" aria-label="Featured Pokémon cards">
        {images.heroFan.map((card, i) => (
          <motion.li
            key={card.label}
            initial={{ opacity: 0, y: "30%", rotate: 0, scale: 0.92 }}
            animate={{ opacity: 1, y: `${POSE[i].y}%`, rotate: POSE[i].rotate, scale: 1, zIndex: 10 - Math.round(Math.abs(i - 2.5)) }}
            whileHover={{ y: "-8%", rotate: 0, scale: 1.06, zIndex: 20, transition: { duration: 0.35, ease: EASE } }}
            transition={{ duration: 1.1, delay: 0.35 + Math.abs(i - 2.5) * 0.08, ease: EASE }}
            className="group relative w-[var(--card)] shrink-0 [&:not(:first-child)]:-ml-[calc(var(--card)*0.38)]"
          >
            <div className="relative aspect-[330/460] overflow-hidden rounded-[0.55rem] shadow-[0_24px_50px_-16px_rgb(0_0_0/0.75)] ring-1 ring-white/10 sm:rounded-[0.8rem]">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                priority
                sizes="(min-width: 1024px) 212px, 21vw"
                className="object-cover"
              />
              {/* Foil sheen that sweeps across on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgb(255_255_255/0.35)_48%,rgb(55_245_199/0.25)_52%,transparent_70%)] transition-transform duration-700 ease-[var(--ease-grail)] group-hover:translate-x-full"
              />
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Mint floor glow under the fan */}
      <div aria-hidden="true" className="absolute inset-x-[15%] bottom-0 -z-10 h-1/2 rounded-[50%] bg-mint/15 blur-[70px]" />
    </div>
  );
}

function Bubble({
  children,
  className,
  tone,
  tail,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  tone: "light" | "mint";
  tail: "left" | "right";
  delay: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={cn(
        "absolute z-30 rounded-full px-3 py-1.5 font-mono text-[0.62rem] font-medium tracking-[0.02em] shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] sm:px-4 sm:py-2 sm:text-[0.8rem]",
        tone === "mint" ? "bg-mint text-navy" : "bg-white text-navy",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1.5 size-3 rotate-45 rounded-[2px]",
          tone === "mint" ? "bg-mint" : "bg-white",
          tail === "left" ? "left-5" : "right-5",
        )}
      />
    </motion.span>
  );
}
