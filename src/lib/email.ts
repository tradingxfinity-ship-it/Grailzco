import "server-only";
import type { CardEntry, SubmissionPayload } from "@/lib/submission";

export type CardWithPhotos = CardEntry & { photos: string[] };

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:6px 16px 6px 0;color:#6b7f9f;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;color:#000e28;font-size:14px;vertical-align:top">${esc(value).replace(/\n/g, "<br>")}</td></tr>`
    : "";

export function buildSubmissionEmail(p: SubmissionPayload, cards: CardWithPhotos[], meta: { id: string; receivedAt: Date }) {
  const totalPhotos = cards.reduce((n, c) => n + c.photos.length, 0);
  const subject = `New card submission — ${p.fullName} (${cards.length} card${cards.length === 1 ? "" : "s"})`;
  const when = meta.receivedAt.toUTCString();

  const cardBlocks = cards
    .map(
      (c, i) => `
      <tr><td style="padding:0 0 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dde4ee;border-radius:12px">
          <tr><td style="padding:16px 20px;border-bottom:1px solid #dde4ee;background:#f6f8fb;border-radius:12px 12px 0 0">
            <span style="font-family:monospace;font-size:12px;color:#13c99c;font-weight:bold">CARD ${String(i + 1).padStart(2, "0")}</span>
            <div style="font-size:17px;font-weight:bold;color:#000e28;margin-top:4px">${esc(c.name)}</div>
          </td></tr>
          <tr><td style="padding:12px 20px">
            <table role="presentation" cellpadding="0" cellspacing="0">
              ${row("Category", c.category)}
              ${row("Set / release", c.set)}
              ${row("Condition", c.condition)}
              ${row("Grading", c.grading)}
              ${row("Quantity", c.quantity)}
              ${row("Asking price", c.askingPrice)}
              ${row("Notes", c.notes)}
              ${row("Photos", c.photos.length ? c.photos.join(", ") : "None attached")}
            </table>
          </td></tr>
        </table>
      </td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#eef2f6;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#000e28;padding:28px 28px 24px">
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">Grailz<span style="color:#37f5c7">Co</span></div>
        <div style="margin-top:14px;font-size:24px;font-weight:bold;color:#ffffff">New card submission</div>
        <div style="margin-top:6px;font-size:13px;color:#9fb0cb">${cards.length} card${cards.length === 1 ? "" : "s"} · ${totalPhotos} photo${totalPhotos === 1 ? "" : "s"} attached · ${esc(when)}</div>
      </td></tr>
      <tr><td style="padding:24px 28px 8px">
        <div style="font-family:monospace;font-size:12px;color:#6b7f9f;letter-spacing:1px">COLLECTOR</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px">
          ${row("Name", p.fullName)}
          ${row("Email", p.email)}
          ${row("Phone", p.phone || "Not provided")}
        </table>
        <p style="margin:12px 0 0;font-size:13px;color:#6b7f9f">Reply to this email to respond to the collector directly.</p>
      </td></tr>
      <tr><td style="padding:16px 28px 4px">
        <div style="font-family:monospace;font-size:12px;color:#6b7f9f;letter-spacing:1px;margin-bottom:12px">CARDS</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cardBlocks}</table>
      </td></tr>
      <tr><td style="padding:8px 28px 28px;font-size:12px;color:#6b7f9f">
        The collector confirmed their information may be used to review and respond to this submission.<br>
        Submission ID: ${esc(meta.id)}
      </td></tr>
    </table>
  </td></tr></table></body></html>`;

  const text = [
    "NEW CARD SUBMISSION — Grailz Co",
    `Received: ${when}`,
    `Submission ID: ${meta.id}`,
    "",
    "COLLECTOR",
    `Name: ${p.fullName}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone || "Not provided"}`,
    "",
    ...cards.flatMap((c, i) => [
      `CARD ${i + 1}: ${c.name}`,
      c.category ? `  Category: ${c.category}` : null,
      c.set ? `  Set / release: ${c.set}` : null,
      `  Condition: ${c.condition}`,
      `  Grading: ${c.grading}`,
      `  Quantity: ${c.quantity}`,
      c.askingPrice ? `  Asking price: ${c.askingPrice}` : null,
      c.notes ? `  Notes: ${c.notes}` : null,
      `  Photos: ${c.photos.length ? c.photos.join(", ") : "None"}`,
      "",
    ]),
    "The collector confirmed consent for their information to be used to review and respond.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return { subject, html, text };
}
