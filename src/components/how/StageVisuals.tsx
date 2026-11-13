"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, CloudUpload, ScanSearch } from "lucide-react";
import { EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Steps 0 → `steps` while the visual is on screen, holds on the last step, then
 * loops. Reduced-motion visitors get the finished state with no looping.
 */
function useSequence(steps: number, interval = 650, hold = 5) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => (t + 1) % (steps + 1 + hold)), interval);
    return () => clearInterval(id);
  }, [inView, reduce, steps, interval, hold]);

  const step = reduce ? steps : Math.min(tick, steps);
  return { ref, step, active: inView && !reduce };
}

const pop = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  transition: { duration: 0.45, ease: EASE },
};

function Frame({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[4/5] w-full rounded-[1.25rem] border border-white/10 bg-navy-900/70 p-5 sm:p-6",
        className,
      )}
    >
      <div aria-hidden="true" className="grid-faint absolute inset-0 rounded-[inherit] opacity-40" />
      <div className="relative flex h-full flex-col">{children}</div>
      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-haze">{label}</p>
    </div>
  );
}

function CardBack({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex aspect-[330/460] items-center justify-center overflow-hidden rounded-[0.4rem] bg-navy-700 ring-1 ring-white/15", className)}>
      <div className="absolute inset-[7%] rounded-[0.3rem] bg-[repeating-linear-gradient(45deg,rgb(55_245_199/0.10)_0_2px,transparent_2px_8px)] ring-1 ring-inset ring-white/10" />
      <Image src="/brand/grailzco-logo.png" alt="" width={48} height={48} className="relative w-[45%]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Share your collection — the form fills itself in and uploads   */
/* ------------------------------------------------------------------ */
export function ShareVisual() {
  const { ref, step } = useSequence(7);
  const fields = [
    { label: "Card name", value: "Charizard ex", at: 1 },
    { label: "Condition", value: "Near Mint", at: 2 },
    { label: "Grading", value: "Ungraded", at: 3 },
  ];

  return (
    <div ref={ref}>
      <Frame label="Stage 01 · Submit">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-white">New submission</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className={cn("h-1 rounded-full transition-all duration-500", step >= 2 + i * 2 ? "w-4 bg-mint" : "w-1.5 bg-white/20")} />
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {fields.map((f) => (
            <div
              key={f.label}
              className={cn(
                "rounded-lg border px-3 py-2 transition-colors duration-500",
                step === f.at ? "border-mint/60 bg-mint/[0.05]" : "border-white/10 bg-navy/60",
              )}
            >
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-haze">{f.label}</p>
              <div className="relative mt-0.5 h-4 text-[0.78rem] font-medium text-white">
                {step >= f.at && (
                  <motion.span
                    key={`${f.label}-${step >= f.at}`}
                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                    animate={{ clipPath: "inset(0 0% 0 0)" }}
                    transition={{ duration: 0.55, ease: "linear" }}
                    className="absolute inset-0 whitespace-nowrap"
                  >
                    {f.value}
                  </motion.span>
                )}
                {step === f.at && <span className="absolute -right-1 top-0.5 h-3 w-px animate-pulse bg-mint" />}
              </div>
            </div>
          ))}
        </div>

        {/* Photo slots */}
        <div className="mx-auto mt-3 grid w-[58%] grid-cols-2 gap-2.5">
          {["Front", "Back"].map((side, i) => (
            <div key={side} className="relative aspect-[330/460] rounded-[0.5rem] border border-dashed border-white/15">
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[0.55rem] uppercase tracking-[0.14em] text-haze">
                {side}
              </span>
              <AnimatePresence>
                {step >= 4 + i && (
                  <motion.div
                    key={side}
                    initial={{ opacity: 0, y: -40, rotate: i ? 8 : -8, scale: 1.1 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="absolute inset-0"
                  >
                    {i === 0 ? (
                      <div className="relative h-full overflow-hidden rounded-[0.4rem] ring-1 ring-white/15">
                        <Image src="/images/cards/charizard-ex.png" alt="" fill sizes="120px" className="object-cover" />
                      </div>
                    ) : (
                      <CardBack className="h-full" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div className="mt-auto pb-5">
          <div className="flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-[0.14em]">
            <span className="flex items-center gap-1.5 text-haze">
              <CloudUpload className="size-3 text-mint" /> {step >= 7 ? "Submitted" : step >= 6 ? "Uploading" : "Ready"}
            </span>
            <span className={step >= 7 ? "text-mint" : "text-haze"}>{step >= 7 ? "100%" : step >= 6 ? "64%" : "0%"}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-mint"
              initial={false}
              animate={{ width: step >= 7 ? "100%" : step >= 6 ? "64%" : "0%" }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </div>
        </div>

        <AnimatePresence>
          {step >= 7 && (
            <motion.div
              {...pop}
              className="absolute left-1/2 top-[60%] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-mint px-4 py-2 text-xs font-semibold text-navy shadow-[0_10px_40px_-6px_rgb(55_245_199/0.7)]"
            >
              <Check className="size-4" strokeWidth={3} /> Submission sent
            </motion.div>
          )}
        </AnimatePresence>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Collection review — scan line and inspection callouts          */
/* ------------------------------------------------------------------ */
export function ReviewVisual() {
  const { ref, step, active } = useSequence(5, 800, 4);
  const points = [
    { label: "Corners", at: 1, dot: "left-[6%] top-[5%]", tag: "left-[-4%] top-[-3%] -translate-x-full" },
    { label: "Edges", at: 2, dot: "right-[2%] top-[34%]", tag: "left-[104%] top-[30%]" },
    { label: "Surface", at: 3, dot: "left-[48%] top-[30%]", tag: "left-[-4%] top-[44%] -translate-x-full" },
    { label: "Centering", at: 4, dot: "left-[50%] bottom-[4%]", tag: "left-[104%] top-[80%]" },
  ];

  return (
    <div ref={ref}>
      <Frame label="Stage 02 · Review">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-white">
            <ScanSearch className="size-4 text-mint" /> Reviewing
          </p>
          <span className="font-mono text-[0.6rem] text-mint">{Math.min(step, 4)}/4</span>
        </div>

        <div className="relative mx-auto my-auto w-[46%] sm:w-[52%]">
          {/* Card with corner brackets */}
          <div className="relative aspect-[330/460] overflow-hidden rounded-[0.45rem] shadow-[0_24px_50px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/15">
            <Image src="/images/cards/machamp-1st-edition.png" alt="" fill sizes="180px" className="object-cover" />
            {/* Scan line */}
            <motion.div
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-mint/35 to-transparent"
              animate={active ? { top: ["-15%", "100%"] } : { top: "-15%" }}
              transition={active ? { duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 } : { duration: 0 }}
            />
          </div>
          {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
            <span key={c} className={cn("absolute -m-2 size-4 rounded-[3px] border-mint", c)} />
          ))}

          {/* Callouts */}
          {points.map((p) => (
            <AnimatePresence key={p.label}>
              {step >= p.at && (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn("absolute size-2.5 rounded-full bg-mint shadow-[0_0_0_4px_rgb(55_245_199/0.25)]", p.dot)}
                  />
                  <motion.span
                    {...pop}
                    className={cn(
                      "absolute flex items-center gap-1 whitespace-nowrap rounded-full border border-mint/40 bg-navy/95 px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-white",
                      p.tag,
                    )}
                  >
                    <Check className="size-2.5 text-mint" strokeWidth={3} />
                    {p.label}
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1.5 pb-5">
          {points.map((p) => (
            <div key={p.label} className="h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-mint"
                initial={false}
                animate={{ width: step >= p.at ? "100%" : "0%" }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Offer & next steps — a conversation with no obligation         */
/* ------------------------------------------------------------------ */
export function ConversationVisual() {
  const { ref, step } = useSequence(5, 900, 4);

  return (
    <div ref={ref}>
      <Frame label="Stage 03 · Next steps">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/brand/grailzco-logo.png" alt="" width={28} height={28} className="size-7" />
            <div>
              <p className="text-xs font-semibold text-white">Grailz Co</p>
              <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-mint">Direct to you</p>
            </div>
          </div>
          <span className="rounded-full border border-white/15 px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-mist">No obligation</span>
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-2.5">
          <AnimatePresence>
            {step >= 1 && (
              <motion.div key="m1" {...pop} className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-navy-700 px-3.5 py-2.5 text-[0.75rem] leading-snug text-white">
                Thanks for sending your cards over.
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="typing" {...pop} className="flex gap-1 self-start rounded-2xl rounded-tl-sm bg-navy-700 px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-mist"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="m2" {...pop} className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-navy-700 px-3.5 py-2.5 text-[0.75rem] leading-snug text-white">
                We&apos;ve taken a look. Let&apos;s talk about next steps.
              </motion.div>
            )}
            {step >= 4 && (
              <motion.div key="choices" {...pop} className="flex flex-wrap gap-1.5 self-start">
                <span className="rounded-full border border-mint/50 bg-mint/10 px-3 py-1.5 text-[0.68rem] font-medium text-mint">View next steps</span>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-[0.68rem] text-mist">Ask a question</span>
              </motion.div>
            )}
            {step >= 5 && (
              <motion.div key="m3" {...pop} className="mt-auto max-w-[75%] self-end rounded-2xl rounded-tr-sm bg-mint px-3.5 py-2.5 text-[0.75rem] font-medium leading-snug text-navy">
                Sounds great, let&apos;s chat!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-6" />
      </Frame>
    </div>
  );
}
