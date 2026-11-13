"use client";

import { motion } from "motion/react";
import { Camera, MessageCircle, ScanSearch } from "lucide-react";
import { CardArt } from "@/components/visuals/CardArt";
import { EASE, Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { sellingTips } from "@/content/copy";
import { images } from "@/content/images";

export function SellHero() {
  return (
    <section aria-labelledby="sell-title" className="grain relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] md:-mt-20 md:pt-20">
      <div aria-hidden="true" className="grid-faint absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_30%,black_10%,transparent_65%)]" />
      <div className="container-grail relative grid items-end gap-12 pb-16 pt-12 md:pb-24 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="eyebrow">
            Sell your cards
          </motion.p>
          <SplitHeadline
            id="sell-title"
            as="h1"
            immediate
            lines={["Every Card", "Has a Story.", "What's *Yours* Worth?"]}
            className="mt-6 font-display text-[clamp(2.6rem,5.8vw,5.75rem)] font-bold leading-[0.94] tracking-[-0.045em]"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="lede mt-8 max-w-xl"
          >
            Have Pokémon cards you&apos;re ready to part with? Tell us about your collection and we&apos;ll review your
            submission.
          </motion.p>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mist"
          >
            {["A few minutes", "Photos from your phone", "No obligation"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>
        <div aria-hidden="true" className="relative hidden h-[22rem] lg:col-span-3 lg:block">
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -8 }}
            transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
            className="absolute bottom-0 left-[6%] w-[46%]"
          >
            <CardArt slot={images.sellHeroA} hue={-20} priority sizes="15vw" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ duration: 1.3, delay: 0.45, ease: EASE }}
            className="absolute bottom-6 right-[6%] w-[46%]"
          >
            <CardArt slot={images.sellHeroB} variant="slab" priority sizes="15vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const nextSteps = [
  { icon: Camera, title: "You submit", body: "Your details and photos come straight to the Grailz Co team." },
  { icon: ScanSearch, title: "We review", body: "We look over each card, its photos and condition." },
  { icon: MessageCircle, title: "We reach out", body: "If there's an offer or we need more details, we'll contact you." },
];

/** Compact "what happens next" shown under the live preview. */
export function SellAside() {
  return (
    <aside aria-label="What happens next" className="rounded-[1.5rem] border border-line p-6">
      <p className="eyebrow">What happens next</p>
      <ol className="mt-4 space-y-3">
        {nextSteps.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-mint/40 text-mint">
              <Icon aria-hidden="true" className="size-3.5" />
            </span>
            <p className="pt-1 text-sm leading-snug text-mist">
              <span className="font-semibold text-white">{title}.</span> {body}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function SellingTips() {
  return (
    <section aria-labelledby="tips-title" className="relative border-t border-line bg-navy-900 py-24 md:py-32">
      <div className="container-grail grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="Tips">Before you submit</SectionLabel>
          <SplitHeadline id="tips-title" lines={["Help your cards", "*shine.*"]} className="display-md mt-8" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-mist">
              A little preparation goes a long way. The clearer the picture, the better we can understand what you have.
            </p>
          </Reveal>
        </div>
        <ol className="lg:col-span-8">
          {sellingTips.map((t, i) => (
            <Reveal
              as="li"
              key={t.title}
              delay={i * 0.05}
              className="grid gap-2 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_14rem_1fr] sm:gap-6 lg:first:pt-2"
            >
              <span className="font-mono text-sm text-mint">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-white">{t.title}</h3>
              <p className="leading-relaxed text-mist">{t.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Reassurance() {
  return (
    <section aria-labelledby="reassure-title" className="py-24 md:py-32">
      <div className="container-grail">
        <Reveal className="hairline relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-navy-800/60 px-6 py-12 text-center sm:px-14 sm:py-16">
          <div aria-hidden="true" className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-mint/70 to-transparent" />
          <h2 id="reassure-title" className="display-md">
            No pressure. <span className="text-mint">Just a conversation.</span>
          </h2>
          <p className="lede mx-auto mt-6 max-w-2xl">
            Every submission is reviewed individually. Sending us your cards doesn&apos;t commit you to anything, and it
            isn&apos;t an agreement to purchase — it simply starts the conversation. If there&apos;s a fit, we&apos;ll be in
            touch to talk through the next steps together.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
