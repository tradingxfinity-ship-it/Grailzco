import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/** Focused, distraction-free layout for the step-by-step sell flow. */
export default function FunnelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-faint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_30%,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10%] size-[44rem] -translate-x-1/2 rounded-full bg-mint/[0.07] blur-[140px]"
      />
      <header className="container-grail relative flex h-[4.5rem] items-center justify-between md:h-20">
        <Link href="/" aria-label="Grailz Co — home" className="-m-1 p-1">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-mist transition-colors hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to site
        </Link>
      </header>
      <main id="main" tabIndex={-1} className="relative outline-none">
        {children}
      </main>
    </div>
  );
}
