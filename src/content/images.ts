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
  /** Hero card fan, left to right. Files supplied by Grailz Co (330×460). */
  heroFan: [
    { src: "/images/cards/pikachu.png", alt: "Pikachu Pokémon card", label: "hero-pikachu" },
    { src: "/images/cards/kyogre.png", alt: "Primal Kyogre full-art Pokémon card", label: "hero-kyogre" },
    { src: "/images/cards/fezandipiti.png", alt: "Fezandipiti full-art Pokémon card", label: "hero-fezandipiti" },
    { src: "/images/cards/charizard-ex.png", alt: "Charizard ex Pokémon card", label: "hero-charizard-ex" },
    { src: "/images/cards/wailord.png", alt: "Wailord Pokémon card", label: "hero-wailord" },
    { src: "/images/cards/vibrava.png", alt: "Vibrava illustration rare Pokémon card", label: "hero-vibrava" },
  ] satisfies ImageSlot[],

  /** About section binder page, row by row (4 per row on desktop). Files supplied by Grailz Co (330×460). */
  aboutBinder: [
    { src: "/images/cards/mega-charizard-x-ex.png", alt: "Mega Charizard X ex Pokémon card", label: "binder-mega-charizard-x" },
    { src: "/images/cards/pecharunt.png", alt: "Pecharunt illustration rare Pokémon card", label: "binder-pecharunt" },
    { src: "/images/cards/gyarados-ex.png", alt: "Gyarados EX full-art Pokémon card", label: "binder-gyarados-ex" },
    { src: "/images/cards/vibrava.png", alt: "Vibrava illustration rare Pokémon card", label: "binder-vibrava" },
    { src: "/images/cards/victini.png", alt: "Japanese Victini full-art Pokémon card", label: "binder-victini" },
    { src: "/images/cards/bulbasaur.png", alt: "Bulbasaur Pokémon card", label: "binder-bulbasaur" },
    { src: "/images/cards/ceruledge.png", alt: "Shiny Ceruledge Pokémon card", label: "binder-ceruledge" },
    { src: "/images/cards/kyogre-lv47.png", alt: "Kyogre LV.47 Pokémon card", label: "binder-kyogre-lv47" },
    { src: "/images/cards/flapple.png", alt: "Flapple illustration rare Pokémon card", label: "binder-flapple" },
    { src: "/images/cards/quaxwell.png", alt: "Quaxwell Pokémon card", label: "binder-quaxwell" },
    { src: "/images/cards/ogerpon.png", alt: "Japanese Ogerpon Pokémon card", label: "binder-ogerpon" },
    { src: "/images/cards/fezandipiti.png", alt: "Fezandipiti full-art Pokémon card", label: "binder-fezandipiti" },
  ] satisfies ImageSlot[],

  /** "What we look for" showcase, keyed by category. Lots shows all three as a fan. */
  categoryCards: {
    vintage: [{ src: "/images/cards/machamp-1st-edition.png", alt: "1st Edition Base Set Machamp holo Pokémon card", label: "category-machamp" }],
    modern: [{ src: "/images/cards/greninja-ex.png", alt: "Greninja ex Pokémon card", label: "category-greninja-ex" }],
    graded: [
      { src: "/images/cards/pikachu-movie-promo-psa-8.png", alt: "1999 Pikachu movie promo graded PSA 8 in its slab", label: "category-pikachu-psa-8" },
    ],
    lots: [
      { src: "/images/cards/bulbasaur.png", alt: "Bulbasaur Pokémon card", label: "category-lots-bulbasaur" },
      { src: "/images/cards/charizard-ex.png", alt: "Charizard ex Pokémon card", label: "category-lots-charizard-ex" },
      { src: "/images/cards/kyogre-lv47.png", alt: "Kyogre LV.47 Pokémon card", label: "category-lots-kyogre" },
    ],
  } satisfies Record<string, ImageSlot[]>,

  /** Whatnot panel fan: left, centre (front), right. */
  whatnotFan: [
    { src: "/images/cards/victini.png", alt: "Japanese Victini full-art Pokémon card", label: "whatnot-victini" },
    { src: "/images/cards/whatnot-grailzco-card.png", alt: "Card with the Whatnot and Grailz Co logos", label: "whatnot-card" },
    { src: "/images/cards/quaxwell.png", alt: "Quaxwell Pokémon card", label: "whatnot-quaxwell" },
  ] satisfies ImageSlot[],

  /** Faded fan behind the closing CTA: left, centre, right. */
  ctaFan: [
    { src: "/images/cards/ceruledge.png", alt: "Shiny Ceruledge Pokémon card", label: "cta-ceruledge" },
    { src: "/images/cards/mega-charizard-x-ex.png", alt: "Mega Charizard X ex Pokémon card", label: "cta-mega-charizard-x" },
    { src: "/images/cards/gyarados-ex.png", alt: "Gyarados EX full-art Pokémon card", label: "cta-gyarados-ex" },
  ] satisfies ImageSlot[],

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
