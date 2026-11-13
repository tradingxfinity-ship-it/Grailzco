import { CardArt } from "@/components/visuals/CardArt";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { images } from "@/content/images";

const HUES = [-30, 10, 35, -10, 0, 25, -35, 15, -20];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="container-grail grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-6">
          <SectionLabel index="01">About Grailz Co</SectionLabel>
          <SplitHeadline
            id="about-title"
            lines={["Built for the", "*Love* of the Cards."]}
            className="display-lg mt-8 text-white"
          />
          <Reveal delay={0.15} className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-xl">
            <p className="text-[1.05rem] leading-relaxed text-white/90">
              Grailz Co is focused on one thing: collectible trading cards — Pokémon first and foremost. We&apos;re part of
              the collecting community, and we know the feeling of pulling something special.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-mist">
              If you&apos;re thinking about selling, you can submit your cards to us for review. Share the details and a few
              photos, and we&apos;ll take a proper look at what you have.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            {[
              ["Focus", "Pokémon TCG"],
              ["Also", "Collectible cards"],
              ["Approach", "Individual review"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="eyebrow">{k}</p>
                <p className="mt-1 font-display text-lg font-semibold tracking-tight text-white">{v}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Binder page — a thoughtfully arranged collection */}
        <Reveal y={50} className="lg:col-span-6">
          <div className="hairline relative mx-auto max-w-[34rem] rounded-[1.75rem] bg-navy-800/80 p-4 shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)] sm:p-6 lg:rotate-[1.5deg]">
            <div className="mb-4 flex items-center justify-between px-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-haze">
              <span>Binder · Page 01</span>
              <span className="flex gap-1.5">
                <span className="size-1.5 rounded-full bg-mint" />
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-white/20" />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {images.aboutBinder.map((slot, i) => (
                <div key={slot.label} className="rounded-[0.7rem] bg-navy-900/80 p-1.5 ring-1 ring-inset ring-white/[0.06] sm:p-2">
                  <CardArt slot={slot} hue={HUES[i]} sizes="(min-width: 1024px) 10vw, 28vw" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
