"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Escape to close, focus trap, and scroll lock while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a,button")].filter(
        Boolean,
      ) as HTMLElement[];
      const idx = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && idx === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const mobileLinks = [...siteConfig.nav, { label: "Sell Your Cards", href: siteConfig.sellHref }];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-navy/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-grail flex h-[4.5rem] items-center justify-between md:h-20">
          <Link href="/" aria-label={`${siteConfig.name} — home`} className="relative z-10 -m-1 p-1">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors",
                  isActive(item.href) ? "text-white" : "text-mist hover:text-white",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-mint"
                  />
                )}
              </Link>
            ))}
            <ButtonLink href={siteConfig.sellHref} className="ml-4" aria-label="Sell Your Cards">
              Sell Your Cards
            </ButtonLink>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 -mr-2 flex size-11 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 h-[2px] w-6 rounded-full bg-white transition-all duration-300 ease-[var(--ease-grail)]",
                  open ? "top-[5px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-[2px] rounded-full bg-mint transition-all duration-300 ease-[var(--ease-grail)]",
                  open ? "top-[5px] w-6 -rotate-45 bg-white" : "top-[10px] w-4",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise contain this fixed panel. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-navy md:hidden"
          >
            <nav aria-label="Mobile" className="container-grail flex min-h-full flex-col pb-10 pt-6">
              <ul className="flex flex-col">
                {mobileLinks.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="group flex items-center justify-between py-5 font-display text-[2.1rem] font-semibold tracking-[-0.035em]"
                    >
                      <span className={cn(isActive(item.href) ? "text-mint" : "text-white")}>{item.label}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-6 text-mist transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <p className="eyebrow">Also find us on</p>
                <a
                  href={siteConfig.whatnotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-lg font-semibold text-white underline decoration-mint/50 underline-offset-4"
                >
                  Whatnot {siteConfig.whatnotHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
