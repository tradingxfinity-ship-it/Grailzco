"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** Progress bar, step counter and back button shown above every step. */
export function StepHeader({ step, total, onBack }: { step: number; total: number; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        aria-label="Previous step"
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-mint/60 hover:text-mint disabled:invisible"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-mint-deep to-mint transition-[width] duration-500 ease-[var(--ease-grail)]"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
      <span className="font-mono text-xs text-mist">
        {step + 1}/{total}
      </span>
    </div>
  );
}

/** Eyebrow pill + big question + helper line for the top of a step. */
export function StepTitle({
  id,
  eyebrow,
  title,
  hint,
}: {
  id: string;
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div>
      <span className="inline-flex rounded-full border border-mint/30 bg-mint/[0.08] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mint">
        {eyebrow}
      </span>
      <h2
        id={id}
        tabIndex={-1}
        className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white outline-none"
      >
        {title}
      </h2>
      {hint && <p className="mt-3 text-[1.02rem] text-mist">{hint}</p>}
    </div>
  );
}

/** Large tappable single-choice options. Picking one calls `onPick` (the form auto-advances). */
export function OptionList({
  name,
  labelledBy,
  options,
  value,
  onPick,
  error,
}: {
  name: string;
  labelledBy: string;
  options: readonly { value: string; hint: string }[];
  value: string;
  onPick: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div role="radiogroup" aria-labelledby={labelledBy} aria-invalid={!!error || undefined} className="mt-8 grid gap-3">
        {options.map((o, i) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onPick(o.value)}
              className={cn(
                "group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-grail)] hover:-translate-y-0.5",
                selected
                  ? "border-mint bg-mint/[0.08] shadow-[0_0_0_4px_rgb(55_245_199/0.12)]"
                  : "border-white/12 bg-navy-800/60 hover:border-mint/50 hover:bg-navy-800",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs transition-colors",
                  selected ? "bg-mint text-navy" : "bg-white/[0.06] text-mint group-hover:bg-mint/15",
                )}
              >
                {selected ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">{o.value}</span>
                {o.hint && <span className="mt-0.5 block text-sm text-mist">{o.hint}</span>}
              </span>
              <ChevronRight
                aria-hidden="true"
                className={cn("size-4 shrink-0 transition-transform", selected ? "text-mint" : "text-haze group-hover:translate-x-0.5")}
              />
            </button>
          );
        })}
      </div>
      {error && (
        <p data-error="true" tabIndex={-1} className="mt-3 text-sm font-medium text-[#ff9a9a]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Small pill choices for optional preferences (click again to clear). */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="mx-0 min-w-0 border-0 p-0">
      <legend className="mb-2 flex w-full items-baseline justify-between text-[0.92rem] font-medium text-white/90">
        {label}
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze">Optional</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? "" : o)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                on ? "border-mint bg-mint/10 text-mint" : "border-white/15 text-mist hover:border-mint/50 hover:text-white",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
