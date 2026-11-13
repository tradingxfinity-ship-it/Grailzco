/**
 * Central image registry.
 *
 * Every visual on the site reads from a named slot below. While `src` is null the
 * slot renders a clearly labelled, art-directed placeholder (abstract holographic
 * foil inside a card or slab frame) — no invented Pokémon artwork is used.
 *
 * To use real photography: drop the file into /public/images and set `src`
 * (e.g. "/images/hero-primary.jpg"), plus accurate `alt` text and credit.
 * Only use photography Grailz Co owns or is licensed to use.
 */
export type ImageSlot = {
  src: string | null;
  alt: string;
  /** Shown in the placeholder label so the slot is easy to identify. */
  label: string;
  credit?: string;
};

const slot = (label: string, alt: string): ImageSlot => ({ src: null, alt, label });

export const images = {
  heroPrimary: slot("hero-primary", "A professionally graded holographic Pokémon card in a protective slab"),
  heroLeft: slot("hero-left", "A vintage holographic Pokémon card"),
  heroRight: slot("hero-right", "A modern full-art Pokémon card"),

  aboutBinder: Array.from({ length: 9 }, (_, i) =>
    slot(`about-binder-${i + 1}`, "A trading card from a carefully arranged collection"),
  ),

  categoryVintage: slot("category-vintage", "Vintage Pokémon cards from early sets"),
  categoryModern: slot("category-modern", "Modern Pokémon cards and sought-after pulls"),
  categoryGraded: slot("category-graded", "A Pokémon card inside a grading slab"),
  categoryLots: slot("category-lots", "A stack of trading cards submitted as a collection"),

  whatnotFeature: slot("whatnot-feature", "Grailz Co on Whatnot"),

  ctaFanLeft: slot("cta-fan-left", "A holographic trading card"),
  ctaFanCenter: slot("cta-fan-center", "A graded trading card in a slab"),
  ctaFanRight: slot("cta-fan-right", "A holographic trading card"),

  sellHeroA: slot("sell-hero-a", "A holographic trading card"),
  sellHeroB: slot("sell-hero-b", "A graded trading card in a slab"),

  howHero: slot("how-hero", "A graded Pokémon card under studio lighting"),
  howStage1: slot("how-stage-1", "A collector photographing a trading card"),
  howStage2: slot("how-stage-2", "A trading card being examined closely"),
  howStage3: slot("how-stage-3", "A graded trading card ready for the next step"),
  guideFront: slot("guide-front", "Example photo of the front of a trading card"),
  guideBack: slot("guide-back", "Example photo of the back of a trading card"),

  og: slot("og-image", "Grailz Co — Your Cards. Our Passion."),
} as const;
