import Image from "next/image";
import type { ImageSlot } from "@/content/images";
import { cn } from "@/lib/cn";

export type CardVariant = "raw" | "slab" | "stack";

type Props = {
  slot: ImageSlot;
  variant?: CardVariant;
  /** Hue rotation (deg) applied to the placeholder foil for variety. Keep within ±40. */
  hue?: number;
  className?: string;
  /** Pass true for above-the-fold images. */
  priority?: boolean;
  sizes?: string;
  /** Make the holo foil track --mx/--my set by a parent. */
  interactive?: boolean;
};

const ASPECT: Record<CardVariant, string> = {
  raw: "aspect-[63/88]",
  slab: "aspect-[66/112]",
  stack: "aspect-[63/88]",
};

/**
 * A trading-card visual. Renders real photography when the slot has a `src`,
 * otherwise a clearly labelled, art-directed placeholder.
 */
export function CardArt({ slot, variant = "raw", hue = 0, className, priority, sizes = "(min-width: 1024px) 30vw, 70vw", interactive }: Props) {
  if (slot.src) {
    return (
      <div className={cn("relative overflow-hidden rounded-[var(--radius-slab)] shadow-2xl shadow-black/50", ASPECT[variant], className)}>
        <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  if (variant === "stack") {
    return (
      <div className={cn("relative", ASPECT.stack, className)} role="img" aria-label={`${slot.alt} (placeholder image)`}>
        <RawCard label={slot.label} hue={hue + 30} className="absolute inset-0 -translate-x-[9%] translate-y-[4%] -rotate-[9deg] opacity-80" />
        <RawCard label={slot.label} hue={hue - 25} className="absolute inset-0 translate-x-[8%] translate-y-[2%] rotate-[7deg] opacity-90" />
        <RawCard label={slot.label} hue={hue} className="absolute inset-0" showLabel />
      </div>
    );
  }

  return (
    <div className={cn("relative", ASPECT[variant], className)} role="img" aria-label={`${slot.alt} (placeholder image)`}>
      {variant === "slab" ? (
        <Slab label={slot.label} hue={hue} interactive={interactive} />
      ) : (
        <RawCard label={slot.label} hue={hue} interactive={interactive} showLabel className="absolute inset-0" />
      )}
    </div>
  );
}

function Foil({ hue, interactive }: { hue: number; interactive?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="holo-foil absolute inset-0" style={{ filter: `hue-rotate(${hue}deg) saturate(0.9)` }} />
      {/* Abstract emblem — deliberately not character artwork */}
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 m-auto h-[78%] w-[78%] opacity-50">
        <g fill="none" stroke="white" strokeOpacity="0.55">
          <circle cx="50" cy="50" r="38" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="27" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="15" strokeWidth="0.8" />
          <path d="M50 8v84M8 50h84" strokeWidth="0.3" />
        </g>
        <path d="M50 34 62 50 50 66 38 50Z" fill="white" fillOpacity="0.85" />
      </svg>
      <div
        className="holo-sheen absolute inset-0"
        style={interactive ? undefined : ({ "--mx": 40 + (hue % 30) } as React.CSSProperties)}
      />
    </div>
  );
}

function RawCard({ label, hue, className, showLabel, interactive }: { label: string; hue: number; className?: string; showLabel?: boolean; interactive?: boolean }) {
  return (
    <div
      className={cn(
        "hairline overflow-hidden rounded-[5%/3.6%] bg-gradient-to-b from-navy-600 to-navy-800 p-[5%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <div className="flex h-full flex-col gap-[4%]">
        <div className="flex items-center justify-between">
          <span className="h-[0.35rem] w-[42%] rounded-full bg-white/70" />
          <span className="h-[0.35rem] w-[14%] rounded-full bg-mint/70" />
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3%] ring-1 ring-white/20">
          <Foil hue={hue} interactive={interactive} />
        </div>
        <div className="space-y-[6%] pt-[2%]">
          <span className="block h-[0.3rem] w-[86%] rounded-full bg-white/25" />
          <span className="block h-[0.3rem] w-[70%] rounded-full bg-white/15" />
          <span className="block h-[0.3rem] w-[78%] rounded-full bg-white/15" />
        </div>
        {showLabel && (
          <p className="mt-auto truncate font-mono text-[clamp(0.45rem,0.9vw,0.6rem)] uppercase tracking-[0.12em] text-mist/80">
            Placeholder · {label}
          </p>
        )}
      </div>
    </div>
  );
}

function Slab({ label, hue, interactive }: { label: string; hue: number; interactive?: boolean }) {
  return (
    <div className="hairline absolute inset-0 flex flex-col overflow-hidden rounded-[var(--radius-slab)] bg-[linear-gradient(180deg,#1d3a6e,#0c2349_55%,#081a3a)] p-[5%] shadow-[0_40px_80px_-24px_rgb(0_0_0/0.8)]">
      {/* Label */}
      <div className="flex items-stretch justify-between gap-2 rounded-[0.6rem] bg-paper px-[6%] py-[5%] text-ink">
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-[clamp(0.45rem,0.85vw,0.62rem)] font-medium uppercase tracking-[0.14em]">Grailz Co</p>
          <p className="truncate font-mono text-[clamp(0.42rem,0.75vw,0.55rem)] uppercase tracking-[0.1em] text-ink/60">
            Placeholder · {label}
          </p>
        </div>
        <div className="flex aspect-square shrink-0 items-center justify-center rounded-md bg-ink px-[0.4em] font-display text-[clamp(0.8rem,1.6vw,1.25rem)] font-bold text-mint">
          G
        </div>
      </div>
      {/* Inner card well */}
      <div className="relative mt-[6%] flex-1 rounded-[0.85rem] bg-navy-900/70 p-[7%] ring-1 ring-inset ring-white/10">
        <div className="relative h-full overflow-hidden rounded-[5%/3.6%] bg-gradient-to-b from-navy-600 to-navy-800 p-[6%]">
          <div className="flex h-full flex-col gap-[5%]">
            <span className="h-[0.3rem] w-1/2 rounded-full bg-white/60" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3%] ring-1 ring-white/20">
              <Foil hue={hue} interactive={interactive} />
            </div>
            <span className="h-[0.3rem] w-4/5 rounded-full bg-white/20" />
            <span className="h-[0.3rem] w-3/5 rounded-full bg-white/15" />
          </div>
        </div>
      </div>
      {/* Case reflection */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.08)_45%,transparent_55%)]" />
    </div>
  );
}
