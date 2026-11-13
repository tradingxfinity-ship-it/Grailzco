/**
 * Submission schema, options and limits — shared by the browser form and the
 * /api/submit route so both sides validate identically.
 */

export const CONDITION_OPTIONS = [
  "Mint",
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
  "Unsure",
] as const;

export const GRADING_OPTIONS = ["Ungraded", "PSA", "BGS", "CGC", "Other", "Unsure"] as const;

export const CATEGORY_OPTIONS = [
  "Vintage Pokémon",
  "Modern Pokémon",
  "Graded card",
  "Collection / lot",
  "Other trading card",
] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * Limits. The defaults are sized for Resend (40 MB per email after encoding)
 * and for common serverless request-body caps (~4.5 MB on Vercel). Photos are
 * resized in the browser before upload, so the per-file cap applies to the
 * original the visitor selects; the total cap applies to what is uploaded.
 * The NEXT_PUBLIC_ values must match on client and server.
 */
const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const LIMITS = {
  maxCards: num(process.env.NEXT_PUBLIC_SUBMISSION_MAX_CARDS, 10),
  maxImagesTotal: num(process.env.NEXT_PUBLIC_SUBMISSION_MAX_IMAGES, 12),
  maxImagesPerCard: 6,
  /** Largest original file a visitor may choose (before in-browser resizing). */
  maxSourceFileMB: num(process.env.NEXT_PUBLIC_SUBMISSION_MAX_SOURCE_MB, 20),
  /** Largest single processed image accepted by the server. */
  maxUploadFileMB: 3,
  /** Total upload size accepted by the server for one submission. */
  maxTotalMB: num(process.env.NEXT_PUBLIC_SUBMISSION_MAX_TOTAL_MB, 4),
  /** Longest edge (px) photos are resized to before upload. */
  resizeMaxEdge: 1800,
  text: {
    name: 120,
    email: 200,
    phone: 40,
    cardName: 200,
    set: 160,
    askingPrice: 60,
    notes: 2000,
  },
} as const;

export const MB = 1024 * 1024;

export type CardEntry = {
  name: string;
  category: string;
  set: string;
  condition: string;
  grading: string;
  quantity: string;
  askingPrice: string;
  notes: string;
};

export type SubmissionPayload = {
  fullName: string;
  email: string;
  phone: string;
  consent: boolean;
  cards: CardEntry[];
  /** Honeypot — must stay empty. */
  website: string;
  /** ms since the form was rendered — basic bot timing check. */
  elapsedMs: number;
};

export const emptyCard = (): CardEntry => ({
  name: "",
  category: "",
  set: "",
  condition: "",
  grading: "",
  quantity: "1",
  askingPrice: "",
  notes: "",
});

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-.\s\d]{6,}$/;

/** Validates text fields. Keys: fullName, email, phone, consent, cards.{i}.{field} */
export function validateSubmission(p: SubmissionPayload): FieldErrors {
  const e: FieldErrors = {};
  const t = LIMITS.text;

  if (!p.fullName.trim()) e.fullName = "Please enter your full name.";
  else if (p.fullName.length > t.name) e.fullName = `Please keep your name under ${t.name} characters.`;

  if (!p.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(p.email.trim()) || p.email.length > t.email)
    e.email = "Please enter a valid email address, like name@example.com.";

  if (p.phone.trim() && (!PHONE_RE.test(p.phone.trim()) || p.phone.length > t.phone))
    e.phone = "Please enter a valid phone number, or leave this blank.";

  if (!p.consent) e.consent = "Please confirm so we can review and respond to your submission.";

  if (!Array.isArray(p.cards) || p.cards.length === 0) e.cards = "Please add at least one card.";
  else if (p.cards.length > LIMITS.maxCards) e.cards = `You can add up to ${LIMITS.maxCards} cards per submission.`;

  p.cards?.forEach((c, i) => {
    const k = (f: string) => `cards.${i}.${f}`;
    if (!c.name.trim()) e[k("name")] = "Please describe this card.";
    else if (c.name.length > t.cardName) e[k("name")] = `Please keep this under ${t.cardName} characters.`;
    if (c.category && !(CATEGORY_OPTIONS as readonly string[]).includes(c.category))
      e[k("category")] = "Please choose a category from the list.";
    if (c.set.length > t.set) e[k("set")] = `Please keep this under ${t.set} characters.`;
    if (!c.condition) e[k("condition")] = "Please choose a condition (or “Unsure”).";
    else if (!(CONDITION_OPTIONS as readonly string[]).includes(c.condition))
      e[k("condition")] = "Please choose a condition from the list.";
    if (!c.grading) e[k("grading")] = "Please choose a grading status (or “Unsure”).";
    else if (!(GRADING_OPTIONS as readonly string[]).includes(c.grading))
      e[k("grading")] = "Please choose a grading status from the list.";
    const q = Number(c.quantity);
    if (!c.quantity.trim() || !Number.isInteger(q) || q < 1 || q > 9999)
      e[k("quantity")] = "Please enter a whole number from 1 to 9999.";
    if (c.askingPrice.length > t.askingPrice) e[k("askingPrice")] = "Please keep this short.";
    if (c.notes.length > t.notes) e[k("notes")] = `Please keep this under ${t.notes} characters.`;
  });

  return e;
}
