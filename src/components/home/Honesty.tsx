"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, Search, User } from "lucide-react";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** The four chapters of the story, in order. */
const CHAPTERS = [
  { tag: "Received", caption: "We get your card" },
  { tag: "Reviewed", caption: "We check it in the open" },
  { tag: "Explained", caption: "We show you how we got the number" },
  { tag: "Paid", caption: "You get paid. No surprises." },
] as const;

const CHAPTER_MS = 4000;
const CHECKS = ["Corners", "Surface", "Edges", "Centering"] as const;

/** About Us: a looping short story of one card, from arrival to payment, with nothing hidden. */
export function Honesty() {
  return (
    <section aria-labelledby="honesty-title" className="relative overflow-hidden bg-white py-20 text-ink md:py-28">
      <div className="container-grail relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="01" className="!text-ink/60 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            About Us
          </SectionLabel>
          <SplitHeadline id="honesty-title" lines={["Straight talk,", "no *games.*"]} className="display-md mt-6 text-ink [&_.text-mint]:!text-[#0a9e78]" />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-ink/70">We&apos;re collectors too. Here&apos;s what happens to your card, with nothing hidden.</p>
          </Reveal>
        </div>
        <Reveal y={40} className="lg:col-span-7">
          <Story />
        </Reveal>
      </div>
    </section>
  );
}

