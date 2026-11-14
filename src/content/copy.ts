/**
 * Site copy. Kept in one place so business details can be confirmed and edited
 * without touching layout code. Nothing here should promise prices, payment
 * methods, turnaround times or acceptance.
 */

export const categories = [
  {
    key: "vintage",
    index: "01",
    title: "Old-school cards",
    short: "Vintage",
    body: "Classic cards and early collectible releases — the ones that started it all and still turn heads.",
    meta: "WOTC era · Early sets · Holos",
  },
  {
    key: "modern",
    index: "02",
    title: "Newer cards",
    short: "Modern",
    body: "Contemporary sets, sought-after pulls and modern favourites, from alt arts to illustration rares.",
    meta: "Current sets · Chase cards · Full arts",
  },
  {
    key: "graded",
    index: "03",
    title: "Graded slabs",
    short: "Graded",
    body: "Professionally authenticated or graded collectibles. Tell us the grader and grade, and include clear slab photos.",
    meta: "PSA · BGS · CGC · Others",
  },
  {
    key: "lots",
    index: "04",
    title: "Whole collections",
    short: "Lots",
    body: "Multiple cards submitted together. Add each standout card, or describe the collection as a whole.",
    meta: "Binders · Bulk · Mixed lots",
  },
] as const;

export const pillars = [
  {
    index: "01",
    title: "Quick and easy",
    body: "One clear form. Describe your cards, add photos, and send it over — no account to create.",
  },
  {
    index: "02",
    title: "We look at every card",
    body: "Every submission is looked at on its own merits: the cards, the photos and the details you share.",
  },
  {
    index: "03",
    title: "Talk to a real person",
    body: "When we follow up, it's with you directly, using the contact details you provide.",
  },
  {
    index: "04",
    title: "Run by collectors",
    body: "We're collectors too. We know what a card can mean, and we treat every submission that way.",
  },
] as const;

export const journey = [
  {
    index: "01",
    title: "Tell us what you've got",
    body: "Fill out the submission form, describe your cards and upload photos of the front and back. One card or a whole binder — it all starts in the same place.",
    points: ["Contact details", "Card descriptions", "Front & back photos"],
  },
  {
    index: "02",
    title: "We take a look",
    body: "Grailz Co reviews the information you've shared — the cards, the images, their condition and any grading details — to understand what you have.",
    points: ["Photos & condition", "Set & release", "Grading status"],
  },
  {
    index: "03",
    title: "We get back to you",
    body: "Where appropriate, Grailz Co contacts you to discuss an offer, or to ask for more information. You decide whether to go ahead.",
    points: ["Direct contact", "Questions answered", "No obligation"],
  },
] as const;

export const submissionNotice =
  "Submitting your cards does not guarantee an offer. Grailz Co will review your information and contact you if further details are needed.";
