"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";

/** Shown only after /api/submit confirms the email was accepted for delivery. */
export function SubmissionSuccess({ email, onReset }: { email: string; onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative py-4 sm:py-8"
      role="status"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        className="relative flex size-16 items-center justify-center rounded-2xl bg-mint text-navy"
      >
        <Check aria-hidden="true" className="size-8" strokeWidth={2.5} />
      </motion.span>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="relative mt-10 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.04em] outline-none"
      >
        Thanks, we&apos;ve got <span className="text-mint">your cards!</span>
      </h2>
      <p className="lede relative mt-6 max-w-xl">
        Your submission came through. We&apos;ll take a look and get back to you soon about next steps.
      </p>
      {email && (
        <p className="relative mt-4 text-sm text-haze">
          We&apos;ll use <span className="text-white">{email}</span> to get in touch.
        </p>
      )}
      <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Back to Home
        </ButtonLink>
        <Button type="button" variant="outline" size="lg" onClick={onReset}>
          Submit More Cards
        </Button>
      </div>
    </motion.div>
  );
}
