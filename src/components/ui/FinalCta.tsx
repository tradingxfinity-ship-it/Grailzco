import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, SplitHeadline } from "@/components/ui/Reveal";
import { images } from "@/content/images";

type Props = {
  lines: string[];
  body: string;
  cta: string;
  href?: string;
  id: string;
};

/** Position of each fanned card: left, centre (front), right. */
const FAN = [
  "absolute left-[14%] top-[10%] w-[12.5rem] -rotate-[16deg]",
  "absolute left-1/2 top-0 z-10 w-[13rem] -translate-x-1/2",
  "absolute right-[14%] top-[10%] w-[12.5rem] rotate-[16deg]",
];

/** Oversized closing conversion moment, shared by Home and How It Works. */
export function FinalCta({ lines, body, cta, href = "/sell", id }: Props) {
  return (
    <section aria-labelledby={id} className="grain relative overflow-hidden py-16 md:py-24">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[26rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-mint/[0.12] blur-[140px]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />

      {/* Fanned cards behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[44rem] -translate-x-1/2 -translate-y-[46%] opacity-[0.35] md:block">
        <div className="relative mx-auto h-[22rem] w-full">
          {images.ctaFan.map((card, i) => (
            <div key={card.label} className={FAN[i]}>
              <div className="relative aspect-[330/460] overflow-hidden rounded-[0.8rem] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10">
                <Image src={card.src} alt="" fill sizes="208px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-grail relative text-center">
        <SplitHeadline
          id={id}
          lines={lines}
          className="mx-auto font-display text-[clamp(3rem,9.5vw,10rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white"
        />
        <Reveal delay={0.25}>
          <p className="lede mx-auto mt-5 max-w-md text-white/80">{body}</p>
          <div className="mt-7 flex justify-center">
            <ButtonLink href={href} size="lg">
              {cta}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
