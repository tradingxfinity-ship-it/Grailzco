import Image from "next/image";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { images } from "@/content/images";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-white py-24 text-ink md:py-36">
      <div className="container-grail grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-6">
          <SectionLabel index="01" className="!text-ink/60 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            About Grailz Co
          </SectionLabel>
          <SplitHeadline
            id="about-title"
            lines={["Built for the", "*Love* of the Cards."]}
            className="display-lg mt-8 text-ink [&_.text-mint]:!text-[#0a9e78]"
          />
          <Reveal delay={0.15} className="mt-10 grid gap-6 sm:grid-cols-2 lg:max-w-xl">
            <p className="text-[1.05rem] leading-relaxed text-ink/85">
              Grailz Co is focused on one thing: collectible trading cards — Pokémon first and foremost. We&apos;re part of
              the collecting community, and we know the feeling of pulling something special.
            </p>
            <p className="text-[1.05rem] leading-relaxed text-ink/60">
              If you&apos;re thinking about selling, you can submit your cards to us for review. Share the details and a few
              photos, and we&apos;ll take a proper look at what you have.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-ink/10 pt-6">
            {[
              ["Focus", "Pokémon TCG"],
              ["Also", "Collectible cards"],
              ["Approach", "Individual review"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="eyebrow !text-ink/50">{k}</p>
                <p className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">{v}</p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Binder page in a glass display case */}
        <Reveal y={50} className="lg:col-span-6">
          <div className="hairline relative mx-auto max-w-[34rem] rounded-[1.75rem] bg-navy p-4 shadow-[0_50px_100px_-40px_rgb(0_14_40/0.6)] sm:p-6 lg:rotate-[1.5deg]">
            <div className="mb-4 flex items-center justify-between px-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-haze">
              <span>Binder · Page 01</span>
              <span className="flex gap-1.5">
                <span className="size-1.5 rounded-full bg-mint" />
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-white/20" />
              </span>
            </div>

            <div className="relative">
              <ul className="grid grid-cols-3 gap-2.5 sm:gap-3.5" aria-label="A page of cards from a collection">
                {images.aboutBinder.map((card) => (
                  <li key={card.label} className="rounded-[0.7rem] bg-navy-900 p-1.5 ring-1 ring-inset ring-white/[0.06] sm:p-2">
                    <div className="relative aspect-[330/460] overflow-hidden rounded-[0.4rem]">
                      <Image src={card.src} alt={card.alt} fill sizes="(min-width: 1024px) 150px, 28vw" className="object-cover" />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Glass pane: tinted face, bevelled edge, and two diagonal reflections */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1.5 rounded-[1rem] bg-[linear-gradient(155deg,rgb(255_255_255/0.20),rgb(255_255_255/0.05)_35%,rgb(255_255_255/0.02)_65%,rgb(55_245_199/0.08))] shadow-[inset_0_1px_0_rgb(255_255_255/0.7),inset_0_0_0_1px_rgb(255_255_255/0.22),inset_0_-14px_28px_-14px_rgb(255_255_255/0.2),inset_0_0_30px_rgb(255_255_255/0.05),0_0_0_1px_rgb(0_0_0/0.4)] sm:-inset-2.5"
              >
                <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
                  <span className="absolute -left-1/4 -top-1/2 h-[200%] w-[26%] rotate-[28deg] bg-gradient-to-r from-transparent via-white/[0.26] to-transparent" />
                  <span className="absolute -top-1/2 left-[18%] h-[200%] w-[7%] rotate-[28deg] bg-gradient-to-r from-transparent via-white/[0.22] to-transparent" />
                  <span className="absolute -bottom-1/4 right-[-6%] h-[70%] w-[12%] rotate-[28deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                </span>
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
