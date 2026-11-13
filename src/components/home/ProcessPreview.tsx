"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { processPreview } from "@/content/copy";

export function ProcessPreview() {
  return (
    <section aria-labelledby="process-title" className="relative overflow-hidden bg-navy-800 py-24 md:py-32">
      <div aria-hidden="true" className="grid-faint absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      <div className="container-grail relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index="03">The process</SectionLabel>
            <SplitHeadline id="process-title" lines={["Three steps.", "*No* guesswork."]} className="display-lg mt-8" />
          </div>
          <Reveal delay={0.1}>
            <ButtonLink href="/how-it-works" variant="outline">
              See how it works
            </ButtonLink>
          </Reveal>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8"
        >
          {/* Progress rail — horizontal on desktop, vertical on mobile */}
          <motion.span
            aria-hidden="true"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.6, ease: EASE } } }}
            className="absolute left-0 right-0 top-[1.15rem] hidden h-px origin-left bg-gradient-to-r from-mint via-mint/50 to-mint/10 md:block"
          />
          <motion.span
            aria-hidden="true"
            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.6, ease: EASE } } }}
            className="absolute bottom-0 left-[1.15rem] top-0 w-px origin-top bg-gradient-to-b from-mint via-mint/50 to-mint/10 md:hidden"
          />
          {processPreview.map((s, i) => (
            <motion.li
              key={s.index}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.25 + i * 0.25, ease: EASE } },
              }}
              className="relative pl-14 md:pl-0"
            >
              <span className="absolute left-0 top-0 flex size-[2.3rem] items-center justify-center rounded-full border border-mint/60 bg-navy-800 font-mono text-xs text-mint md:relative">
                {s.index}
              </span>
              <h3 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-white md:mt-10 md:text-[2.1rem]">
                {s.title}
              </h3>
              <p className="mt-3 max-w-xs leading-relaxed text-mist">{s.body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
