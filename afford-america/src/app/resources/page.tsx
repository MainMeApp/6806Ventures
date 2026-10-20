import type { Metadata } from "next";
import { ButtonLink, Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { notProvided, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Community Resources",
  description:
    "Free and low-cost Atlanta-area services from other organizations: crisis lines, 211, veterans, seniors, benefits, food, health care, and work support.",
};

type Contact = { label: string; href: string; external?: boolean };

type Resource = {
  name: string;
  description: string;
  contacts: Contact[];
};

type ResourceSection = {
  eyebrow: string;
  title: string;
  intro?: string;
  resources: Resource[];
};

const sections: ResourceSection[] = [
  {
    eyebrow: "Crisis help",
    title: "If you need help now",
    resources: [
      {
        name: "988 Suicide & Crisis Lifeline",
        description:
          "Free, confidential support by call, text, or chat, 24 hours a day, 7 days a week. Veterans: press 1.",
        contacts: [
          { label: "Call or text 988", href: "tel:988" },
          { label: "988lifeline.org", href: "https://988lifeline.org/", external: true },
        ],
      },
      {
        name: "Georgia Crisis & Access Line",
        description:
          "Georgia's statewide 24/7 line for mental health, substance use, and developmental disability crises.",
        contacts: [
          { label: "1-800-715-4225", href: "tel:+18007154225" },
          {
            label: "dbhdd.georgia.gov",
            href: "https://dbhdd.georgia.gov/crisis-system-georgia",
            external: true,
          },
        ],
      },
      {
        name: "911",
        description: "For life-threatening emergencies.",
        contacts: [{ label: "Call 911", href: "tel:911" }],
      },
    ],
  },
  {
    eyebrow: "Local referrals",
    title: "Start here: one call for local help",
    intro:
      "Not sure where to begin? Start with 211. One free, confidential call connects you to local services of all kinds.",
    resources: [
      {
        name: "United Way 211",
        description:
          "Dial 211 for free, confidential referrals to local services: food, housing, health care, and more.",
        contacts: [
          { label: "Dial 211", href: "tel:211" },
          { label: "211.org", href: "https://211.org/", external: true },
        ],
      },
      {
        name: "Partners for HOME (Atlanta Continuum of Care coordinated entry)",
        description:
          "The front door to Atlanta's homeless response system. Start by calling 211 for a coordinated-entry assessment.",
        contacts: [
          {
            label: "partnersforhome.org",
            href: "https://partnersforhome.org/help/",
            external: true,
          },
        ],
      },
    ],
  },
  {
    eyebrow: "Veterans",
    title: "Veterans",
    resources: [
      {
        name: "VA National Call Center for Homeless Veterans",
        description:
          "Free, confidential help for homeless and at-risk veterans, 24 hours a day, 7 days a week.",
        contacts: [
          { label: "1-877-424-3838", href: "tel:+18774243838" },
          {
            label: "department.va.gov/homeless",
            href: "https://department.va.gov/homeless/",
            external: true,
          },
        ],
      },
      {
        name: "Veterans Crisis Line",
        description:
          "Free, confidential 24/7 support for veterans and those who love them. Dial 988 then press 1, or text 838255.",
        contacts: [
          { label: "Dial 988, press 1", href: "tel:988" },
          { label: "Text 838255", href: "sms:838255" },
          {
            label: "veteranscrisisline.net",
            href: "https://www.veteranscrisisline.net/",
            external: true,
          },
        ],
      },
      {
        name: "HUD-VASH",
        description:
          "HUD housing vouchers paired with VA case management for homeless veterans. Ask for the HUD-VASH team at the Atlanta VA.",
        contacts: [
          {
            label: "department.va.gov/homeless/hud-vash",
            href: "https://department.va.gov/homeless/hud-vash/",
            external: true,
          },
        ],
      },
    ],
  },
  {
    eyebrow: "Seniors & aging",
    title: "Seniors & aging",
    resources: [
      {
        name: "Empowerline",
        description:
          "The Atlanta Regional Commission's free resource for aging, disability, and caregiver needs across metro Atlanta.",
        contacts: [
          { label: "(404) 463-3333", href: "tel:+14044633333" },
          { label: "empowerline.org", href: "https://empowerline.org/", external: true },
        ],
      },
      {
        name: "Fulton County Senior Services / STARline",
        description:
          "County programs for older adults, including the STARline information and referral line.",
        contacts: [
          { label: "404-613-6000", href: "tel:+14046136000" },
          {
            label: "fultoncountyga.gov",
            href: "https://www.fultoncountyga.gov/inside-fulton-county/fulton-county-departments/senior-services",
            external: true,
          },
        ],
      },
    ],
  },
  {
    eyebrow: "Benefits & income",
    title: "Benefits & income",
    resources: [
      {
        name: "Georgia Gateway",
        description: "Apply online for SNAP (food stamps), Medicaid, and TANF cash assistance.",
        contacts: [
          { label: "gateway.ga.gov", href: "https://gateway.ga.gov/", external: true },
        ],
      },
      {
        name: "Social Security (SSI/SSDI)",
        description:
          "Apply for retirement, disability (SSDI), and Supplemental Security Income (SSI) benefits.",
        contacts: [
          { label: "1-800-772-1213", href: "tel:+18007721213" },
          { label: "ssa.gov", href: "https://www.ssa.gov/", external: true },
        ],
      },
    ],
  },
  {
    eyebrow: "Food",
    title: "Food",
    resources: [
      {
        name: "Atlanta Community Food Bank",
        description: "Use their food pantry map to find free groceries near you.",
        contacts: [
          { label: "404-892-3333", href: "tel:+14048923333" },
          { label: "acfb.org", href: "https://www.acfb.org/", external: true },
        ],
      },
    ],
  },
  {
    eyebrow: "Health care",
    title: "Health care",
    resources: [
      {
        name: "Mercy Care Atlanta",
        description:
          "Medical, dental, and behavioral health care for people in need, regardless of ability to pay.",
        contacts: [
          { label: "(678) 843-8600", href: "tel:+16788438600" },
          { label: "mercyatlanta.org", href: "https://mercyatlanta.org/", external: true },
        ],
      },
    ],
  },
  {
    eyebrow: "Work & income support",
    title: "Work & income support",
    resources: [
      {
        name: "Goodwill of North Georgia career centers",
        description:
          "Free job-search help, career coaching, and training at career centers across North Georgia.",
        contacts: [
          { label: "goodwillng.org", href: "https://goodwillng.org/", external: true },
        ],
      },
      {
        name: "Georgia Department of Labor",
        description: "Unemployment benefits, job-search help, and career centers across Georgia.",
        contacts: [
          { label: "dol.georgia.gov", href: "https://dol.georgia.gov/", external: true },
        ],
      },
    ],
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
      <h3 className="font-display text-xl font-semibold text-navy-900">{resource.name}</h3>
      <p className="mt-2 text-ink/80">{resource.description}</p>
      <div className="mt-4 space-y-1.5">
        {resource.contacts.map((contact) =>
          contact.external ? (
            <p key={contact.href}>
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-800"
              >
                {contact.label}
              </a>
            </p>
          ) : (
            <p key={contact.href}>
              <a
                href={contact.href}
                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
              >
                {contact.label}
              </a>
            </p>
          ),
        )}
      </div>
    </article>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="Community resources" title="Community resources in Atlanta">
        <p>
          A directory of other Atlanta organizations offering free or low-cost services, from crisis
          lines to food, health care, and job help, for the case managers and families who visit our
          site.
        </p>
      </PageHero>

      <Section>
        <div className="rounded-2xl border border-navy-200 bg-frost p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-navy-900">
            Please read before you browse
          </h2>
          <div className="mt-3 space-y-3 text-ink/90">
            <p>
              <strong className="font-semibold">
                This page lists services provided by other organizations.
              </strong>{" "}
              These are independent Atlanta-area nonprofits and agencies, not Afford America
              programs. We do not control their services, hours, or availability.
            </p>
            <p>
              <strong className="font-semibold">
                Afford America provides housing only and does not help pay rent.
              </strong>{" "}
              Placement at Afford America requires 100% of the monthly cost to be covered by a
              voucher, benefits, pension, or sponsor before move-in.
            </p>
          </div>
        </div>
      </Section>

      {sections.map((section, index) => (
        <Section key={section.title} className={index % 2 === 1 ? "bg-mist/60" : ""}>
          <Eyebrow>{section.eyebrow}</Eyebrow>
          <H2>{section.title}</H2>
          {section.intro && <p className="mt-4 max-w-2xl text-lg text-ink/80">{section.intro}</p>}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.resources.map((resource) => (
              <ResourceCard key={resource.name} resource={resource} />
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <div className="rounded-3xl bg-navy-900 px-6 py-12 sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
            Afford America housing
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Looking for supportive independent living with full funding in place?
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            Afford America provides housing only. Placement requires 100% of the monthly cost to be
            covered by a voucher, benefits, pension, or sponsor before move-in. If that describes
            you, start a referral or reach out. We would love to show you around.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/refer" variant="accent">
              Make a Referral
            </ButtonLink>
            <ButtonLink href="/contact" variant="light">
              Tour &amp; Contact
            </ButtonLink>
          </div>
          <p className="mt-8 text-navy-100">
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-white hover:underline"
            >
              {site.email}
            </a>
            {" | "}
            <a href="tel:+16782577654" className="font-semibold text-white hover:underline">
              (678) 257-7654
            </a>
          </p>
          <p className="mt-6 text-sm text-navy-200">{notProvided}</p>
        </div>
      </Section>
    </>
  );
}
