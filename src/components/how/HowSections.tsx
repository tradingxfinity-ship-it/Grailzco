"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Check, Plus } from "lucide-react";
import { CardArt } from "@/components/visuals/CardArt";
import { ConversationVisual, ReviewVisual, ShareVisual } from "@/components/how/StageVisuals";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { faqs, goodSubmission, journey } from "@/content/copy";
import { images } from "@/content/images";
import { cn } from "@/lib/cn";

export function HowHero() {
  return (
    <section aria-labelledby="how-title" className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:-mt-20 md:pt-20">
      <div aria-hidden="true" className="grid-faint absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_40%,black_10%,transparent_65%)]" />
      <div className="container-grail relative grid items-center gap-14 pb-20 pt-12 md:pb-28 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="eyebrow">
            How it works
          </motion.p>
          <SplitHeadline
            id="how-title"
            as="h1"
            immediate
            lines={["From Your Collection", "to Our *Conversation.*"]}
            className="mt-6 font-display text-[clamp(2.6rem,6.4vw,6.25rem)] font-bold leading-[0.94] tracking-[-0.045em]"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="lede mt-8 max-w-lg"
          >
            Selling your cards starts with a few simple details. Here&apos;s what happens after you submit.
          </motion.p>
        </div>
        <div className="relative lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            className="relative mx-auto w-[58%] max-w-[17rem] lg:w-[62%]"
          >
            <div aria-hidden="true" className="absolute -inset-[12%] rounded-[2.5rem] border border-mint/20" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 scale-110 rounded-full bg-mint/15 blur-[80px]" />
            <CardArt slot={images.howHero} variant="slab" priority sizes="(min-width: 1024px) 18vw, 45vw" />
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mx-auto mt-10 grid max-w-sm grid-cols-3 gap-px overflow-hidden rounded-xl bg-line font-mono text-[0.65rem] uppercase tracking-[0.12em]"
          >
            {[
              ["Step", "01–03"],
              ["Form", "1 page"],
              ["Obligation", "None"],
            ].map(([k, v]) => (
              <div key={k} className="bg-navy px-3 py-3 text-center">
                <dt className="text-haze">{k}</dt>
                <dd className="mt-1 text-white">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

const STAGE_VISUALS = [ShareVisual, ReviewVisual, ConversationVisual];

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  return (
    <section aria-labelledby="journey-title" className="relative border-t border-line bg-navy-900 py-24 md:py-36">
      <div className="container-grail">
        <div className="max-w-3xl">
          <SectionLabel index="01">The selling journey</SectionLabel>
          <SplitHeadline id="journey-title" lines={["Three stages,", "one *clear* path."]} className="display-lg mt-8" />
        </div>

        <ol ref={ref} className="relative mt-20 md:mt-28">
          <span aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line md:left-1/2" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute bottom-0 left-[1.15rem] top-0 w-px origin-top bg-mint md:left-1/2"
          />
          {journey.map((s, i) => {
            const flip = i % 2 === 1;
            const Visual = STAGE_VISUALS[i];
            return (
              <li key={s.index} className="relative grid gap-10 pb-24 pl-14 last:pb-0 md:grid-cols-2 md:gap-20 md:pl-0">
                <span className="absolute left-0 top-1 z-10 flex size-[2.3rem] items-center justify-center rounded-full border border-mint bg-navy-900 font-mono text-xs text-mint md:left-1/2 md:-translate-x-1/2">
                  {s.index}
                </span>
                <Reveal className={cn("md:pt-0", flip ? "md:order-2 md:pl-4" : "md:pr-4 md:text-right")}>
                  <span
                    aria-hidden="true"
                    className="block font-display text-[5rem] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(55_245_199/0.45)] md:text-[8rem]"
                  >
                    {s.index}
                  </span>
                  <h3 className="mt-6 font-display text-[2rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2.6rem]">{s.title}</h3>
                  <p className={cn("mt-4 max-w-md leading-relaxed text-mist", !flip && "md:ml-auto")}>{s.body}</p>
                  <ul className={cn("mt-6 flex flex-wrap gap-2", !flip && "md:justify-end")}>
                    {s.points.map((p) => (
                      <li key={p} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-mist">
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal y={50} delay={0.1} className={cn("flex", flip ? "md:order-1 md:justify-end md:pr-4" : "md:pl-4")}>
                  <div className="hairline relative w-full max-w-[24rem] rounded-[1.75rem] bg-navy-800/80 p-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:p-4">
                    <Visual />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function GoodSubmission() {
  return (
    <section aria-labelledby="good-title" className="relative py-24 md:py-36">
      <div className="container-grail grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionLabel index="02">Preparing your submission</SectionLabel>
          <SplitHeadline id="good-title" lines={["What makes a", "*good* submission?"]} className="display-lg mt-8" />

          {/* Front / back guide */}
          <Reveal y={40} className="mt-14 grid max-w-lg grid-cols-2 gap-5 sm:gap-8">
            {(["Front", "Back"] as const).map((side, i) => (
              <figure key={side}>
                <div className="relative rounded-[1.25rem] bg-navy-800 p-5 sm:p-7">
                  {/* viewfinder corners */}
                  {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c) => (
                    <span key={c} aria-hidden="true" className={cn("absolute size-4 rounded-[3px] border-mint", c)} />
                  ))}
                  {i === 0 ? (
                    <CardArt slot={images.guideFront} hue={-15} sizes="200px" />
                  ) : (
                    <CardBack />
                  )}
                </div>
                <figcaption className="mt-3 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.12em] text-mist">
                  <span>{side}</span>
                  <span className="text-mint">Photo {i + 1}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>

        <ul className="space-y-3 lg:col-span-6 lg:pt-28">
          {goodSubmission.map((g, i) => (
            <Reveal
              as="li"
              key={g.title}
              delay={i * 0.06}
              className="group flex gap-5 rounded-[1.25rem] border border-line p-6 transition-colors duration-300 hover:border-mint/40 hover:bg-navy-800/50"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-mint/10 text-mint ring-1 ring-mint/30 transition-colors group-hover:bg-mint group-hover:text-navy">
                <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{g.title}</h3>
                <p className="mt-1.5 leading-relaxed text-mist">{g.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Generic card back — abstract, brand-neutral pattern. */
function CardBack() {
  if (images.guideBack.src) return <CardArt slot={images.guideBack} sizes="200px" />;
  return (
    <div
      role="img"
      aria-label={`${images.guideBack.alt} (placeholder image)`}
      className="hairline relative aspect-[63/88] overflow-hidden rounded-[5%/3.6%] bg-navy-700 p-[6%]"
    >
      <div className="flex h-full items-center justify-center rounded-[4%] bg-[repeating-linear-gradient(45deg,rgb(55_245_199/0.10)_0_2px,transparent_2px_10px)] ring-1 ring-inset ring-white/15">
        <span className="flex size-[42%] items-center justify-center rounded-full border border-mint/50 font-display text-[clamp(1rem,3vw,2rem)] font-bold text-mint">
          G
        </span>
      </div>
      <p className="absolute inset-x-0 bottom-[3%] truncate px-[6%] text-center font-mono text-[clamp(0.45rem,0.9vw,0.6rem)] uppercase tracking-[0.12em] text-mist/80">
        Placeholder · {images.guideBack.label}
      </p>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section aria-labelledby="faq-title" className="relative border-t border-line bg-navy-900 py-24 md:py-36">
      <div className="container-grail grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="03">FAQ</SectionLabel>
          <SplitHeadline id="faq-title" lines={["Questions,", "*answered.*"]} className="display-lg mt-8" />
        </div>
        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const btn = `${base}-q${i}`;
              const panel = `${base}-a${i}`;
              return (
                <li key={f.q} className="border-b border-line">
                  <h3>
                    <button
                      id={btn}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                    >
                      <span
                        className={cn(
                          "font-display text-[1.3rem] font-semibold tracking-[-0.02em] transition-colors md:text-[1.6rem]",
                          isOpen ? "text-white" : "text-white/75 group-hover:text-white",
                        )}
                      >
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                          isOpen ? "rotate-45 border-mint bg-mint text-navy" : "border-white/20 text-white group-hover:border-mint/60",
                        )}
                      >
                        <Plus aria-hidden="true" className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panel}
                        role="region"
                        aria-labelledby={btn}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 pr-14 text-[1.05rem] leading-relaxed text-mist">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
