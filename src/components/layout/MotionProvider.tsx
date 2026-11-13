"use client";

import { MotionConfig } from "motion/react";

/** Honour the visitor's reduced-motion preference across every motion component. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
