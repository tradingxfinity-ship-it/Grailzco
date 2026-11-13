import Image from "next/image";
import { cn } from "@/lib/cn";

/** Official Grailz Co badge with the typographic wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/grailzco-logo.png"
        alt=""
        width={384}
        height={389}
        priority
        sizes="40px"
        className="size-9 shrink-0 md:size-10"
      />
      <span className="font-display text-[1.35rem] font-bold leading-none tracking-[-0.04em] text-white">
        Grailz<span className="text-mint">Co</span>
      </span>
    </span>
  );
}
