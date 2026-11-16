import { Eye, Handshake, ReceiptText } from "lucide-react";
import { BinderGrid } from "@/components/home/BinderGrid";
import { Reveal, SectionLabel, SplitHeadline } from "@/components/ui/Reveal";
import { images } from "@/content/images";

const PROMISES = [
  {
    icon: Eye,
    title: "We tell you what we see",
    body: "Corners, edges, surface and centering, explained in plain words. The good and the not-so-good.",
  },
  {
    icon: ReceiptText,
    title: "We explain the number",
    body: "If we make an offer, we walk you through how we got there, so it never feels like a guess.",
  },
  {
    icon: Handshake,
    title: "No pressure, ever",
    body: "Take the offer or don't. Ask as many questions as you like. It's your collection and your call.",
  },
] as const;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-white py-20 text-ink md:py-28">
      <div className="container-grail grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="01" className="!text-ink/60 [&_span:first-child]:!text-ink [&_span:nth-child(2)]:!bg-ink/30">
            About Us
          </SectionLabel>
          <SplitHeadline
            id="about-title"
            lines={["Straight talk,", "no *games.*"]}
            className="display-md mt-6 text-ink [&_.text-mint]:!text-[#0a9e78]"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/70">
              We&apos;re collectors too, so we know what it means to hand over cards you care about. When we look at
              your collection, we&apos;re honest and open about every step.
            </p>
          </Reveal>
          <ul className="mt-8 space-y-5">
            {PROMISES.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={0.2 + i * 0.08} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-mint shadow-[0_10px_24px_-12px_rgb(0_14_40/0.7)]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">{title}</h3>
                  <p className="mt-0.5 max-w-md text-[0.95rem] leading-relaxed text-ink/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Binder page in a glass display case */}
        <Reveal y={50} className="lg:col-span-7">
          <div className="hairline relative mx-auto w-full max-w-[min(34rem,69svh)] rounded-[1.5rem] bg-navy p-3.5 shadow-[0_40px_80px_-36px_rgb(0_14_40/0.6)] sm:p-5 lg:rotate-[1.5deg]">
            <BinderGrid cards={images.aboutBinder}>
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
            </BinderGrid>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
