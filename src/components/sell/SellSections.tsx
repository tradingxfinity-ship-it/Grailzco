"use client";

import { Camera, MessageCircle, ScanSearch } from "lucide-react";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { sellingTips } from "@/content/copy";

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
