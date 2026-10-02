import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { properties } from "@/content/properties";
import { site } from "@/content/site";
import { ReferralForm } from "./referral-form";

export const metadata: Metadata = {
  title: "Placement Referral Portal",
  description: "Submit a housing placement referral to Afford America Community Living.",
};

export default async function ReferPage({ searchParams }: PageProps<"/refer">) {
  const { property } = await searchParams;
  const defaultProperty = typeof property === "string" && properties.some((p) => p.slug === property) ? property : undefined;

  return (
    <>
      <PageHero eyebrow="Placement referral portal" title="Refer a client">
        <p>
          For case managers, social workers, discharge planners, and housing coordinators. Takes about three minutes.
          We respond within one business day. Urgent placement? Email{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-white underline">
            {site.email}
          </a>{" "}
          with &ldquo;Urgent&rdquo; in the subject line.
        </p>
      </PageHero>
      <Section>
        <div className="mx-auto max-w-3xl">
          <ReferralForm
            defaultProperty={defaultProperty}
            propertyOptions={properties.map((p) => ({
              value: p.slug,
              label: `${p.name} (${p.availableBeds === 0 ? "full, waitlist" : `${p.availableBeds} open`})`,
            }))}
          />
        </div>
      </Section>
    </>
  );
}
