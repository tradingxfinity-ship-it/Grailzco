"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { Fragment } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article" | "p";
};

/** Fade + rise into view once. Reduced motion is handled globally by MotionConfig. */
export function Reveal({ delay = 0, y = 28, as = "div", children, ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

type SplitProps = {
  /** Lines of the headline; each line can mark words to highlight in mint with *asterisks*. */
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  /** Animate on mount rather than when scrolled into view. */
  immediate?: boolean;
  id?: string;
};

/**
 * Editorial headline with a masked, staggered word reveal.
 * Words wrapped in *asterisks* render in Electric Mint.
 */
export function SplitHeadline({ lines, className, as = "h2", delay = 0, immediate = false, id }: SplitProps) {
  const Tag = motion[as];
  let wordIndex = 0;
  const label = lines.join(" ").replace(/\*/g, "");

  return (
    <Tag
      id={id}
      className={className}
      aria-label={label}
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split(" ").map((raw, wi, arr) => {
            const highlight = raw.startsWith("*") && raw.endsWith("*");
            const word = raw.replace(/\*/g, "");
            const i = wordIndex++;
            return (
              <Fragment key={wi}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className={highlight ? "inline-block text-mint" : "inline-block"}
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: "0%", transition: { duration: 1, ease: EASE, delay: delay + i * 0.07 } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < arr.length - 1 && " "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

export function SectionLabel({ index, children, className }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className ?? ""}`}>
      <span className="text-mint">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-mint/40" />
      <span>{children}</span>
    </p>
  );
}
