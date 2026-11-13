"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Camera, Check } from "lucide-react";
import { EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const CHARIZARD = "/images/cards/charizard-ex.png";
const MACHAMP = "/images/cards/machamp-1st-edition.png";
const LOGO = "/brand/grailzco-logo.png";
const CARD_RATIO = 460 / 330;

/**
 * Steps 0 → `steps` while the visual is on screen, holds on the last step, then
 * loops. Reduced-motion visitors get the finished state with no looping.
 */
function useSequence(steps: number, interval = 700, hold = 5) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), interval);
    return () => clearInterval(id);
  }, [inView, reduce, interval]);

  const cycle = steps + 1 + hold;
  const step = reduce ? steps : Math.min(tick % cycle, steps);
  return { ref, step, active: inView && !reduce, loop: Math.floor(tick / cycle) };
}

const pop = {
  initial: { opacity: 0, y: 8, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  transition: { duration: 0.45, ease: EASE },
};

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div aria-hidden="true" className="relative aspect-[4/5] w-full rounded-[1.25rem] border border-white/10 bg-navy-900/70 p-5 sm:p-6">
      <div className="grid-faint absolute inset-0 rounded-[inherit] opacity-40" />
      <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_40%,rgb(55_245_199/0.08),transparent_60%)]" />
      <div className="relative flex h-full flex-col">{children}</div>
      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-haze">{label}</p>
    </div>
  );
}

function Header({ icon, title, right }: { icon?: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-white">
        {icon}
        {title}
      </p>
      {right}
    </div>
  );
}

