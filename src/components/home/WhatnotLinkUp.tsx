"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/components/ui/Reveal";

const MINT = "#37F5C7";
const YELLOW = "#FFE600";
const BEAM = "M 95 100 C 150 55, 250 55, 305 100";

/**
 * Grailz Co and Whatnot: the two logos glide in, link up with a mint→yellow beam
 * carrying sparks, then pulse broadcast rings while a LIVE pill blinks.
 * Loops only while on screen; reduced motion shows the linked-up state.
 */
export function WhatnotLinkUp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const play = inView || !!reduce;
  const live = inView && !reduce;

  return (
    <div ref={ref} aria-hidden="true" className="relative mx-auto mt-6 aspect-[2/1] w-full">
      {/* Broadcast rings behind each logo */}
      {live &&
        [
          { x: "23.75%", color: MINT },
          { x: "76.25%", color: YELLOW },
        ].map(({ x, color }, side) =>
          [0, 1, 2].map((i) => (
            <motion.span
              key={`${side}-${i}`}
              className="absolute top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{ left: x, borderColor: color }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 1.4 + i * 0.8 + side * 0.4, ease: "easeOut" }}
            />
          )),
        )}

      {/* Beam with travelling sparks */}
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="link-beam" x1="0" x2="1">
            <stop offset="0" stopColor={MINT} />
            <stop offset="1" stopColor={YELLOW} />
          </linearGradient>
        </defs>
        <path d={BEAM} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" strokeDasharray="4 6" />
        <motion.path
          d={BEAM}
          fill="none"
          stroke="url(#link-beam)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.9, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 6px rgb(55 245 199 / 0.6))" }}
        />
        {live &&
          [0, 0.5, 1].map((d) => (
            <circle key={d} r="3.5" fill="#fff" opacity="0.95">
              <animateMotion dur="1.5s" begin={`${1.6 + d}s`} repeatCount="indefinite" path={BEAM} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
          ))}
      </svg>

      {/* Grailz Co */}
      <motion.div
        className="absolute left-[23.75%] top-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2"
        initial={{ x: -60, opacity: 0, rotate: -20 }}
        animate={play ? { x: 0, opacity: 1, rotate: 0 } : { x: -60, opacity: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <motion.div animate={live ? { y: [0, -6, 0] } : { y: 0 }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
          <Image src="/brand/grailzco-logo.png" alt="" width={192} height={194} className="w-full drop-shadow-[0_0_24px_rgb(55_245_199/0.45)]" />
        </motion.div>
      </motion.div>

      {/* Whatnot */}
      <motion.div
        className="absolute left-[76.25%] top-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2"
        initial={{ x: 60, opacity: 0, rotate: 20 }}
        animate={play ? { x: 0, opacity: 1, rotate: 0 } : { x: 60, opacity: 0 }}
        transition={{ duration: 0.9, delay: reduce ? 0 : 0.15, ease: EASE }}
      >
        <motion.div animate={live ? { y: [0, -6, 0] } : { y: 0 }} transition={{ duration: 3.2, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <Image src="/brand/whatnot-logo.png" alt="" width={290} height={268} className="w-full drop-shadow-[0_0_24px_rgb(255_230_0/0.35)]" />
        </motion.div>
        {/* LIVE pill */}
        <motion.span
          className="absolute -right-2 -top-3 flex items-center gap-1 rounded-full bg-[#ff3b5c] px-2 py-0.5 font-mono text-[0.6rem] font-bold tracking-[0.12em] text-white shadow-[0_6px_16px_-4px_rgb(255_59_92/0.7)]"
          initial={{ scale: 0 }}
          animate={play ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 14, delay: reduce ? 0 : 1.9 }}
        >
          <motion.span
            className="size-1.5 rounded-full bg-white"
            animate={live ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          LIVE
        </motion.span>
      </motion.div>
    </div>
  );
}
