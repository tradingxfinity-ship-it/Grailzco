"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Particle = {
  x: number;
  y: number;
  r: number;
  /** 0 (far) – 1 (near): drives size, speed and brightness. */
  depth: number;
  vx: number;
  vy: number;
  phase: number;
  mint: boolean;
};

/**
 * Soft dust/foil specks drifting slowly upward on a canvas.
 * Pauses when off-screen or the tab is hidden; draws a still frame for reduced motion.
 */
export function Particles({ className, density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const spawn = (anywhere: boolean): Particle => {
      const depth = Math.random() ** 1.6; // most specks sit far back
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.5 + depth * 1.8,
        depth,
        vx: (Math.random() - 0.5) * 4,
        vy: -(4 + depth * 14),
        phase: Math.random() * Math.PI * 2,
        mint: Math.random() < 0.55,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 11000) * density);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + p.phase);
        const alpha = (0.22 + p.depth * 0.6) * twinkle;
        const color = p.mint ? "55,245,199" : "150,185,235";
        // soft glow + bright core
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${color},${alpha})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += (p.vx + Math.sin(now / 2000 + p.phase) * 3) * dt;
        p.y += p.vy * dt;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) particles[i] = spawn(false);
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
