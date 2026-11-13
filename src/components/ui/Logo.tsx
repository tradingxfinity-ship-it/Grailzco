import { cn } from "@/lib/cn";

/** Typographic wordmark with a slab-shaped monogram. Replace with official brand assets when available. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 36" aria-hidden="true" className="h-8 w-auto shrink-0">
        <rect x="1" y="1" width="26" height="34" rx="5" fill="none" stroke="#37F5C7" strokeWidth="1.6" />
        <rect x="4.5" y="4.5" width="19" height="5" rx="1.5" fill="#37F5C7" opacity="0.9" />
        <path
          d="M19.5 17.5h-5.2v3.2h2.4c-.4 1.7-1.7 2.7-3.3 2.7-2 0-3.5-1.6-3.5-3.9s1.5-3.9 3.5-3.9c1 0 1.9.4 2.5 1.1l2.3-2.1A6.7 6.7 0 0 0 13.4 12c-3.9 0-6.7 2.9-6.7 7.5S9.5 27 13.4 27c3.7 0 6.2-2.6 6.2-6.9 0-.9 0-1.8-.1-2.6Z"
          fill="#fff"
        />
      </svg>
      <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em] text-white">
        Grailz<span className="text-mint">Co</span>
      </span>
    </span>
  );
}
