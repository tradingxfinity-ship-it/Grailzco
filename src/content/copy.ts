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
    image: "categoryVintage",
    variant: "raw",
  },
  {
    key: "modern",
    index: "02",
    title: "Modern Pokémon",
    short: "Modern",
    body: "Contemporary sets, sought-after pulls and modern favourites, from alt arts to illustration rares.",
    meta: "Current sets · Chase cards · Full arts",
    image: "categoryModern",
    variant: "raw",
  },
  {
    key: "graded",
    index: "03",
    title: "Graded Cards",
    short: "Graded",
    body: "Professionally authenticated or graded collectibles. Tell us the grader and grade, and include clear slab photos.",
    meta: "PSA · BGS · CGC · Others",
    image: "categoryGraded",
    variant: "slab",
  },
  {
    key: "lots",
    index: "04",
    title: "Collections & Lots",
    short: "Lots",
    body: "Multiple cards submitted together. Add each standout card, or describe the collection as a whole.",
    meta: "Binders · Bulk · Mixed lots",
    image: "categoryLots",
    variant: "stack",
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

export const processPreview = [
  {
    index: "01",
    title: "Submit your cards",
    body: "Tell Grailz Co about your cards and upload clear photographs.",
  },
  {
    index: "02",
    title: "We review",
    body: "The team examines the information and images you provided.",
  },
  {
    index: "03",
    title: "Hear from us",
    body: "Grailz Co gets in touch regarding an offer or next steps.",
  },
] as const;

export const journey = [
  {
    index: "01",
    title: "Share your collection",
    body: "Fill out the submission form, describe your cards and upload photos of the front and back. One card or a whole binder — it all starts in the same place.",
    points: ["Contact details", "Card descriptions", "Front & back photos"],
    image: "howStage1",
    variant: "raw",
  },
  {
    index: "02",
    title: "Collection review",
    body: "Grailz Co reviews the information you've shared — the cards, the images, their condition and any grading details — to understand what you have.",
    points: ["Photos & condition", "Set & release", "Grading status"],
    image: "howStage2",
    variant: "slab",
  },
  {
    index: "03",
    title: "Offer & next steps",
    body: "Where appropriate, Grailz Co contacts you to discuss an offer, or to ask for more information. You decide whether to go ahead.",
    points: ["Direct contact", "Questions answered", "No obligation"],
    image: "howStage3",
    variant: "slab",
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

export const goodSubmission = [
  {
    title: "Clear front & back photographs",
    body: "Sharp, well-lit images of both sides, with the whole card in frame.",
  },
  {
    title: "Accurate card descriptions",
    body: "Card name, set or release, and anything that sets it apart — edition, language, variant.",
  },
  {
    title: "Honest condition information",
    body: "Your best read on condition. If you're not sure, choose “Unsure” and let the photos speak.",
  },
  {
    title: "Grading details",
    body: "Grading company and grade for slabbed cards, with the label visible in the photo.",
  },
  {
    title: "Context for larger collections",
    body: "A rough count, the highlights, and how the collection is stored or organised.",
  },
] as const;

export const faqs = [
  {
    q: "Can I submit more than one card?",
    a: "Yes. You can add multiple cards to a single submission, or describe a larger collection in the additional information field.",
  },
  {
    q: "Do my cards need to be graded?",
    a: "No. You can submit details of graded or ungraded cards for consideration.",
  },
  {
    q: "Will I automatically receive an offer?",
    a: "No. Every submission is subject to review, and an offer is not guaranteed.",
  },
  {
    q: "How will Grailz Co contact me?",
    a: "Using the contact details you provide in your submission.",
  },
  {
    q: "Can I submit vintage and modern cards?",
    a: "Yes — you can submit information about both vintage and modern cards for review.",
  },
  {
    q: "Do I have to accept an offer?",
    a: "No. Submitting your cards does not obligate you to accept an offer.",
  },
] as const;

export const submissionNotice =
  "Submitting your cards does not guarantee an offer. Grailz Co will review your information and contact you if further details are needed.";
