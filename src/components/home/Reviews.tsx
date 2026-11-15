"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { whatnotReviews, type WhatnotReview } from "@/content/reviews";
import { cn } from "@/lib/cn";

const half = Math.ceil(whatnotReviews.items.length / 2);
const ROWS = [whatnotReviews.items.slice(0, half), whatnotReviews.items.slice(half)];

/** Real Whatnot reviews shown as graded slabs drifting past in two rows. */
export function Reviews() {
  return (
    <section aria-labelledby="reviews-title" className="relative overflow-hidden bg-navy-900 py-20 md:py-28">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-mint/[0.06] blur-[140px]" />

      <div className="container-grail relative flex flex-col items-center text-center">
        <SectionLabel index="03" className="justify-center">
          Reviews
        </SectionLabel>
        <SplitHeadline
          id="reviews-title"
          lines={["Collectors keep coming *back.*"]}
          className="mt-6 font-display text-[clamp(2.1rem,4.4vw,4.25rem)] font-bold leading-[1] tracking-[-0.04em]"
        />
        <Reveal delay={0.1} className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <Stars />
            <p className="text-mist">
              <ReviewCount className="font-display text-xl font-bold text-white" /> reviews on Whatnot
            </p>
          </div>
          <a
            href={whatnotReviews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-mint underline-offset-4 hover:underline"
          >
            Read them all on Whatnot
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </div>

      <div className="relative mt-12 space-y-5 md:mt-16">
        {ROWS.map((row, i) => (
          <Marquee key={i} reviews={row} reverse={i === 1} />
        ))}
      </div>
    </section>
  );
}

function Marquee({ reviews, reverse }: { reviews: readonly WhatnotReview[]; reverse?: boolean }) {
  return (
    <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="marquee-track flex w-max items-stretch"
        data-reverse={reverse || undefined}
        style={{ "--marquee-duration": `${reviews.length * 9}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className={cn("flex shrink-0 items-stretch gap-5 pr-5", copy === 1 && "marquee-dup")}
          >
            {reviews.map((r, i) => (
              <li key={`${r.user}-${r.date}-${i}`} className="flex">
                <ReviewSlab review={r} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

const AVATAR_HUES = ["#37F5C7", "#7AA2FF", "#FFB86B", "#FF7AB6", "#B48CFF", "#6BE6FF"];

/** A review dressed as a graded slab: label with the reviewer, grade box with the rating. */
function ReviewSlab({ review }: { review: WhatnotReview }) {
  const hue = AVATAR_HUES[review.user.length % AVATAR_HUES.length];
  return (
    <figure className="group relative flex w-[19rem] flex-col rounded-[1.25rem] bg-[linear-gradient(180deg,#1d3a6e,#0c2349_55%,#081a3a)] p-2.5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/15 transition-transform duration-500 ease-[var(--ease-grail)] hover:-translate-y-1.5 hover:rotate-[-0.6deg] sm:w-[21rem]">
      {/* Label */}
      <figcaption className="flex items-center gap-2.5 rounded-[0.8rem] bg-paper px-3 py-2 text-ink">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-navy"
          style={{ background: hue }}
        >
          {review.user.replace(/[^a-z0-9]/gi, "").charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em]">@{review.user}</span>
          <span className="block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ink/50">Whatnot · {review.date}</span>
        </span>
        <span className="flex shrink-0 flex-col items-center rounded-md bg-ink px-2 py-1 leading-none">
          <span className="font-display text-sm font-bold text-mint">5.0</span>
          <Star aria-hidden="true" className="mt-0.5 size-2.5 fill-mint text-mint" />
          <span className="sr-only"> out of 5 stars</span>
        </span>
      </figcaption>

      {/* Inner well */}
      <blockquote className="relative mt-2.5 flex-1 overflow-hidden rounded-[0.8rem] bg-navy-900/80 p-4 text-left ring-1 ring-inset ring-white/10">
        <span aria-hidden="true" className="absolute -top-3 right-3 font-display text-[4.5rem] leading-none text-mint/15">
          &ldquo;
        </span>
        <p className="relative text-[0.92rem] leading-relaxed text-white/90">{review.text}</p>
        {/* holo sheen on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_30%,rgb(255_255_255/0.12)_45%,rgb(55_245_199/0.14)_50%,transparent_65%)] transition-transform duration-700 ease-[var(--ease-grail)] group-hover:translate-x-full"
        />
      </blockquote>
    </figure>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-mint text-mint" />
      ))}
    </span>
  );
}

/** Counts up to the Whatnot review total when scrolled into view. */
function ReviewCount({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(whatnotReviews.total);
    const controls = animate(0, whatnotReviews.total, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{n.toLocaleString("en-US")}</span>
      <span className="sr-only">{whatnotReviews.total.toLocaleString("en-US")}</span>
    </span>
  );
}
