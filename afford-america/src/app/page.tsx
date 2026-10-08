import { ButtonLink, Check, Eyebrow, H2, Section } from "@/components/ui";
import { PropertyCard } from "@/components/property-card";
import { audiences, foodNote, fundingRequirement, fundingSources, monthlyPackage, site } from "@/content/site";
import { areaHighlights, formatAvailabilityDate, properties, totalAvailableBeds, totalBeds } from "@/content/properties";
import { GetAroundList } from "@/components/get-around";

export default function Home() {
  const available = totalAvailableBeds();
  const total = totalBeds();

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy-900 px-4 text-white sm:px-6">
        <div aria-hidden className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-navy-700/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 py-20 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-navy-200">
              West Atlanta &middot; 30314
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-6xl">
              A stable, furnished home. One simple monthly price.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-navy-100 sm:text-xl">
              {site.brand} offers all-inclusive, non-clinical supportive independent living for adults 55+,
              veterans, and independent adults who thrive in a structured home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/refer" variant="accent">Make a Referral</ButtonLink>
              <ButtonLink href="/contact" variant="light">
                Schedule a Tour
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 text-ink shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{monthlyPackage.label}</p>
            <p className="mt-2 font-display text-5xl font-semibold text-navy-900">
              ${monthlyPackage.price.toLocaleString("en-US")}
              <span className="text-lg font-normal text-navy-700"> / month</span>
            </p>
            <p className="mt-1 text-sm text-navy-700">{monthlyPackage.occupancy}</p>
            <ul className="mt-6 space-y-2">
              {monthlyPackage.includes.map((item) => (
                <li key={item.title} className="flex gap-2">
                  <Check />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-navy-700">{foodNote}</p>
            <div className="mt-6 rounded-xl bg-navy-50 px-4 py-3">
              <p className="font-semibold text-navy-900">
                {available === 0
                  ? "All homes are full right now. Join the waitlist."
                  : `Only ${available} of ${total} beds open`}
              </p>
              <p className="text-sm text-navy-700">Availability as of {formatAvailabilityDate()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Who we serve */}
      <Section>
        <Eyebrow>Who we serve</Eyebrow>
        <H2>Built for the people case managers are trying to place</H2>
        <p className="mt-4 max-w-3xl text-lg">
          Most of our residents come to us through a professional who knows them: a VA social worker, a hospital
          discharge planner, a housing coordinator. We make that placement fast and predictable.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-7 ring-1 ring-navy-100">
              <h3 className="font-display text-2xl font-semibold text-navy-900">{a.title}</h3>
              <p className="mt-2">{a.detail}</p>
              <p className="mt-4 text-sm text-navy-700">
                <span className="font-semibold">Referred by: </span>
                {a.who}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Properties */}
      <Section className="bg-frost/60">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Our homes</Eyebrow>
            <H2>Three homes in Hunter Hills and Mozley Park</H2>
          </div>
          <ButtonLink href="/properties" variant="secondary">
            View all properties
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
      </Section>

      {/* Location */}
      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div>
            <Eyebrow>The neighborhood</Eyebrow>
            <H2>Connected to the Westside, the Beltline, and MARTA</H2>
            <p className="mt-4 text-lg">
              Our homes sit in Hunter Hills and Mozley Park, two historic West Atlanta neighborhoods about three miles
              from Downtown. Residents can get to appointments, services, and family across the city without a car.
            </p>
          </div>
          <GetAroundList items={areaHighlights} />
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <Eyebrow>How placement works</Eyebrow>
        <H2>From referral to move-in, usually within days</H2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Send a referral", "Submit the short online form or email us. No medical records needed."],
            ["Quick screening call", "We confirm fit, funding, and move-in timing with you within one business day."],
            ["Tour the home", "In person or by video, with the client, their case manager, or both."],
            ["Move in", "The room is furnished and utilities are on. The resident brings personal clothing."],
          ].map(([title, body], i) => (
            <li key={title} className="rounded-2xl bg-white p-6 ring-1 ring-navy-100">
              <span className="grid size-10 place-items-center rounded-full bg-navy-700 font-display text-lg font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-1 text-base">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Funding */}
      <Section className="bg-navy-50">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Funding accepted</Eyebrow>
            <H2>Works with the income your clients already have</H2>
            <p className="mt-4 text-lg">
              {fundingRequirement} One flat ${monthlyPackage.price.toLocaleString("en-US")} package, with no surprise
              bills for utilities or internet.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {fundingSources.map((f) => (
              <li key={f} className="rounded-full bg-white px-5 py-2.5 font-medium text-navy-900 ring-1 ring-navy-200">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="rounded-3xl bg-navy-800 px-8 py-12 text-white sm:px-12">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Have a client who needs housing now?</h2>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Send a referral in about three minutes, or email {site.email} to reach a placement coordinator.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/refer" variant="light">
              Start a Referral
            </ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 font-semibold hover:bg-white/10"
            >
              Email {site.email}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
