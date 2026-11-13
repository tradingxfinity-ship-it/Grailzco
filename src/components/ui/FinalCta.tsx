import { ButtonLink } from "@/components/ui/Button";
import { Reveal, SplitHeadline } from "@/components/ui/Reveal";
import { CardArt } from "@/components/visuals/CardArt";
import { images } from "@/content/images";

type Props = {
  lines: string[];
  body: string;
  cta: string;
  href?: string;
  id: string;
};

/** Oversized closing conversion moment, shared by Home and How It Works. */
export function FinalCta({ lines, body, cta, href = "/sell", id }: Props) {
  return (
    <section aria-labelledby={id} className="grain relative overflow-hidden py-28 md:py-44">
      <div aria-hidden="true" className="absolute left-1/2 top-[55%] h-[40rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-mint/[0.12] blur-[140px]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />

      {/* Fanned cards behind the headline */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[44rem] -translate-x-1/2 -translate-y-[46%] opacity-[0.35] md:block">
        <div className="relative mx-auto h-[26rem] w-full">
          <div className="absolute left-[14%] top-[10%] w-[13rem] -rotate-[16deg]">
            <CardArt slot={images.ctaFanLeft} hue={-30} sizes="208px" />
          </div>
          <div className="absolute right-[14%] top-[10%] w-[13rem] rotate-[16deg]">
            <CardArt slot={images.ctaFanRight} hue={30} sizes="208px" />
          </div>
          <div className="absolute left-1/2 top-0 w-[12rem] -translate-x-1/2">
            <CardArt slot={images.ctaFanCenter} variant="slab" sizes="192px" />
          </div>
        </div>
      </div>

      <div className="container-grail relative text-center">
        <SplitHeadline
          id={id}
          lines={lines}
          className="mx-auto font-display text-[clamp(3rem,9.5vw,10rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white"
        />
        <Reveal delay={0.25}>
          <p className="lede mx-auto mt-8 max-w-md text-white/80">{body}</p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={href} size="lg">
              {cta}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
