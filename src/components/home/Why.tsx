"use client";

import Image from "next/image";
import { Check, ImagePlus, Mail, Search } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/content/copy";
import { cn } from "@/lib/cn";

/** Bento layout: wide/narrow on the first row, narrow/wide on the second. */
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];
const VISUALS = [SubmitVisual, ReviewVisual, ContactVisual, CollectorVisual];

export function Why() {
  return (
    <section aria-labelledby="why-title" className="relative overflow-hidden py-16 md:py-24">
      <div aria-hidden="true" className="absolute -right-40 top-10 size-[30rem] rounded-full bg-mint/[0.07] blur-[120px]" />
      <div className="container-grail relative">
        <h2 id="why-title" className="sr-only">
          Why Grailz Co
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {pillars.map((p, i) => {
            const Visual = VISUALS[i];
            return (
              <Reveal key={p.index} delay={i * 0.08} className={SPAN[i]}>
                <Tile>
                  <div className="relative h-48 sm:h-56">
                    <Visual />
                  </div>
                  <div className="relative mt-6">
                    <span className="inline-flex rounded-full border border-mint/30 bg-mint/[0.08] px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.1em] text-mint">
                      {p.index}
                    </span>
                    <h3 className="mt-4 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-white md:text-[1.85rem]">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-md leading-relaxed text-mist">{p.body}</p>
                  </div>
                </Tile>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Card-like panel with a mint glow that follows the pointer. */
function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
      }}
      className="hairline group relative h-full overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-navy-800 to-navy p-6 transition-transform duration-500 ease-[var(--ease-grail)] hover:-translate-y-1 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 0%), rgb(55 245 199 / 0.12), transparent 60%)" }}
      />
      {children}
    </div>
  );
}

function MiniCard({ src, className, sizes = "120px" }: { src: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative aspect-[330/460] overflow-hidden rounded-[0.45rem] shadow-[0_18px_36px_-14px_rgb(0_0_0/0.8)] ring-1 ring-white/10", className)}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/* ---- 01 Simple submissions: a mini version of the form ---- */
function SubmitVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-[26rem] rounded-2xl border border-white/10 bg-navy-900/80 p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] transition-transform duration-500 ease-[var(--ease-grail)] group-hover:-translate-y-1">
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Card name" value="Charizard ex" caret />
          <Field label="Condition" value="Near Mint" />
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <MiniCard src="/images/cards/charizard-ex.png" className="w-11 -rotate-3" sizes="44px" />
          <MiniCard src="/images/cards/greninja-ex.png" className="w-11 rotate-2" sizes="44px" />
          <span className="flex h-[3.85rem] w-11 items-center justify-center rounded-[0.45rem] border border-dashed border-mint/40 text-mint">
            <ImagePlus className="size-4" />
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-2 text-xs font-semibold text-navy transition-shadow duration-500 group-hover:shadow-[0_8px_24px_-6px_rgb(55_245_199/0.7)]">
            Submit <Check className="size-3.5" strokeWidth={3} />
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, caret }: { label: string; value: string; caret?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-navy/80 px-3 py-2">
      <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-haze">{label}</p>
      <p className="mt-0.5 truncate text-[0.8rem] font-medium text-white">
        {value}
        {caret && <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-pulse bg-mint" />}
      </p>
    </div>
  );
}

/* ---- 02 Individual review: a loupe over a real card ---- */
function ReviewVisual() {
  const src = "/images/cards/machamp-1st-edition.png";
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <MiniCard src={src} className="w-32 -rotate-3 sm:w-36" sizes="150px" />
        {/* Loupe: the same card magnified inside a ring; drifts to a new spot on hover */}
        <div className="absolute -right-10 top-4 size-24 overflow-hidden rounded-full border-2 border-mint bg-navy shadow-[0_0_0_6px_rgb(55_245_199/0.12),0_20px_40px_-12px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-[var(--ease-grail)] group-hover:-translate-x-12 group-hover:translate-y-16 sm:size-28">
          <div className="absolute left-1/2 top-1/2 w-[20rem] -translate-x-[62%] -translate-y-[30%] transition-transform duration-700 ease-[var(--ease-grail)] group-hover:-translate-x-[35%] group-hover:-translate-y-[62%]">
            <div className="relative aspect-[330/460]">
              <Image src={src} alt="" fill sizes="320px" className="object-cover" />
            </div>
          </div>
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.25),transparent_45%)]" />
        </div>
        <span className="absolute -bottom-3 -left-6 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-navy-900/90 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-mist">
          <Search className="size-3 text-mint" /> Corners · Edges · Surface
        </span>
      </div>
    </div>
  );
}

/* ---- 03 Direct communication: an email from Grailz Co ---- */
function ContactVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-[19rem]">
        <div className="absolute inset-x-6 -bottom-2.5 h-full rounded-2xl border border-white/5 bg-navy-800/60" />
        <div className="relative rounded-2xl border border-white/10 bg-navy-900/90 p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] transition-transform duration-500 ease-[var(--ease-grail)] group-hover:-translate-y-1.5">
          <div className="flex items-center gap-3">
            <Image src="/brand/grailzco-logo.png" alt="" width={36} height={36} className="size-9" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Grailz Co</p>
              <p className="truncate font-mono text-[0.6rem] uppercase tracking-[0.12em] text-haze">To: you</p>
            </div>
            <span className="ml-auto flex size-7 items-center justify-center rounded-full bg-mint text-navy">
              <Mail className="size-3.5" />
            </span>
          </div>
          <p className="mt-3 text-[0.82rem] font-semibold text-white">About your submission</p>
          <div className="mt-2 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-white/15" />
            <span className="block h-1.5 w-11/12 rounded-full bg-white/10" />
            <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- 04 Collector-first: a small fan that opens on hover ---- */
function CollectorVisual() {
  const fan = [
    { src: "/images/cards/pikachu.png", cls: "-rotate-[14deg] -translate-x-[78%] group-hover:-translate-x-[105%] group-hover:-rotate-[20deg]" },
    { src: "/images/cards/pecharunt.png", cls: "-rotate-[5deg] -translate-x-[28%] group-hover:-translate-x-[38%] group-hover:-rotate-[7deg]" },
    { src: "/images/cards/ogerpon.png", cls: "rotate-[5deg] translate-x-[28%] group-hover:translate-x-[38%] group-hover:rotate-[7deg]" },
    { src: "/images/cards/gyarados-ex.png", cls: "rotate-[14deg] translate-x-[78%] group-hover:translate-x-[105%] group-hover:rotate-[20deg]" },
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-full w-28 sm:w-32">
        {fan.map((c, i) => (
          <div
            key={c.src}
            className={cn(
              "absolute inset-x-0 top-1/2 -translate-y-1/2 transition-transform duration-700 ease-[var(--ease-grail)]",
              i === 1 || i === 2 ? "z-10" : "",
              c.cls,
            )}
          >
            <MiniCard src={c.src} sizes="130px" />
          </div>
        ))}
        <span className="absolute -bottom-1 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-3 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-navy">
          From one collector to another
        </span>
      </div>
    </div>
  );
}
