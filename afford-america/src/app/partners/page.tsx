import type { Metadata } from "next";
import { ButtonLink, Check, Cross, Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { audiences, fundingSources, monthlyPackage, notProvided, residentCriteria, site } from "@/content/site";

export const metadata: Metadata = {
  title: "For Referral Partners",
  description:
    "Information for case managers, social workers, discharge planners, and housing coordinators referring clients to Afford America.",
};

const faqs = [
  {
    q: "How fast can a client move in?",
    a: "When a bed is open and funding is confirmed, move-in can happen within days. Rooms are furnished and utilities are already on.",
  },
  {
    q: "Do you provide medical or personal care?",
    a: notProvided,
  },
  {
    q: "Can home health or mobile care teams visit?",
    a: "Yes. We work alongside visiting home health aides, mobile care teams, ACT teams, and outpatient providers chosen by the resident.",
  },
  {
    q: "How does the medication dispenser work?",
    a: "Residents can rent an automated dispenser that reminds them and releases their own doses on schedule. Residents remain responsible for their medications; staff do not handle or administer them.",
  },
  {
    q: "How is rent paid?",
    a: "Through a housing voucher, direct deposit of benefits, or direct pay. We can coordinate with HUD-VASH, GHVP, and representative payees.",
  },
  {
    q: "Can we set up a standing referral agreement?",
    a: "Yes. We welcome direct referral agreements with VA, ADRC, DBHDD, and hospital social work teams, including priority notice when beds open.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero eyebrow="For referral partners" title="A reliable placement option for your clients">
        <p>
          For HUD-VASH specialists, Empowerline counselors, DBHDD housing coordinators, and hospital discharge teams
          across Metro Atlanta.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/refer">Submit a Referral</ButtonLink>
          <ButtonLink href="/contact?topic=partnership" variant="light">
            Discuss a Referral Agreement
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Eyebrow>Resident profile</Eyebrow>
        <H2>Who is a good fit</H2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-7 ring-1 ring-pine-100">
            <h3 className="text-lg font-semibold text-pine-900">Good fit</h3>
            <ul className="mt-4 space-y-3">
              {residentCriteria.goodFit.map((c) => (
                <li key={c} className="flex gap-2">
                  <Check />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-7 ring-1 ring-pine-100">
            <h3 className="text-lg font-semibold text-pine-900">Better served elsewhere</h3>
            <ul className="mt-4 space-y-3">
              {residentCriteria.notAFit.map((c) => (
                <li key={c} className="flex gap-2">
                  <Cross />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-pine-700">
              Not sure? Call us at {site.phone}. We would rather talk it through than turn someone away on paper.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-sand/60">
        <Eyebrow>Programs we work with</Eyebrow>
        <H2>Referral pathways</H2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-7 ring-1 ring-pine-100">
              <h3 className="font-display text-xl font-semibold text-pine-900">{a.title}</h3>
              <p className="mt-2 text-sm text-pine-700">{a.who}</p>
              <p className="mt-3">{a.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Package</Eyebrow>
            <H2>${monthlyPackage.price.toLocaleString("en-US")} per month, all-inclusive</H2>
            <ul className="mt-6 space-y-4">
              {monthlyPackage.includes.map((i) => (
                <li key={i.title} className="flex gap-3">
                  <Check />
                  <span>
                    <span className="font-semibold">{i.title}.</span> {i.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Funding</Eyebrow>
            <H2>Accepted payment sources</H2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {fundingSources.map((f) => (
                <li key={f} className="rounded-full bg-pine-50 px-5 py-2.5 font-medium text-pine-900 ring-1 ring-pine-200">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-pine-50">
        <Eyebrow>Questions</Eyebrow>
        <H2>Frequently asked by case managers</H2>
        <div className="mt-8 divide-y divide-pine-200 rounded-2xl bg-white ring-1 ring-pine-100">
          {faqs.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="cursor-pointer list-none text-lg font-semibold text-pine-900">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span aria-hidden className="text-2xl text-clay transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