function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(0);
  // Bumped on every manual pick so the progress bar and timer restart.
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % CHAPTERS.length), CHAPTER_MS);
    return () => clearTimeout(t);
  }, [inView, step, run]);

  return (
    <div ref={ref}>
      <p className="sr-only">
        How it works: we receive your card, review its condition in the open, explain how we reached our offer, and then
        you get paid.
      </p>

      <div
        aria-hidden="true"
        className="relative aspect-square w-full sm:aspect-[5/4] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-36px_rgb(0_14_40/0.6)] bg-[radial-gradient(ellipse_at_50%_40%,#0c2349,#04173a_60%,#000a1e)]"
      >
        <div className="grid-faint absolute inset-0 opacity-60" />

        {/* Caption */}
        <div className="absolute inset-x-0 top-[5%] z-30 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/80 px-3.5 py-1.5 backdrop-blur"
            >
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-mint sm:text-[0.68rem]">
                0{step + 1} · {CHAPTERS[step].tag}
              </span>
              <span className="text-[0.75rem] font-medium text-white sm:text-[0.88rem]">{CHAPTERS[step].caption}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <Package show={step === 0} />
        <Checklist show={step === 1} />
        <Receipt show={step === 2} />
        <Payout show={step === 3} />
        <StoryCard step={step} />
      </div>

      {/* Chapter progress */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.tag}
            type="button"
            onClick={() => {
              setStep(i);
              setRun((r) => r + 1);
            }}
            aria-label={`Show step ${i + 1}: ${c.tag}`}
            aria-current={i === step ? "step" : undefined}
            className="group text-left"
          >
            <span className="block h-1 overflow-hidden rounded-full bg-ink/10">
              <span
                key={i === step ? `${step}-${run}` : "idle"}
                className={cn(
                  "block h-full rounded-full bg-[#0a9e78]",
                  i < step ? "w-full" : i === step ? (inView ? "story-fill" : "w-0") : "w-0",
                )}
                style={{ animationDuration: `${CHAPTER_MS}ms` }}
              />
            </span>
            <span
              className={cn(
                "mt-2 block font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors sm:text-[0.66rem]",
                i === step ? "text-[#0a9e78]" : "text-ink/45 group-hover:text-ink",
              )}
            >
              {c.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Where the card sits in each chapter (percent of the stage). */
const CARD_POSE = [
  { left: "36%", top: ["58%", "21%"], rotate: -3, scale: 1, opacity: [0, 1] },
  { left: "14%", top: "24%", rotate: 0, scale: 1.05, opacity: 1 },
  { left: "9%", top: "27%", rotate: -5, scale: 0.92, opacity: 1 },
  { left: "63%", top: "27%", rotate: 4, scale: 0.78, opacity: 1 },
] as const;

function StoryCard({ step }: { step: number }) {
  const pose = CARD_POSE[step];
  return (
    <motion.div
      className="absolute z-20 w-[28%]"
      initial={false}
      animate={pose as unknown as Record<string, string | number>}
      transition={{ duration: step === 0 ? 1.1 : 0.9, ease: EASE }}
    >
      <div className="relative overflow-hidden rounded-[4.5%/3.2%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.85)] ring-1 ring-white/15">
        <Image src="/images/cards/charizard-ex.png" alt="" width={330} height={460} sizes="(min-width:1024px) 12rem, 28vw" className="block h-auto w-full" />
        {step === 1 && (
          <motion.span
            className="absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-transparent via-mint/40 to-transparent mix-blend-screen"
            animate={{ y: ["-100%", "620%"] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
          />
        )}
      </div>

      {/* Magnifier tours the four checks */}
      <AnimatePresence>
        {step === 1 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              left: ["-12%", "-12%", "28%", "68%", "28%"],
              top: ["-8%", "-8%", "26%", "46%", "78%"],
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              left: { duration: 3, times: [0, 0.15, 0.4, 0.65, 0.9], ease: "easeInOut" },
              top: { duration: 3, times: [0, 0.15, 0.4, 0.65, 0.9], ease: "easeInOut" },
            }}
            className="absolute flex size-[44%] items-center justify-center rounded-full border-[3px] border-white/90 bg-white/10 shadow-[0_10px_30px_-6px_rgb(0_0_0/0.7),inset_0_0_20px_rgb(255_255_255/0.25)] backdrop-brightness-125 backdrop-contrast-125"
          >
            <span className="absolute -bottom-[38%] -right-[38%] h-[48%] w-[14%] origin-top -rotate-45 rounded-full bg-white/90" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Package({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute bottom-[7%] left-1/2 z-10 h-[24%] w-[48%] -translate-x-1/2"
        >
          {/* Open flaps */}
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: -38 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="absolute -top-[22%] left-0 h-[30%] w-1/2 origin-bottom-left rounded-t-md bg-navy-600"
          />
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: 38 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="absolute -top-[22%] right-0 h-[30%] w-1/2 origin-bottom-right rounded-t-md bg-navy-600"
          />
          <div className="relative flex h-full items-center justify-center rounded-lg bg-gradient-to-b from-navy-700 to-navy-800 ring-1 ring-white/10">
            <span className="absolute inset-y-0 left-1/2 w-[14%] -translate-x-1/2 bg-mint/70" />
            <span className="relative rounded-sm bg-paper px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-ink sm:text-[0.62rem]">
              To: Grailz Co
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Checklist({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.ul
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute right-[7%] top-[24%] z-10 w-[42%] space-y-[4%]"
        >
          {CHECKS.map((c, i) => (
            <li key={c} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-navy-900/70 px-3 py-2 backdrop-blur">
              <motion.span
                initial={{ backgroundColor: "rgb(255 255 255 / 0.08)", color: "rgb(255 255 255 / 0)" }}
                animate={{ backgroundColor: "#37F5C7", color: "#000E28" }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.75 }}
                className="flex size-5 shrink-0 items-center justify-center rounded-full"
              >
                <Check className="size-3" strokeWidth={3} />
              </motion.span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white sm:text-[0.72rem]">{c}</span>
              <Search className="ml-auto size-3.5 text-haze" />
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

const RECEIPT_LINES = ["Card: Charizard ex", "Condition notes", "Market check", "Shared with you"] as const;

function Receipt({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute right-[6%] top-[19%] z-10 w-[48%]"
        >
          {/* Printer slot */}
          <div className="relative z-10 h-3 rounded-full bg-navy-600 ring-1 ring-white/15" />
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.8, delay: 0.3, ease: "linear" }}
            className="mx-[5%] -mt-1.5 rounded-b-md bg-paper px-[8%] pb-4 pt-4 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.9)]"
          >
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-ink/50 sm:text-[0.62rem]">Your breakdown</p>
            <ul className="mt-2 space-y-1.5">
              {RECEIPT_LINES.map((l) => (
                <li key={l} className="flex items-center justify-between gap-2 text-[0.62rem] sm:text-[0.78rem]">
                  <span className="truncate">{l}</span>
                  <Check className="size-3 shrink-0 text-[#0a9e78]" strokeWidth={3} />
                </li>
              ))}
            </ul>
            <div className="my-2.5 border-t border-dashed border-ink/25" />
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap font-display text-[0.75rem] font-bold sm:text-[0.95rem]">Your offer</span>
              <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-mint sm:text-[0.62rem]">
                Explained
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Payout({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-10"
        >
          {/* You */}
          <div className="absolute left-[9%] top-[38%] flex w-[22%] flex-col items-center">
            <span className="flex aspect-square w-[62%] items-center justify-center rounded-full border border-mint/40 bg-mint/10 text-mint">
              <User className="size-1/2" />
            </span>
            <span className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white sm:text-[0.7rem]">You</span>
          </div>

          {/* Track between you and us */}
          <div className="absolute left-[30%] right-[38%] top-[52%] border-t border-dashed border-white/25" />

          {/* Cash travels to you */}
          <motion.div
            initial={{ left: "52%", opacity: 0 }}
            animate={{ left: "33%", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
            className="absolute top-[44%] w-[16%]"
          >
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className="absolute inset-x-0 flex aspect-[2/1] items-center justify-center rounded-md border border-navy/20 bg-mint font-display text-sm font-bold text-navy shadow-[0_10px_20px_-10px_rgb(0_0_0/0.8)]"
                style={{ top: `${n * -10}%`, left: `${n * 6}%`, transform: `rotate(${(n - 1) * 5}deg)` }}
              >
                $
              </span>
            ))}
          </motion.div>

          <span className="absolute left-[63%] top-[73%] w-[28%] text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white sm:text-[0.7rem]">
            Grailz Co
          </span>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.9, ease: EASE }}
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-3.5 py-1.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.12em] text-navy sm:text-[0.7rem]"
          >
            Paid · Deal done
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
