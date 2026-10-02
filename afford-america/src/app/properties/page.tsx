import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { PropertyCard } from "@/components/property-card";
import { properties, totalAvailableBeds } from "@/content/properties";

export const metadata: Metadata = {
  title: "Properties & Availability",
  description: "Current bed availability across Afford America's furnished supportive living homes in West Atlanta (30314).",
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Properties & availability" title="Furnished homes in West Atlanta">
        <p>
          {totalAvailableBeds()} beds currently open across {properties.length} homes. Every bedroom is shared by two
          residents, fully furnished, and covered by the same all-inclusive monthly package.
        </p>
      </PageHero>
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        <p className="mt-10 text-sm text-pine-700">
          Availability is updated regularly. Call or send a referral to confirm a bed before discussing it with a
          client.
        </p>
      </Section>
    </>
  );
}
