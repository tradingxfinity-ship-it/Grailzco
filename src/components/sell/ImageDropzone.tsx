"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { LIMITS } from "@/lib/submission";
import { formatBytes } from "@/lib/images";
import { cn } from "@/lib/cn";

export type UploadImage = {
  id: string;
  name: string;
  status: "processing" | "ready";
  blob?: Blob;
  url?: string;
  size?: number;
};

type Props = {
  cardNumber: number;
  images: UploadImage[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  messages: string[];
  disabled?: boolean;
  error?: string;
};

export function ImageDropzone({ cardNumber, images, onAdd, onRemove, messages, disabled, error }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const guidanceId = `${inputId}-guidance`;
  const errorId = `${inputId}-error`;

  const handleFiles = (list: FileList | null) => {
    if (!list || disabled) return;
    onAdd(Array.from(list));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[0.92rem] font-medium text-white/90">Photos</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-haze">Front &amp; back recommended</span>
      </div>

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-2xl border border-dashed p-5 transition-colors duration-300 sm:p-6",
          dragging ? "border-mint bg-mint/[0.06]" : error ? "border-[#ff9a9a]/60" : "border-white/20 bg-navy-900/40",
        )}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mint/10 text-mint ring-1 ring-mint/30">
            <ImagePlus aria-hidden="true" className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-[0.98rem] text-white">
              <label
                htmlFor={inputId}
                className="cursor-pointer font-semibold text-mint underline decoration-mint/40 underline-offset-4 hover:decoration-mint"
              >
                Choose photos
              </label>
              <span className="hidden sm:inline"> or drag them here</span>
            </p>
            <p id={guidanceId} className="mt-1 text-sm text-haze">
              JPG, PNG or WebP · up to {LIMITS.maxSourceFileMB} MB each · {LIMITS.maxImagesPerCard} per card,{" "}
              {LIMITS.maxImagesTotal} per submission. Start with the front, then the back.
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          aria-label={`Add photos for card ${cardNumber}`}
          aria-describedby={error ? `${errorId} ${guidanceId}` : guidanceId}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />

        {images.length > 0 && (
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6" aria-label={`Photos for card ${cardNumber}`}>
            <AnimatePresence initial={false}>
              {images.map((img, i) => (
                <motion.li
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="group relative aspect-[63/88] overflow-hidden rounded-lg bg-navy-700 ring-1 ring-white/10"
                >
                  {img.status === "processing" || !img.url ? (
                    <span className="flex h-full items-center justify-center">
                      <Loader2 aria-hidden="true" className="size-5 animate-spin text-mint" />
                      <span className="sr-only">Preparing {img.name}</span>
                    </span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <img src={img.url} alt={`Photo ${i + 1} for card ${cardNumber}: ${img.name}`} className="h-full w-full object-cover" />
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-navy/80 px-1.5 py-0.5 font-mono text-[0.6rem] text-mist backdrop-blur">
                    {`#${i + 1}`}
                    {img.size ? ` · ${formatBytes(img.size)}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(img.id)}
                    disabled={disabled}
                    aria-label={`Remove photo ${i + 1} (${img.name}) from card ${cardNumber}`}
                    className="absolute right-1 top-1 flex size-8 items-center justify-center rounded-full bg-navy/85 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white hover:text-navy focus-visible:bg-white focus-visible:text-navy"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div aria-live="polite" className="empty:hidden">
        {messages.map((m, i) => (
          <p key={i} className="mt-2 text-sm text-[#ffc58a]">
            {m}
          </p>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-[#ff9a9a]">
          {error}
        </p>
      )}
    </div>
  );
}
