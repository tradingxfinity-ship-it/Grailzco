import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildSubmissionEmail, type CardWithPhotos } from "@/lib/email";
import { ACCEPTED_IMAGE_TYPES, LIMITS, MB, validateSubmission, type FieldErrors, type SubmissionPayload } from "@/lib/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ----------------------------------------------------------------------------
   Basic abuse protection. In-memory, so it is per-instance and best-effort on
   serverless platforms — pair with a platform firewall / Upstash rate limit
   for stronger guarantees in production.
---------------------------------------------------------------------------- */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MIN_FILL_MS = 3000;
const hits = new Map<string, number[]>();
const delivered = new Map<string, number>(); // submissionId → timestamp (duplicate guard)

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const fail = (status: number, error: string, fieldErrors?: FieldErrors) =>
  NextResponse.json({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status });

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.slice(0, max) : "");

/** Verifies the file's leading bytes really are JPEG, PNG or WebP. */
function sniffImage(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return fail(429, "You've sent several submissions in a short time. Please wait a few minutes and try again.");
  }

  // Size guard before parsing (Content-Length may be absent with chunked uploads).
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > (LIMITS.maxTotalMB + 1) * MB) {
    return fail(413, `Your photos are larger than ${LIMITS.maxTotalMB} MB in total. Please remove a few and try again.`);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "We couldn't read your submission. Please try again.");
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(str(form.get("payload"), 200_000));
  } catch {
    return fail(400, "We couldn't read your submission. Please try again.");
  }

  const rawCards = Array.isArray(raw.cards) ? raw.cards.slice(0, LIMITS.maxCards + 1) : [];
  const payload: SubmissionPayload = {
    fullName: str(raw.fullName).trim(),
    email: str(raw.email).trim(),
    phone: str(raw.phone).trim(),
    consent: raw.consent === true,
    website: str(raw.website),
    elapsedMs: typeof raw.elapsedMs === "number" ? raw.elapsedMs : 0,
    cards: rawCards.map((c: Record<string, unknown>) => ({
      name: str(c?.name).trim(),
      category: str(c?.category),
      set: str(c?.set).trim(),
      condition: str(c?.condition),
      grading: str(c?.grading),
      quantity: str(c?.quantity).trim(),
      askingPrice: str(c?.askingPrice).trim(),
      notes: str(c?.notes).trim(),
    })),
  };

  // Bot checks — reported honestly rather than faking success.
  if (payload.website) return fail(400, "We couldn't verify this submission. Please refresh the page and try again.");
  if (payload.elapsedMs < MIN_FILL_MS) return fail(400, "That was quick! Please review your details and submit again.");

  const fieldErrors = validateSubmission(payload);
  if (Object.keys(fieldErrors).length) {
    return fail(422, "Some details need another look.", fieldErrors);
  }

  // Collect and validate images (field names: card-{index}).
  const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
  const cards: CardWithPhotos[] = payload.cards.map((c) => ({ ...c, photos: [] }));
  let totalBytes = 0;
  const perCard = new Map<number, number>();

  for (const [key, value] of form.entries()) {
    const m = /^card-(\d+)$/.exec(key);
    if (!m) continue;
    if (typeof value === "string") continue;
    const ci = Number(m[1]);
    if (!cards[ci]) return fail(400, "A photo was attached to a card that doesn't exist. Please try again.");

    if (attachments.length >= LIMITS.maxImagesTotal)
      return fail(413, `Please attach no more than ${LIMITS.maxImagesTotal} photos per submission.`);
    const count = (perCard.get(ci) ?? 0) + 1;
    if (count > LIMITS.maxImagesPerCard)
      return fail(413, `Please attach no more than ${LIMITS.maxImagesPerCard} photos per card.`);
    perCard.set(ci, count);

    if (value.size > LIMITS.maxUploadFileMB * MB) return fail(413, `Each photo must be under ${LIMITS.maxUploadFileMB} MB.`);
    totalBytes += value.size;
    if (totalBytes > LIMITS.maxTotalMB * MB)
      return fail(413, `Your photos are larger than ${LIMITS.maxTotalMB} MB in total. Please remove a few and try again.`);

    const buf = Buffer.from(await value.arrayBuffer());
    const type = sniffImage(buf);
    if (!type || !(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type))
      return fail(415, "One of the files isn't a valid JPG, PNG or WebP image.");

    const filename = `card-${ci + 1}-photo-${count}.${EXT[type]}`;
    cards[ci].photos.push(filename);
    attachments.push({ filename, content: buf, contentType: type });
  }

  if (attachments.length === 0) {
    return fail(422, "Please add at least one photo so we can review your cards.", {
      images: "Please add at least one photo so we can review your cards.",
    });
  }

  // Delivery configuration.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.GRAILZCO_SUBMISSION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error(
      "[submit] Email delivery is not configured. Missing:",
      [!apiKey && "RESEND_API_KEY", !to && "GRAILZCO_SUBMISSION_EMAIL", !from && "RESEND_FROM_EMAIL"].filter(Boolean).join(", "),
    );
    return fail(503, "Online submissions are temporarily unavailable. Please try again later.");
  }

  const submissionId = /^[\w-]{8,64}$/.test(str(form.get("submissionId"), 64)) ? str(form.get("submissionId"), 64) : crypto.randomUUID();
  if (delivered.has(submissionId)) return NextResponse.json({ ok: true, id: submissionId });

  const { subject, html, text } = buildSubmissionEmail(payload, cards, { id: submissionId, receivedAt: new Date() });

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send(
      {
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        replyTo: payload.email,
        subject,
        html,
        text,
        attachments,
        tags: [{ name: "type", value: "card_submission" }],
      },
      { idempotencyKey: `submission-${submissionId}` },
    );
    if (error || !data?.id) {
      console.error("[submit] Resend rejected the email:", error);
      return fail(502, "We couldn't deliver your submission just now. Please try again in a moment.");
    }
    delivered.set(submissionId, Date.now());
    if (delivered.size > 5000) delivered.clear();
    return NextResponse.json({ ok: true, id: submissionId });
  } catch (err) {
    console.error("[submit] Email delivery failed:", err);
    return fail(502, "We couldn't deliver your submission just now. Please try again in a moment.");
  }
}
