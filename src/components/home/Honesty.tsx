"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Eye, Handshake, ReceiptText } from "lucide-react";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";

const PROMISES = [
  {
    icon: Eye,
    title: "We tell you what we see",
    body: "Corners, edges, surface and centering, explained in plain words. The good and the not-so-good.",
  },
  {
    icon: ReceiptText,
    title: "We explain the number",
    body: "If we make an offer, we walk you through how we got there, so it never feels like a guess.",
  },
  {
    icon: Handshake,
    title: "No pressure, ever",
    body: "Take the offer or don't. Ask as many questions as you like. It's your collection and your call.",
  },
] as const;

/**
 * Callouts around the card, in a 0–100 square. `anchor` sits on the card,
 * `elbow` is where the leader line meets the chip; `chip` positions the label.
 */
const CALLOUTS = [
  { label: "Corners", note: "Checked up close", anchor: [31.5, 23.5], elbow: [17, 11], chip: "left-0 top-[4%]" },
  { label: "Surface", note: "Scratches & marks", anchor: [58, 40], elbow: [83, 17], chip: "right-0 top-[10%]" },
  { label: "Edges", note: "Whitening & wear", anchor: [69, 62], elbow: [83, 73], chip: "right-0 top-[67%]" },
  { label: "Centering", note: "Front & back", anchor: [42, 76.5], elbow: [17, 89], chip: "left-0 bottom-[4%]" },
] as const;

/** About Us: how Grailz Co evaluates a collection, honestly and in the open. */
export function Honesty() {
  return (
    <section aria-labelledby="honesty-title" className="relative overflow-hidden bg-navy-900 py-20 md:py-28">
      <div aria-hidden="true" className="grid-faint absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
      <div className="container-grail relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index="01">About Us</SectionLabel>
          <SplitHeadline
            id="honesty-title"
            lines={["Straight talk,", "no *games.*"]}
            className="display-md mt-6"
          />
          <Reveal delay={0.15}>
            <p className="lede mt-6 max-w-md">
              We&apos;re collectors too, so we know what it means to hand over cards you care about. When we look at your
              collection, we&apos;re honest and open about every step.
            </p>
          </Reveal>
          <ul className="mt-9 space-y-6">
            {PROMISES.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={0.2 + i * 0.08} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.08] text-mint">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-[1.1rem] font-semibold tracking-[-0.02em] text-white">{title}</h3>
                  <p className="mt-0.5 max-w-md text-[0.95rem] leading-relaxed text-mist">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <InspectionBoard />
        </div>
      </div>
    </section>
  );
}

/** A card laid open on the table with every check called out: nothing hidden. */
function InspectionBoard() {
  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative mx-auto aspect-square w-full max-w-[32rem]"
    >
      <div className="absolute inset-[8%] rounded-full bg-mint/[0.07] blur-3xl" />

      {/* Card */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 30, rotate: -4 }, show: { opacity: 1, y: 0, rotate: 0 } }}
        transition={{ duration: 1, ease: EASE }}
        className="absolute left-[30%] top-[22%] w-[40%]"
      >
        <div className="relative overflow-hidden rounded-[4.5%/3.2%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/15">
          <Image src="/images/cards/charizard-ex.png" alt="" width={330} height={460} sizes="(min-width:1024px) 13rem, 40vw" className="block h-auto w-full" />
          {/* Scan line */}
          <motion.span
            className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-transparent via-mint/35 to-transparent mix-blend-screen"
            initial={{ y: "-100%" }}
            animate={{ y: ["-100%", "560%"] }}
            transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2, delay: 1 }}
          />
          {/* Centering guides */}
          <span className="absolute inset-[6%] rounded-[3%] border border-dashed border-mint/50" />
        </div>
      </motion.div>

      {/* Leader lines */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        {CALLOUTS.map((c, i) => (
          <g key={c.label}>
            <motion.path
              d={`M${c.anchor[0]} ${c.anchor[1]} L${c.elbow[0]} ${c.elbow[1]}`}
              fill="none"
              stroke="#37F5C7"
              strokeOpacity={0.6}
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.25, ease: EASE }}
            />
            <motion.circle
              cx={c.anchor[0]}
              cy={c.anchor[1]}
              r={1.1}
              fill="#37F5C7"
              variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.25 }}
              style={{ transformOrigin: `${c.anchor[0]}px ${c.anchor[1]}px` }}
            />
            <circle cx={c.anchor[0]} cy={c.anchor[1]} r={1.1} fill="none" stroke="#37F5C7" strokeWidth={1} vectorEffect="non-scaling-stroke" className="honesty-ping" style={{ animationDelay: `${i * 0.6}s` }} />
          </g>
        ))}
      </svg>

      {/* Chips */}
      {CALLOUTS.map((c, i) => (
        <motion.div
          key={c.label}
          variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.5, delay: 1.1 + i * 0.25, ease: EASE }}
          className={`absolute ${c.chip} w-[36%] rounded-xl border border-white/12 bg-navy-800/90 px-3 py-2 shadow-[0_16px_30px_-16px_rgb(0_0_0/0.9)] backdrop-blur sm:w-[30%]`}
        >
          <p className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-mint sm:text-[0.66rem]">
            <span className="size-1.5 rounded-full bg-mint" />
            {c.label}
          </p>
          <p className="mt-0.5 text-[0.72rem] leading-snug text-white/85 sm:text-[0.8rem]">{c.note}</p>
        </motion.div>
      ))}

      {/* Footer stamp */}
      <motion.div
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, delay: 2.2, ease: EASE }}
        className="absolute bottom-[4%] right-0 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.12em] text-navy sm:text-[0.66rem]"
      >
        <Eye className="size-3" /> You see it all
      </motion.div>
    </motion.div>
  );
}
