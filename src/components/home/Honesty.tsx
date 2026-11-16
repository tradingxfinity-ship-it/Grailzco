"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";

const PROOF = [
  ["20+ years", "buying collectibles"],
  ["High-end to everyday:", "every card gets the same care"],
  ["Full transparency:", "you see every step"],
] as const;

/** Cards dropped onto the stack, bottom to top: everyday to high-end. The top one flips at the end. */
const STACK = [
  { src: "/images/cards/machamp-1st-edition.png", era: "Vintage", note: "WOTC-era classics", from: [-160, -40], tilt: -7, x: -3 },
  { src: "/images/cards/bulbasaur.png", era: "Everyday", note: "Bulk & commons", from: [170, -60], tilt: 5, x: 3 },
  { src: "/images/cards/kyogre-lv47.png", era: "Classic", note: "2000s favorites", from: [-140, -140], tilt: -3, x: -2 },
  { src: "/images/cards/greninja-ex.png", era: "Modern", note: "Today's hits", from: [160, -130], tilt: 6, x: 2 },
  { src: "/images/cards/victini.png", era: "Japanese", note: "Rare imports", from: [-30, -200], tilt: -4, x: -1 },
  { src: "/images/cards/mega-charizard-x-ex.png", era: "High-end", note: "Grails & chase cards", from: [40, -210], tilt: 1, x: 0 },
] as const;

const START = 0.4; // seconds before the first card drops
const GAP = 0.7; // seconds between drops
const DROP = 0.6; // seconds per drop
const STACKED = START + (STACK.length - 1) * GAP + DROP;
const FLIP_AT = STACKED + 0.5;
const CYCLE_MS = (FLIP_AT + 4.5) * 1000;