function CardImg({ src, className, sizes = "160px" }: { src: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative aspect-[330/460] overflow-hidden rounded-[0.4rem] ring-1 ring-white/15", className)}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  );
}

function CardBack({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex aspect-[330/460] items-center justify-center overflow-hidden rounded-[0.4rem] bg-navy-700 ring-1 ring-white/15", className)}>
      <div className="absolute inset-[7%] rounded-[0.3rem] bg-[repeating-linear-gradient(45deg,rgb(55_245_199/0.10)_0_2px,transparent_2px_8px)] ring-1 ring-inset ring-white/10" />
      <Image src={LOGO} alt="" width={48} height={48} className="relative w-[45%]" />
    </div>
  );
}

/** Radial burst of mint particles; give it a new `key` to replay. */
function Burst({ count = 14, radius = 70, className }: { count?: number; radius?: number; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute left-1/2 top-1/2", className)}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = radius * (0.7 + ((i * 37) % 10) / 25);
        return (
          <motion.span
            key={i}
            className={cn("absolute -ml-1 -mt-1 rounded-full", i % 3 === 0 ? "size-1.5 bg-white" : "size-2 bg-mint")}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}

const BRACKETS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

/* ------------------------------------------------------------------ */
/* 01 · Capture & send                                                 */
/* ------------------------------------------------------------------ */
export function ShareVisual() {
  const { ref, step, loop } = useSequence(8, 700, 5);
  const locked = step === 1 || step === 3;
  const sending = step >= 6;
  const chips = ["Charizard ex", "Near Mint", "Ungraded"];

  return (
    <div ref={ref}>
      <Frame label="Stage 01 · Capture & send">
        <Header
          icon={<Camera className="size-4 text-mint" />}
          title="Snap & submit"
          right={
            <span className="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-haze">
              <span className={cn("size-1.5 rounded-full", step < 7 ? "animate-pulse bg-[#ff6b6b]" : "bg-mint")} />
              {step < 3 ? "Front" : step < 5 ? "Back" : step < 7 ? "Details" : "Sent"}
            </span>
          }
        />

        {/* Viewfinder */}
        <div className="relative mt-4 flex h-[46%] w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-navy/80">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:33.33%_33.33%]" />
          <motion.div
            className="relative w-[26%] [perspective:600px] sm:w-[34%]"
            animate={{ y: sending ? -12 : 0, scale: sending ? 0.9 : 1, opacity: sending ? 0.25 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <motion.div
              className="relative [transform-style:preserve-3d]"
              animate={{ rotateY: step >= 3 ? 180 : 0, rotateZ: step === 0 ? -6 : 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="[backface-visibility:hidden]">
                <CardImg src={CHARIZARD} sizes="120px" />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <CardBack />
              </div>
            </motion.div>
            {/* focus brackets: loose, then they snap onto the card */}
            {BRACKETS.map((c) => (
              <motion.span
                key={c}
                className={cn("absolute size-4 rounded-[3px] transition-colors", c, locked ? "border-mint" : "border-white/50")}
                initial={false}
                animate={{ margin: locked ? -6 : -18 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            ))}
          </motion.div>
          {/* shutter flash */}
          <AnimatePresence>
            {(step === 2 || step === 4) && (
              <motion.div
                key={`flash-${step}-${loop}`}
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </AnimatePresence>
          <span className="absolute bottom-2 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white/70">
            <motion.span className="size-3.5 rounded-full bg-white" animate={{ scale: step === 2 || step === 4 ? 0.55 : 1 }} transition={{ duration: 0.2 }} />
          </span>
        </div>

        {/* Tray: captured photos + details */}
        <div className="mt-3 flex items-center gap-2.5">
          {[0, 1].map((i) => (
            <div key={i} className="relative aspect-[330/460] w-[16%] rounded-[0.35rem] border border-dashed border-white/15">
              <AnimatePresence>
                {step >= 2 + i * 2 && (
                  <motion.div
                    key={`shot-${i}-${loop}`}
                    className="absolute inset-0"
                    initial={{ y: -90, x: 60 - i * 20, scale: 2.2, opacity: 0, rotate: i ? 12 : -12 }}
                    animate={sending ? { y: 60, x: -20, scale: 0.2, opacity: 0 } : { y: 0, x: 0, scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={sending ? { duration: 0.55, delay: i * 0.1, ease: [0.5, 0, 0.75, 0] } : { type: "spring", stiffness: 220, damping: 20 }}
                  >
                    {i === 0 ? <CardImg src={CHARIZARD} sizes="60px" className="h-full" /> : <CardBack className="h-full" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
            <AnimatePresence>
              {step >= 5 &&
                step < 7 &&
                chips.map((c, i) => (
                  <motion.span
                    key={`${c}-${loop}`}
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={sending ? { opacity: 0, y: 50, x: -60, scale: 0.4 } : { opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                    className="truncate rounded-full border border-mint/40 bg-mint/10 px-2 py-0.5 text-[0.6rem] text-mint"
                  >
                    {c}
                  </motion.span>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Upload ring */}
        <div className="relative mt-auto flex items-center gap-3 pb-6">
          <div className="relative size-12 shrink-0">
            <svg viewBox="0 0 48 48" className="size-12 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#37F5C7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="125.7"
                initial={false}
                animate={{ strokeDashoffset: step >= 7 ? 0 : sending ? 50 : 125.7 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </svg>
            <AnimatePresence>
              {step >= 7 && (
                <motion.span
                  key={`ok-${loop}`}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="absolute inset-1.5 flex items-center justify-center rounded-full bg-mint text-navy"
                >
                  <Check className="size-5" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
            {step >= 7 && <Burst key={`b1-${loop}`} radius={46} count={12} />}
            {/* data particles streaming into the ring */}
            {step === 6 &&
              Array.from({ length: 8 }, (_, i) => (
                <motion.span
                  key={`p${i}-${loop}`}
                  className="absolute left-1/2 top-1/2 -ml-0.5 -mt-0.5 size-1.5 rounded-full bg-mint"
                  initial={{ x: 40 + i * 14, y: -70 - (i % 3) * 10, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeIn" }}
                />
              ))}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{step >= 7 ? "Submission sent" : sending ? "Uploading…" : "Ready to send"}</p>
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-haze">2 photos · 3 details</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Inspection — 3D card, travelling loupe, review stamp           */
/* ------------------------------------------------------------------ */
const LOUPE = 0.46; // loupe diameter as a fraction of card width
const ZOOM = 2.6;

/** background-position (%) that centres point (px, py) of the card inside the loupe */
function loupeBg(px: number, py: number) {
  const sx = ZOOM / LOUPE;
  const sy = (ZOOM * CARD_RATIO) / LOUPE;
  return `${((px * sx - 0.5) / (sx - 1)) * 100}% ${((py * sy - 0.5) / (sy - 1)) * 100}%`;
}

const INSPECT = [
  { label: "Corners", x: 0.1, y: 0.07 },
  { label: "Edges", x: 0.95, y: 0.42 },
  { label: "Surface", x: 0.5, y: 0.3 },
  { label: "Centering", x: 0.5, y: 0.93 },
];

export function ReviewVisual() {
  const { ref, step, active, loop } = useSequence(5, 900, 4);
  const current = INSPECT[Math.min(Math.max(step - 1, 0), 3)];
  const inspecting = step >= 1 && step <= 4;

  return (
    <div ref={ref}>
      <Frame label="Stage 02 · Inspection">
        <Header title="Inspection" right={<span className="font-mono text-[0.6rem] text-mint">{Math.min(step, 4)}/4</span>} />

        <div className="relative mx-auto my-auto w-[48%] [perspective:700px]">
          <motion.div
            className="relative [transform-style:preserve-3d]"
            animate={active ? { rotateY: [-10, 10, -10], rotateX: [4, -3, 4] } : { rotateY: 0, rotateX: 0 }}
            transition={active ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-[0.45rem] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)]">
              <CardImg src={MACHAMP} sizes="200px" />
              {/* moving holo shine */}
              <motion.div
                className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgb(255_255_255/0.35)_45%,rgb(55_245_199/0.35)_50%,rgb(150_120_255/0.25)_55%,transparent_70%)] mix-blend-screen"
                style={{ backgroundSize: "250% 100%" }}
                animate={active ? { backgroundPosition: ["150% 0%", "-50% 0%"] } : { backgroundPosition: "150% 0%" }}
                transition={active ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
              />
            </div>

            {/* radar ping at the inspected point */}
            {inspecting && (
              <span key={`ping-${step}-${loop}`} className="absolute" style={{ left: `${current.x * 100}%`, top: `${current.y * 100}%` }}>
                {[0, 0.35].map((d) => (
                  <motion.span
                    key={d}
                    className="absolute -left-6 -top-6 size-12 rounded-full border-2 border-mint"
                    initial={{ scale: 0.2, opacity: 1 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.9, delay: d, ease: "easeOut" }}
                  />
                ))}
              </span>
            )}

            {/* loupe: a zoomed window onto the same card */}
            <motion.div
              className="absolute z-10 rounded-full border-2 border-mint shadow-[0_0_0_5px_rgb(55_245_199/0.15),0_18px_40px_-10px_rgb(0_0_0/0.9)]"
              style={{
                width: `${LOUPE * 100}%`,
                aspectRatio: "1",
                backgroundImage: `url(${MACHAMP})`,
                backgroundSize: `${(ZOOM / LOUPE) * 100}% auto`,
                backgroundRepeat: "no-repeat",
                translate: "-50% -50%",
              }}
              initial={false}
              animate={{
                left: `${current.x * 100}%`,
                top: `${current.y * 100}%`,
                backgroundPosition: loupeBg(current.x, current.y),
                opacity: inspecting ? 1 : 0,
                scale: inspecting ? 1 : 0.6,
              }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.35),transparent_45%)]" />
              <AnimatePresence mode="wait">
                {inspecting && (
                  <motion.span
                    key={current.label}
                    {...pop}
                    className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-2 py-0.5 font-mono text-[0.55rem] font-medium uppercase tracking-[0.1em] text-navy"
                  >
                    {current.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* review stamp */}
            <AnimatePresence>
              {step >= 5 && (
                <motion.div
                  key={`stamp-${loop}`}
                  className="absolute inset-x-[-4%] top-1/2 z-20 -mt-5 flex items-center justify-center gap-1.5 rounded-md border-[3px] border-mint bg-navy/85 py-1.5 font-display text-sm font-bold uppercase tracking-[0.18em] text-mint shadow-[0_0_30px_rgb(55_245_199/0.35)]"
                  initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                >
                  <Check className="size-4" strokeWidth={3} /> Reviewed
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {step >= 5 && <Burst key={`b2-${loop}`} radius={90} count={16} />}
        </div>

        <div className="grid grid-cols-4 gap-1.5 pb-6">
          {INSPECT.map((p, i) => (
            <div key={p.label}>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-mint" initial={false} animate={{ width: step >= i + 1 ? "100%" : "0%" }} transition={{ duration: 0.6, ease: EASE }} />
              </div>
              <p className={cn("mt-1 text-center font-mono text-[0.48rem] uppercase tracking-[0.08em] transition-colors", step >= i + 1 ? "text-mint" : "text-haze")}>
                {p.label}
              </p>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Connection — beam between Grailz Co and you, then the chat     */
/* ------------------------------------------------------------------ */
const BEAM = "M 30 40 C 110 -5, 190 85, 270 40";

function Bubble({ from, children }: { from: "us" | "you"; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === "us" ? -30 : 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn(
        "max-w-[85%] rounded-2xl px-3 py-2 text-[0.72rem] leading-snug",
        from === "us" ? "self-start rounded-tl-sm bg-navy-700 text-white" : "self-end rounded-tr-sm bg-mint font-medium text-navy",
      )}
    >
      {children}
    </motion.div>
  );
}

export function ConversationVisual() {
  const { ref, step, active, loop } = useSequence(6, 850, 4);

  return (
    <div ref={ref}>
      <Frame label="Stage 03 · Connect">
        {/* Nodes + beam */}
        <div className="relative h-20">
          <svg viewBox="0 0 300 80" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
            <path d={BEAM} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" strokeDasharray="4 6" />
            <motion.path
              d={BEAM}
              fill="none"
              stroke="#37F5C7"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ filter: "drop-shadow(0 0 4px rgb(55 245 199 / 0.8))" }}
            />
            {active &&
              step >= 1 &&
              [0, 0.6, 1.2].map((d) => (
                <circle key={d} r="3.5" fill="#fff">
                  <animateMotion dur="1.8s" begin={`${d}s`} repeatCount="indefinite" path={BEAM} />
                </circle>
              ))}
          </svg>
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1">
            <motion.div
              className="rounded-full"
              animate={{ boxShadow: step >= 1 ? "0 0 0 6px rgb(55 245 199 / 0.18)" : "0 0 0 0px rgb(55 245 199 / 0)" }}
            >
              <Image src={LOGO} alt="" width={40} height={40} className="size-10" />
            </motion.div>
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-mint">Grailz Co</span>
          </div>
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1">
            <motion.div
              className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-mint to-[#7a6cf0] font-display text-xs font-bold text-navy"
              animate={{ scale: step === 5 ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              You
            </motion.div>
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-haze">Collector</span>
          </div>
        </div>

        {/* Thread */}
        <div className="mt-4 flex flex-1 flex-col gap-2">
          <AnimatePresence>
            {step >= 2 && (
              <Bubble key={`m1-${loop}`} from="us">
                Thanks for sending your cards over.
              </Bubble>
            )}
            {step === 3 && (
              <motion.div key={`typing-${loop}`} {...pop} className="flex gap-1 self-start rounded-2xl rounded-tl-sm bg-navy-700 px-3 py-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-mist"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.div>
            )}
            {step >= 4 && (
              <Bubble key={`m2-${loop}`} from="us">
                We&apos;ve taken a look. Let&apos;s talk next steps.
              </Bubble>
            )}
            {step >= 5 && (
              <Bubble key={`m3-${loop}`} from="you">
                Sounds great, let&apos;s chat!
              </Bubble>
            )}
          </AnimatePresence>

          <div className="relative mt-auto pb-6">
            <AnimatePresence>
              {step >= 6 && (
                <motion.div
                  key={`done-${loop}`}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-mint/40 bg-mint/10 py-2 text-xs font-semibold text-mint"
                >
                  <Check className="size-4" strokeWidth={3} /> Connected · no obligation
                  <Burst radius={80} count={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Frame>
    </div>
  );
}
