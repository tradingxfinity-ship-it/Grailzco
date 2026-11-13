/**
 * Central site configuration.
 * Values marked PLACEHOLDER must be replaced with confirmed business details.
 */
export const siteConfig = {
  name: "Grailz Co",
  shortName: "Grailz",
  tagline: "Your Cards. Our Passion.",
  description:
    "Grailz Co reviews Pokémon and collectible trading-card submissions from collectors. Tell us about your cards, upload photos, and we'll be in touch.",
  // PLACEHOLDER — set NEXT_PUBLIC_SITE_URL in production for canonical URLs, sitemap and OG tags.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatnotUrl: "https://www.whatnot.com/user/grailzco",
  whatnotHandle: "@grailzco",
  // PLACEHOLDER — public contact address shown in the footer. Leave empty to show a "coming soon" label.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  nav: [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  sellHref: "/sell",
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
