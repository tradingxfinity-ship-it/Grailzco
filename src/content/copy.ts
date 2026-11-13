/**
 * Site copy. Kept in one place so business details can be confirmed and edited
 * without touching layout code. Nothing here should promise prices, payment
 * methods, turnaround times or acceptance.
 */

export const categories = [
  {
    key: "vintage",
    index: "01",
    title: "Vintage Pokémon",
    short: "Vintage",
    body: "Classic cards and early collectible releases — the ones that started it all and still turn heads.",
    meta: "WOTC era · Early sets · Holos",
  },
  {
    key: "modern",
    index: "02",
    title: "Modern Pokémon",
    short: "Modern",
    body: "Contemporary sets, sought-after pulls and modern favourites, from alt arts to illustration rares.",
    meta: "Current sets · Chase cards · Full arts",
  },
  {
    key: "graded",
    index: "03",
    title: "Graded Cards",
    short: "Graded",
    body: "Professionally authenticated or graded collectibles. Tell us the grader and grade, and include clear slab photos.",
    meta: "PSA · BGS · CGC · Others",
  },
  {
    key: "lots",
    index: "04",
    title: "Collections & Lots",
    short: "Lots",
    body: "Multiple cards submitted together. Add each standout card, or describe the collection as a whole.",
    meta: "Binders · Bulk · Mixed lots",
  },
] as const;

export const pillars = [
  {
    index: "01",
    title: "Simple submissions",
    body: "One clear form. Describe your cards, add photos, and send it over — no account to create.",
  },
  {
    index: "02",
    title: "Individual review",
    body: "Every submission is looked at on its own merits: the cards, the photos and the details you share.",
  },
  {
    index: "03",
    title: "Direct communication",
    body: "When we follow up, it's with you directly, using the contact details you provide.",
  },
  {
    index: "04",
    title: "Collector-first",
    body: "We're collectors too. We know what a card can mean, and we treat every submission that way.",
  },
] as const;

export const journey = [
  {
    index: "01",
    title: "Share your collection",
    body: "Fill out the submission form, describe your cards and upload photos of the front and back. One card or a whole binder — it all starts in the same place.",
    points: ["Contact details", "Card descriptions", "Front & back photos"],
  },
  {
    index: "02",
    title: "Collection review",
    body: "Grailz Co reviews the information you've shared — the cards, the images, their condition and any grading details — to understand what you have.",
    points: ["Photos & condition", "Set & release", "Grading status"],
  },
  {
    index: "03",
    title: "Offer & next steps",
    body: "Where appropriate, Grailz Co contacts you to discuss an offer, or to ask for more information. You decide whether to go ahead.",
    points: ["Direct contact", "Questions answered", "No obligation"],
  },
] as const;

export const sellingTips = [
  {
    title: "Photograph clearly",
    body: "Use even, natural light and avoid glare on holo surfaces and slabs. Fill the frame with the card.",
  },
  {
    title: "Show front and back",
    body: "Both sides tell the story — edges, corners and centring show up best with a photo of each.",
  },
  {
    title: "Describe condition honestly",
    body: "Note whitening, scratches, creases or print lines. Accurate details make for a better review.",
  },
  {
    title: "Mention grading",
    body: "If a card is graded, include the grading company and grade, and make sure the label is readable.",
  },
  {
    title: "Detail larger collections",
    body: "For lots and binders, list the highlights and give a rough count. Photograph standout cards individually.",
  },
] as const;

export const submissionNotice =
  "Submitting your cards does not guarantee an offer. Grailz Co will review your information and contact you if further details are needed.";