/** About Us: 20+ years of cards, high-end to everyday, stacking up and each one evaluated honestly. */
export function Honesty() {
  return (
    <section aria-labelledby="honesty-title" className="relative overflow-hidden bg-white py-20 text-ink md:py-28">
      <div className="container-grail relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="01" className="!text-ink/60 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            About Us
          </SectionLabel>
          <SplitHeadline
            id="honesty-title"
            lines={["Honest offers,", "*every* time."]}
            className="display-md mt-6 text-ink [&_.text-mint]:!text-[#0a9e78]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/70">
              We&apos;ve been buying collectibles for over 20 years, from high-end grails to everyday cards. That
              experience means we know what your collection is worth, and we&apos;ll always tell you straight.
            </p>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink/70">
              Every collection is evaluated with integrity. We show you what we see, explain how we reached our offer,
              and never pressure you to sell.
            </p>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {PROOF.map(([title, rest], i) => (
              <Reveal as="li" key={title} delay={0.25 + i * 0.08} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-mint">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-[0.98rem] text-ink/70">
                  <strong className="font-semibold text-ink">{title}</strong> {rest}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal y={40} className="lg:col-span-7">
          <YearsStack />
        </Reveal>
      </div>
    </section>
  );
}

function YearsStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [cycle, setCycle] = useState(0);
  const [started, setStarted] = useState(false);

  if (inView && !started) setStarted(true);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearTimeout(t);
  }, [inView, cycle]);

  return (
    <div ref={ref}>
      <p className="sr-only">
        Over 20 years we have bought vintage, classic, modern, Japanese, everyday and high-end cards, and every one is
        evaluated honestly.
      </p>
      <div
        aria-hidden="true"
        className="relative aspect-square w-full overflow-hidden rounded-[1.75rem] bg-[radial-gradient(ellipse_at_68%_45%,#0c2349,#04173a_60%,#000a1e)] shadow-[0_40px_80px_-36px_rgb(0_14_40/0.6)] sm:aspect-[5/4]"
      >
        <div className="grid-faint absolute inset-0 opacity-60" />
        <div className="absolute right-[6%] top-[14%] h-[70%] w-[48%] rounded-full bg-mint/[0.08] blur-3xl" />
        <AnimatePresence mode="wait">
          {started && (
            <motion.div
              key={cycle}
              className="absolute inset-0 grid grid-cols-[1.15fr_1fr] items-center gap-[6%] px-[6%] py-[7%]"
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex min-w-0 flex-col gap-5 sm:gap-8">
                <YearCounter />
                <Ledger />
              </div>
              <Stack />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Ticks up to 20 as the cards land, then adds the "+". */
function YearCounter() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const controls = animate(0, 20, {
      duration: STACKED - START,
      delay: START,
      ease: "linear",
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, []);

  return (
    <div>
      <p className="font-display text-[clamp(2.6rem,9vw,4.75rem)] font-bold leading-none tracking-[-0.05em] text-white tabular-nums">
        {String(n).padStart(2, "0")}
        <motion.span
          className="inline-block text-mint"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={done ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 16 }}
        >
          +
        </motion.span>
      </p>
      <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist sm:text-[0.68rem]">
        Years buying collectibles
      </p>
    </div>
  );
}

/** One line per card as it lands: the range of what we buy, from everyday to high-end. */
function Ledger() {
  return (
    <ul className="space-y-1.5 sm:space-y-2">
      {STACK.map((c, i) => (
        <motion.li
          key={c.era}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: START + i * GAP + DROP * 0.7, ease: EASE }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-900/70 px-2 py-1 backdrop-blur sm:px-2.5 sm:py-1.5"
        >
          <span className="hidden w-[6.4em] shrink-0 whitespace-nowrap font-mono sm:block text-[0.5rem] uppercase tracking-[0.1em] text-mint sm:text-[0.62rem]">
            {c.era}
          </span>
          <span className="min-w-0 flex-1 truncate text-[0.6rem] text-white/85 sm:text-[0.74rem]">{c.note}</span>
          <Check className="size-3 shrink-0 text-mint" strokeWidth={3} />
        </motion.li>
      ))}
    </ul>
  );
}

function Stack() {
  const last = STACK.length - 1;
  return (
    <div className="flex flex-col items-center pt-[12%]">
      <div className="relative w-[82%] [perspective:1200px]">
        {STACK.map((c, i) => {
          const isTop = i === last;
          return (
            <motion.div
              key={c.src}
              className="absolute inset-x-0 top-0"
              style={{ zIndex: i }}
              initial={{ x: `${c.from[0]}%`, y: `${c.from[1]}%`, rotate: c.tilt * 4, opacity: 0 }}
              animate={{
                x: `${c.x}%`,
                y: isTop ? [null, `${-i * 1.6}%`, `${-i * 1.6 - 6}%`] : `${-i * 1.6}%`,
                rotate: isTop ? [null, c.tilt, 0] : c.tilt,
                opacity: 1,
                scale: isTop ? [null, 1, 1.06] : 1,
              }}
              transition={{
                default: { duration: DROP, delay: START + i * GAP, ease: [0.3, 1.25, 0.5, 1] },
                opacity: { duration: 0.2, delay: START + i * GAP },
                ...(isTop && {
                  y: { duration: FLIP_AT - (START + i * GAP), delay: START + i * GAP, times: [0, 0.6, 1], ease: EASE },
                  rotate: { duration: FLIP_AT - (START + i * GAP), delay: START + i * GAP, times: [0, 0.6, 1], ease: EASE },
                  scale: { duration: FLIP_AT - (START + i * GAP), delay: START + i * GAP, times: [0, 0.6, 1], ease: EASE },
                }),
              }}
            >
              {isTop ? <FlipCard src={c.src} /> : <CardFace src={c.src} />}
            </motion.div>
          );
        })}
        {/* Spacer so the absolute stack has height */}
        <div className="invisible aspect-[330/460] w-full" />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: FLIP_AT + 0.7, ease: EASE }}
        className="mt-[14%] whitespace-nowrap rounded-full bg-mint px-3 py-1.5 font-mono text-[0.55rem] font-medium uppercase tracking-[0.12em] text-navy sm:text-[0.66rem]"
      >
        <span className="hidden sm:inline">Every card · </span>Same care
      </motion.p>
    </div>
  );
}

function CardFace({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-[4.5%/3.2%] shadow-[0_20px_40px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/15">
      <Image src={src} alt="" width={330} height={460} sizes="(min-width:1024px) 12rem, 30vw" className="block h-auto w-full" />
    </div>
  );
}

/** The top card turns over to show how every card is treated. */
function FlipCard({ src }: { src: string }) {
  return (
    <motion.div
      className="relative [transform-style:preserve-3d]"
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 180 }}
      transition={{ duration: 0.9, delay: FLIP_AT, ease: EASE }}
    >
      <div className="[backface-visibility:hidden]">
        <CardFace src={src} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[4.5%/3.2%] bg-[linear-gradient(160deg,#132c58,#04173a)] px-[10%] text-center shadow-[0_20px_40px_-18px_rgb(0_0_0/0.9),0_0_0_2px_rgb(55_245_199/0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <span className="flex aspect-square w-[30%] items-center justify-center rounded-full bg-mint text-navy shadow-[0_0_30px_rgb(55_245_199/0.5)]">
          <Check className="size-1/2" strokeWidth={3} />
        </span>
        <p className="mt-[12%] font-display text-[clamp(0.85rem,2.4vw,1.25rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          Evaluated honestly
        </p>
        <p className="mt-[6%] font-mono text-[clamp(0.42rem,1.1vw,0.6rem)] uppercase leading-relaxed tracking-[0.12em] text-mist">
          Checked · Explained
          <br />
          Your call
        </p>
      </div>
    </motion.div>
  );
}
