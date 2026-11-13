# Grailz Co — Website

Three-page marketing and card-submission site for Grailz Co.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Motion and Lucide.

| Route           | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `/`             | Homepage — brand, categories, trust, process, CTA  |
| `/sell`         | Card submission form (emails Grailz Co via Resend) |
| `/how-it-works` | Process, submission guide and FAQ                  |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Submission email setup (required)

The Sell form posts to `src/app/api/submit/route.ts`, which validates everything
server-side and sends one email per submission through [Resend](https://resend.com),
with the photos attached. The visitor only sees the success screen after Resend
accepts the email. If configuration is missing, the API returns a 503 and the form
shows an error **without** clearing the visitor's details.

1. Create a Resend account and an API key.
2. Verify the sending domain in Resend (Domains → Add domain → add the DNS records).
3. Set these environment variables (locally in `.env.local`, and in your host's settings):

| Variable                    | Required | Example                                            |
| --------------------------- | -------- | -------------------------------------------------- |
| `GRAILZCO_SUBMISSION_EMAIL` | yes      | `submissions@grailzco.com` (comma-separate several) |
| `RESEND_API_KEY`            | yes      | `re_…` (server-only)                               |
| `RESEND_FROM_EMAIL`         | yes      | `Grailz Co Submissions <noreply@grailzco.com>`     |
| `NEXT_PUBLIC_SITE_URL`      | prod     | `https://grailzco.com`                             |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Public address shown in the footer                 |

The email's **Reply-To** is the collector's address, so Grailz Co can reply directly.

### Upload limits

Photos are resized in the browser (longest edge 1800 px, JPEG) before upload. Defaults:
12 photos per submission, 6 per card, 10 cards, originals up to 20 MB, **4 MB total upload**.
The 4 MB total keeps requests under Vercel's ~4.5 MB serverless body limit. If you host
somewhere with a larger limit, raise `NEXT_PUBLIC_SUBMISSION_MAX_TOTAL_MB` (Resend allows
up to 40 MB per email). For much larger uploads, switch to private object storage
(e.g. S3 with signed URLs) and email links instead of attachments.

### Abuse protection

- Hidden honeypot field and a minimum fill-time check
- In-memory per-IP rate limit (5 submissions / 10 min). This is per server instance;
  for stronger protection on serverless hosts add a shared limiter (e.g. Upstash) or a
  platform firewall rule.
- Server-side file signature checks (JPEG/PNG/WebP only), count and size limits
- Idempotency key per submission to prevent duplicate emails on retry

## Content and placeholders

| What                         | Where                                    |
| ---------------------------- | ---------------------------------------- |
| Site name, nav, Whatnot URL  | `src/config/site.ts`                     |
| All page copy, FAQ, tips     | `src/content/copy.ts`                    |
| Every image slot             | `src/content/images.ts`                  |
| Form options and limits      | `src/lib/submission.ts`                  |
| Submission email template    | `src/lib/email.ts`                       |

**Images:** every visual currently renders a labelled placeholder (abstract holographic
foil in a card or slab frame). To use real photography, add files to `public/images/` and
set `src` and `alt` for the slot in `src/content/images.ts`. Use only photography Grailz Co
owns or is licensed to use.

**Still needed from Grailz Co:**

- Official logo / brand assets (the current wordmark lives in `src/components/ui/Logo.tsx`)
- Card and slab photography for each image slot
- Whatnot show imagery or schedule (`src/components/home/Whatnot.tsx`)
- Public contact email (`NEXT_PUBLIC_CONTACT_EMAIL`)
- Open Graph image (`/public/og.jpg`, 1200×630; uncomment in `src/app/layout.tsx`)
- Final confirmation of FAQ answers against company policy
