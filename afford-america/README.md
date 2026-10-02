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

1. Put photos in `public/properties/<slug>/`, e.g. `public/properties/residence-one/`.
2. Name the main photo `main.jpg` (`.jpeg`, `.png`, `.webp`, `.avif` also work). It is used on the cards and as the hero on the property page.
3. Any other images in the same folder appear as a gallery on that property's page, sorted by filename.
4. Rebuild or redeploy. Until a photo exists, a "Photo coming soon" placeholder is shown.

Landscape photos around 1600px wide work best. Next.js resizes and compresses them automatically.

## Editing content

- Business details, package, funding sources, resident criteria: `src/content/site.ts`
- Properties (names, beds available, features): `src/content/properties.ts`

Both files mark placeholders with `TODO`. Phone, email, and every property entry are placeholders today.

## Form submissions

Referral and tour forms are validated on the server and include a honeypot spam trap.

- **Local testing (default):** submissions are printed to the server log and appended to `.data/submissions.jsonl` (gitignored).
- **Email delivery:** set these environment variables to send each submission as a plain-text email through [Resend](https://resend.com):

| Variable | Example |
| --- | --- |
| `RESEND_API_KEY` | `re_...` |
| `SUBMISSIONS_TO_EMAIL` | `placements@yourdomain.com` (comma-separate for several) |
| `SUBMISSIONS_FROM_EMAIL` | `Afford America <noreply@yourdomain.com>` (domain must be verified in Resend) |

On a serverless host without email configured, submissions only reach the logs, so set these before sharing the referral link.

The referral form deliberately collects client initials only and asks referrers not to send diagnoses, DOBs, SSNs, or records.

## Other environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap |
| `ALLOW_INDEXING` | Set to `true` at launch. Until then `robots.txt` blocks search engines. |

## Deploying on Vercel

Create a project from this repo and set **Root Directory** to `afford-america`.
