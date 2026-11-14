"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ImageSlot } from "@/content/images";

const LENS = 150; // px
const ZOOM = 2.6;

/**
 * The About binder's card grid with a magnifying lens that follows the cursor.
 * Mouse/trackpad only; touch devices just see the grid.
 */
export function BinderGrid({ cards, children }: { cards: ImageSlot[]; children?: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  const move = (e: React.PointerEvent<HTMLLIElement>, cardSrc: string) => {
    if (e.pointerType !== "mouse" || !wrapRef.current || !lensRef.current) return;
    const card = e.currentTarget.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const wrap = wrapRef.current.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const px = Math.min(Math.max(e.clientX - r.left, 0), r.width);
    const py = Math.min(Math.max(e.clientY - r.top, 0), r.height);
    const lens = lensRef.current.style;
    lens.transform = `translate(${e.clientX - wrap.left - LENS / 2}px, ${e.clientY - wrap.top - LENS / 2}px)`;
    lens.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
    lens.backgroundPosition = `${LENS / 2 - px * ZOOM}px ${LENS / 2 - py * ZOOM}px`;
    if (src !== cardSrc) setSrc(cardSrc);
  };

  return (
    <div ref={wrapRef} className="relative" onPointerLeave={() => setSrc(null)}>
      <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3" aria-label="A page of cards from a collection">
        {cards.map((card) => (
          <li
            key={card.label}
            onPointerMove={(e) => card.src && move(e, card.src)}
            className="rounded-[0.7rem] bg-navy-900 p-1.5 ring-1 ring-inset ring-white/[0.06] sm:p-2 [@media(pointer:fine)]:cursor-none"
          >
            <div data-card className="relative aspect-[330/460] overflow-hidden rounded-[0.4rem]">
              {card.src && <Image src={card.src} alt={card.alt} fill sizes="(min-width: 1024px) 120px, 28vw" className="object-cover" />}
            </div>
          </li>
        ))}
      </ul>

      {children}

      {/* Lens */}
      <div
        ref={lensRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border-2 border-mint bg-navy bg-no-repeat shadow-[0_0_0_6px_rgb(55_245_199/0.15),0_24px_50px_-12px_rgb(0_0_0/0.85)] transition-[opacity,scale] duration-200 ease-out"
        style={{
          width: LENS,
          height: LENS,
          backgroundImage: src ? `url(${src})` : undefined,
          opacity: src ? 1 : 0,
          scale: src ? "1" : "0.6",
        }}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.3),transparent_45%)]" />
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/80" />
      </div>
    </div>
  );
}
