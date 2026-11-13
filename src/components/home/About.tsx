import Image from "next/image";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { images } from "@/content/images";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-white py-20 text-ink md:py-28">
      <div className="container-grail grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index="01" className="!text-ink/60 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            About Grailz Co
          </SectionLabel>
          <SplitHeadline
            id="about-title"
            lines={["Built for the", "*Love* of the Cards."]}
            className="display-md mt-6 text-ink [&_.text-mint]:!text-[#0a9e78]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/70">
              We&apos;re collectors focused on Pokémon and trading cards. Thinking about selling? Send us the details and a
              few photos, and we&apos;ll take a proper look.
            </p>
          </Reveal>
        </div>

        {/* Binder page in a glass display case */}
        <Reveal y={50} className="lg:col-span-6">
          <div className="hairline relative mx-auto w-full max-w-[min(26rem,52svh)] rounded-[1.5rem] bg-navy p-3.5 shadow-[0_40px_80px_-36px_rgb(0_14_40/0.6)] sm:p-5 lg:rotate-[1.5deg]">
            <div className="relative">
              <ul className="grid grid-cols-3 gap-2.5 sm:gap-3.5" aria-label="A page of cards from a collection">
                {images.aboutBinder.map((card) => (
                  <li key={card.label} className="rounded-[0.7rem] bg-navy-900 p-1.5 ring-1 ring-inset ring-white/[0.06] sm:p-2">
                    <div className="relative aspect-[330/460] overflow-hidden rounded-[0.4rem]">
                      <Image src={card.src} alt={card.alt} fill sizes="(min-width: 1024px) 120px, 28vw" className="object-cover" />
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
