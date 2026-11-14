import { Radio } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";
import { WhatnotLinkUp } from "@/components/home/WhatnotLinkUp";

/**
 * Community feature on a light "paper" surface for rhythm.
 * Profile stats are intentionally not shown; the panel animates the two logos linking up.
 */
export function Whatnot() {
  return (
    <section aria-labelledby="whatnot-title" className="relative bg-paper py-24 text-ink md:py-32">
      <div className="container-grail grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index="03" className="!text-ink/70 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            Community
          </SectionLabel>
          <SplitHeadline
            id="whatnot-title"
            lines={["Catch us", "on Whatnot."]}
            className="display-lg mt-8 text-ink"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-[1.08rem] leading-relaxed text-ink/75">
              Grailz Co is part of the Whatnot collecting community. Follow along, say hello, and see what&apos;s on the
              table — it&apos;s another way to connect with us beyond the submission form.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <ButtonLink href={siteConfig.whatnotUrl} external size="lg" className="!bg-ink !text-white hover:!shadow-[0_10px_40px_-12px_rgb(0_14_40/0.6)]">
                Visit Us on Whatnot
              </ButtonLink>
              <span className="font-mono text-sm text-ink/60">{siteConfig.whatnotHandle}</span>
            </div>
          </Reveal>
        </div>

        <Reveal y={40} className="lg:col-span-6">
          <div className="relative mx-auto max-w-[32rem]">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-navy p-6 text-white shadow-[0_40px_80px_-30px_rgb(0_14_40/0.55)] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                  <Radio aria-hidden="true" className="size-3.5 text-mint" />
                  Whatnot · {siteConfig.whatnotHandle}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-haze">Preview</span>
              </div>
              <WhatnotLinkUp />
              <p className="mt-8 border-t border-line pt-5 text-sm leading-relaxed text-mist">
                {/* PLACEHOLDER — replace with real Whatnot show imagery or schedule when confirmed. */}
                Live-show imagery and details coming soon. Visit the profile for the latest.
              </p>
            </div>
            <div aria-hidden="true" className="absolute -bottom-4 -right-4 -z-0 h-full w-full rounded-[1.75rem] border border-ink/15" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
