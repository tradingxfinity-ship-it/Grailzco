import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { label: "Home", href: "/" },
    { label: "Sell Your Cards", href: "/sell" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy-900">
      <div className="container-grail grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" aria-label={`${siteConfig.name} — home`} className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-mist">
            A home for collectors looking to sell Pokémon and collectible trading cards. Tell us what you&apos;ve got —
            every submission is reviewed individually.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/90 transition-colors hover:text-mint">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow">Connect</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={siteConfig.whatnotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-white/90 transition-colors hover:text-mint"
              >
                Grailz Co on Whatnot
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              {siteConfig.contactEmail ? (
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-white/90 transition-colors hover:text-mint">
                  {siteConfig.contactEmail}
                </a>
              ) : (
                // PLACEHOLDER — set NEXT_PUBLIC_CONTACT_EMAIL to show the public contact address.
                <span className="text-haze">Contact email coming soon</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-grail flex flex-col gap-2 py-6 text-sm text-haze sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Grailz Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
