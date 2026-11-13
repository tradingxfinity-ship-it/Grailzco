"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ImagePlus } from "lucide-react";
import { EASE } from "@/components/ui/Reveal";
import type { CardEntry } from "@/lib/submission";
import { cn } from "@/lib/cn";

export type PreviewCard = CardEntry & { id: string; photos: string[] };

const CONDITION_CODE: Record<string, string> = {
  Mint: "MINT",
  "Near Mint": "NM",
  "Lightly Played": "LP",
  "Moderately Played": "MP",
  "Heavily Played": "HP",
  Damaged: "DMG",
  Unsure: "?",
};

const GRADING_CODE: Record<string, string> = {
  Ungraded: "RAW",
  PSA: "PSA",
  BGS: "BGS",
  CGC: "CGC",
  Other: "GRD",
  Unsure: "?",
};

type Props = {
  cards: PreviewCard[];
  activeIndex: number;
  onSelect: (index: number) => void;
  compact?: boolean;
};

/**
 * Slab-style preview that fills in as the visitor completes a card entry:
 * label text from the fields, the first photo in the well (second photo on hover).
 */
export function LivePreview({ cards, activeIndex, onSelect, compact }: Props) {
  const card = cards[activeIndex] ?? cards[0];
  if (!card) return null;

  const checks = [
    { label: "Name", done: !!card.name.trim() },
    { label: "Condition", done: !!card.condition },
    { label: "Grading", done: !!card.grading },
    { label: "Photo", done: card.photos.length > 0 },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  const grade = GRADING_CODE[card.grading] ?? "—";
  const cond = CONDITION_CODE[card.condition] ?? "—";
  const qty = Number(card.quantity) > 1 ? `×${card.quantity}` : null;
  const [front, back] = card.photos;

  return (
    <div aria-label="Live preview of your card" role="region" className={cn("w-full", compact && "flex items-start gap-5")}>
      {!compact && (
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-mint/60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-mint" />
            </span>
            Live preview
          </p>
          {cards.length > 1 && (
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose card to preview">
              {cards.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Preview card ${i + 1}`}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeIndex ? "w-5 bg-mint" : "w-1.5 bg-white/25 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* The slab */}
      <div
        className={cn(
          "group relative mx-auto aspect-[66/112] rounded-[1.25rem] bg-[linear-gradient(180deg,#1d3a6e,#0c2349_55%,#081a3a)] p-[5%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)] ring-1 ring-white/15 [perspective:900px]",
          compact ? "w-32 shrink-0 rounded-[0.8rem]" : "w-[min(15.5rem,30svh)]",
        )}
      >
        {/* Label */}
        <div className="flex items-stretch justify-between gap-2 rounded-[0.55rem] bg-paper px-[6%] py-[5%] text-ink">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[clamp(0.4rem,0.62vw,0.55rem)] uppercase tracking-[0.14em] text-ink/50">
              Grailz Co · Card {String(activeIndex + 1).padStart(2, "0")}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={card.name ? "named" : "empty"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "mt-0.5 line-clamp-2 font-mono font-medium uppercase leading-tight tracking-[0.04em]",
                  compact ? "text-[0.5rem]" : "text-[clamp(0.55rem,0.8vw,0.72rem)]",
                  !card.name && "text-ink/35",
                )}
              >
                {card.name || "Your card name"}
              </motion.p>
            </AnimatePresence>
            <p className={cn("mt-0.5 truncate font-mono uppercase tracking-[0.06em] text-ink/55", compact ? "text-[0.42rem]" : "text-[clamp(0.45rem,0.62vw,0.56rem)]")}>
              {[card.set, card.category].filter(Boolean).join(" · ") || "Set · Category"}
              {qty && ` · ${qty}`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-between">
            <motion.span
              key={`grade-${grade}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "rounded-md bg-ink px-1.5 py-0.5 font-display font-bold leading-none text-mint",
                compact ? "text-[0.6rem]" : "text-[clamp(0.7rem,1vw,0.95rem)]",
              )}
            >
              {grade}
            </motion.span>
            <motion.span
              key={`cond-${cond}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("font-mono font-medium text-ink/70", compact ? "text-[0.45rem]" : "text-[clamp(0.5rem,0.7vw,0.62rem)]")}
            >
              {cond}
            </motion.span>
          </div>
        </div>

        {/* Inner well */}
        <div className="relative mt-[6%] aspect-[330/460] rounded-[0.7rem] bg-navy-900/80 p-[6%] ring-1 ring-inset ring-white/10">
          <div className="relative h-full w-full transition-transform duration-700 ease-[var(--ease-grail)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            <Face>
              <AnimatePresence mode="wait" initial={false}>
                {front ? (
                  <motion.img
                    key={front}
                    src={front}
                    alt=""
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="h-full w-full rounded-[0.35rem] object-cover"
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[0.35rem] border border-dashed border-mint/35 text-center text-mint/80"
                  >
                    <ImagePlus aria-hidden="true" className={compact ? "size-4" : "size-6"} />
                    {!compact && <span className="px-3 text-[0.7rem] leading-snug text-mist">Add a photo to see it here</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </Face>
            <Face back>
              {back ? (
                // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                <img src={back} alt="" className="h-full w-full rounded-[0.35rem] object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[0.35rem] border border-dashed border-white/15 px-3 text-center text-[0.7rem] leading-snug text-haze">
                  {compact ? "Back" : "Add a second photo for the back"}
                </div>
              )}
            </Face>
          </div>
        </div>

        {/* Case reflection */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.09)_45%,transparent_55%)]" />
      </div>

      {/* Completeness */}
      <div className={cn(compact ? "flex-1 pt-1" : "mt-5")}>
        <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze">
          <span>{doneCount === 4 ? "Ready to submit" : "Card details"}</span>
          <span className={doneCount === 4 ? "text-mint" : ""}>{doneCount}/4</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-mint" animate={{ width: `${(doneCount / 4) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {checks.map((c) => (
            <li
              key={c.label}
              className={cn(
                "flex items-center justify-center gap-1 rounded-full border px-2 py-1 text-[0.68rem] transition-colors duration-300",
                c.done ? "border-mint/40 bg-mint/10 text-mint" : "border-white/10 text-haze",
              )}
            >
              {c.done && <Check aria-hidden="true" className="size-3 shrink-0" strokeWidth={3} />}
              {c.label}
              <span className="sr-only">{c.done ? " added" : " not added yet"}</span>
            </li>
          ))}
        </ul>
        {!compact && front && (
          <p className="mt-3 text-center text-xs text-haze">{back ? "Hover the slab to see the back" : "Tip: add a back photo too"}</p>
        )}
      </div>
    </div>
  );
}

function Face({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div className={cn("absolute inset-0 [backface-visibility:hidden]", back && "[transform:rotateY(180deg)]")}>{children}</div>
  );
}
