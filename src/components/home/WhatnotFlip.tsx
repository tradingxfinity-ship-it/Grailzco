"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/** One flip cycle: hold Grailz Co, turn, hold Whatnot, turn back. */
const CYCLE = 6;
const TIMES = [0, 0.38, 0.5, 0.88, 1];
const loop = { duration: CYCLE, repeat: Infinity, ease: "easeInOut" as const, times: TIMES };

/**
 * A single trading card that flips between a Grailz Co face and a Whatnot face,
 * with a holo shine on every turn and a glow that follows the side showing.
 * Runs only while on screen; reduced motion shows the Grailz Co face.
 */
export function WhatnotFlip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const live = inView && !reduce;

  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto mt-4 flex aspect-[16/11] w-full items-center justify-center [perspective:1100px]">
      {/* Glow that shifts mint ↔ yellow with the face showing */}
      <motion.div
        className="absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/30 blur-[60px]"
        animate={live ? { opacity: [1, 1, 0, 0, 1] } : { opacity: 1 }}
        transition={live ? loop : { duration: 0.3 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE600]/25 blur-[60px]"
        animate={live ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 0 }}
        transition={live ? loop : { duration: 0.3 }}
      />

      {/* Floor shadow that squeezes as the card turns edge-on */}
      <motion.div
        className="absolute bottom-[4%] left-1/2 h-4 w-[34%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-md"
        animate={live ? { scaleX: [1, 1, 0.35, 1, 1, 0.35, 1] } : { scaleX: 1 }}
        transition={live ? { ...loop, times: [0, 0.38, 0.44, 0.5, 0.88, 0.94, 1] } : { duration: 0.3 }}
      />

      {/* Gentle float */}
      <motion.div
        className="relative w-[40%]"
        animate={live ? { y: [0, -8, 0] } : { y: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative aspect-[330/460] [transform-style:preserve-3d]"
          initial={false}
          animate={live ? { rotateY: [0, 0, 180, 180, 360] } : { rotateY: 0 }}
          transition={live ? loop : { duration: 0.4 }}
        >
          <Face>
            <CardFace
              className="bg-[linear-gradient(160deg,#0f2a57,#000e28_60%)] ring-mint/50"
              label="Grailz Co"
              sub="Collector-first"
              accent="text-mint"
            >
              <Image src="/brand/grailzco-logo.png" alt="" width={192} height={194} className="w-[62%] drop-shadow-[0_0_18px_rgb(55_245_199/0.5)]" />
            </CardFace>
            <Shine live={live} at={0} />
          </Face>
          <Face back>
            <CardFace
              className="bg-[linear-gradient(160deg,#3a3a3a,#1c1c1c_60%)] ring-[#FFE600]/50"
              label="Whatnot"
              sub="@grailzco · Live"
              accent="text-[#FFE600]"
            >
              <Image src="/brand/whatnot-logo.png" alt="" width={290} height={268} className="w-[66%] drop-shadow-[0_0_18px_rgb(255_230_0/0.35)]" />
            </CardFace>
            <Shine live={live} at={0.5} />
          </Face>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Face({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden rounded-[0.9rem] [backface-visibility:hidden]", back && "[transform:rotateY(180deg)]")}>
      {children}
    </div>
  );
}

/** Trading-card layout: inner frame, top label, centred logo, bottom caption. */
function CardFace({
  children,
  className,
  label,
  sub,
  accent,
}: {
  children: React.ReactNode;
  className: string;
  label: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className={cn("relative flex h-full flex-col p-[7%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-2 ring-inset", className)}>
      <div className="absolute inset-[4%] rounded-[0.6rem] border border-white/10" />
      <div className="relative flex items-center justify-between font-mono text-[clamp(0.45rem,0.75vw,0.62rem)] uppercase tracking-[0.16em]">
        <span className={accent}>{label}</span>
        <span className="text-white/50">★</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center">{children}</div>
      <div className="relative border-t border-white/10 pt-[5%] text-center font-mono text-[clamp(0.42rem,0.68vw,0.56rem)] uppercase tracking-[0.14em] text-white/60">
        {sub}
      </div>
    </div>
  );
}

/** Holo shine that sweeps across a face just before it turns away. */
function Shine({ live, at }: { live: boolean; at: number }) {
  // sweep during the hold right before this face flips (0.2–0.36 or 0.7–0.86 of the cycle)
  const start = at + 0.2;
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.45)_47%,rgb(55_245_199/0.35)_50%,rgb(255_230_0/0.3)_53%,transparent_65%)] mix-blend-screen"
      style={{ backgroundSize: "300% 100%" }}
      animate={live ? { backgroundPosition: ["120% 0%", "120% 0%", "-20% 0%", "-20% 0%"] } : { backgroundPosition: "120% 0%" }}
      transition={live ? { duration: CYCLE, repeat: Infinity, ease: "easeInOut", times: [0, start, start + 0.16, 1] } : { duration: 0 }}
    />
  );
}
