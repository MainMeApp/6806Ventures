# Afford America Community Living website

Marketing site and placement referral portal for Afford America LLC's non-clinical supportive independent living homes in West Atlanta (30314). Built with Next.js 16 (App Router) and Tailwind CSS 4.

This app is self-contained in `afford-america/` and is independent of the SmartCare app at the repo root.

## Run it

```bash
cd afford-america
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: package, who we serve, homes, placement steps, funding |
| `/properties` | All homes with live bed availability |
| `/properties/[slug]` | One home: main photo, gallery, features, refer/tour buttons |
| `/living-here` | What residents get and what to bring |
| `/partners` | For case managers: resident criteria, referral pathways, FAQ |
| `/refer` | Placement referral portal (form) |
| `/contact` | Tour request and general contact (form) |

## Adding property photos

1. Put photos in `public/properties/<slug>/`, e.g. `public/properties/sharon-street/`. The slugs are `sharon-street`, `chappell-road`, and `chicamauga-avenue`.
2. Name the first photo `main.jpg` (`.jpeg`, `.png`, `.webp`, `.avif` also work). It shows on the property card and opens the photo slideshow on the property page.
3. Every other image in the folder joins the slideshow after it, in filename order, so prefix them with numbers: `01-shared-bedroom.jpg`, `02-kitchen.jpg`. The words after the number become the photo's description for screen readers.
4. Rebuild or redeploy. Until a photo exists, a "Photo coming soon" placeholder is shown.

Landscape photos around 1600px wide work best. Next.js resizes and compresses them automatically.

## Editing content

- Business details, package, funding sources, resident criteria: `src/content/site.ts`
- Properties (names, beds available, features): `src/content/properties.ts`

`properties.ts` holds the three real homes. Bed, bedroom, and bathroom counts are still placeholders (marked `TODO`). House numbers are hidden on the public site unless `SHOW_HOUSE_NUMBERS` is set to `true`. The site has no phone number by design; all contact goes to the email in `site.ts`.

## Form submissions

Two forms send email:

- **Referral portal** (`/refer`): emails you every referral, and thanks the referrer.
- **Tour & contact** (`/contact`): "Book a tour" collects tour type (in person or video), date, and time of day; other topics (availability, waitlist, partnerships) send a general inquiry.

Every notification is a formatted email with all the details. Replying to it goes straight to the person who submitted. Forms are validated on the server, keep the visitor's answers if something needs fixing, and include a honeypot spam trap.

### Setup (once)

1. In [Resend](https://resend.com), add and verify the domain `affordamerica.org` (add the DNS records Resend shows at your domain registrar).
2. Create a Resend API key with sending access.
3. In the Vercel project, set these environment variables and redeploy:

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | the key from step 2 |
| `SUBMISSIONS_FROM_EMAIL` | `Afford America Community Living <noreply@affordamerica.org>` |
| `SUBMISSIONS_TO_EMAIL` | where notifications go; defaults to `info@affordamerica.org` (comma-separate for several) |
| `SEND_CONFIRMATION_EMAILS` | `true` to email visitors a confirmation (only after the domain is verified) |

Without `RESEND_API_KEY`, a live site shows visitors an error asking them to email you directly, so no submission is silently lost. Locally, submissions are saved to `.data/submissions.jsonl` (gitignored) for testing.

The referral form deliberately collects client initials only and asks referrers not to send diagnoses, DOBs, SSNs, or records.

## Other environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap |
| `ALLOW_INDEXING` | Set to `true` at launch. Until then `robots.txt` blocks search engines. |

## Deploying on Vercel

Create a project from this repo and set **Root Directory** to `afford-america`.
