"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { CardArt } from "@/components/visuals/CardArt";
import { EASE } from "@/components/ui/Reveal";
import { images } from "@/content/images";

/**
 * Layered hero composition: a central graded slab flanked by two raw holos.
 * On fine-pointer devices the stack tilts gently and the foil tracks the cursor.
 */
export function HeroCards() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 80, damping: 20, mass: 0.6 });

  const rotY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotX = useTransform(sy, [-1, 1], [5, -5]);
  const backX = useTransform(sx, [-1, 1], [-14, 14]);
  const backY = useTransform(sy, [-1, 1], [-10, 10]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      px.set(Math.max(-1, Math.min(1, nx * 2 - 1)));
      py.set(Math.max(-1, Math.min(1, ny * 2 - 1)));
      el.style.setProperty("--mx", String(Math.round(nx * 100)));
      el.style.setProperty("--my", String(Math.round(ny * 100)));
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, reduce]);

  return (
    <div ref={ref} className="relative mx-auto aspect-[1/1.02] w-full max-w-[38rem] [perspective:1400px]">
      {/* Mint halo */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/15 blur-[90px]"
      />
      {/* Slab-outline motif */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
        className="absolute left-1/2 top-1/2 h-[96%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border border-mint/20"
      />

      <motion.div style={{ x: backX, y: backY }} className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, x: 60, rotate: -2, y: 30 }}
          animate={{ opacity: 1, x: 0, rotate: -11, y: 0 }}
          transition={{ duration: 1.3, delay: 0.55, ease: EASE }}
          className="absolute left-[2%] top-[22%] w-[38%]"
        >
          <CardArt slot={images.heroLeft} hue={-28} interactive priority sizes="(min-width: 1024px) 15vw, 35vw" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -60, rotate: 2, y: 30 }}
          animate={{ opacity: 1, x: 0, rotate: 10, y: 0 }}
          transition={{ duration: 1.3, delay: 0.65, ease: EASE }}
          className="absolute right-[2%] top-[18%] w-[38%]"
        >
          <CardArt slot={images.heroRight} hue={32} interactive priority sizes="(min-width: 1024px) 15vw, 35vw" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="absolute left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
        >
          <CardArt slot={images.heroPrimary} variant="slab" interactive priority sizes="(min-width: 1024px) 20vw, 50vw" />
        </motion.div>
      </motion.div>

      {/* Collector metadata annotations */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="pointer-events-none absolute inset-0 hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mist sm:block"
      >
        <span className="absolute left-[4%] top-[8%] flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-mint" /> Graded
        </span>
        <span className="absolute bottom-[7%] right-[5%] flex items-center gap-2">
          Holo · Vintage · Modern <span className="h-px w-6 bg-mint/60" />
        </span>
      </motion.div>
    </div>
  );
}
