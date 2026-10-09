import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { PropertyCard } from "@/components/property-card";
import { formatAvailabilityDate, properties, totalAvailableBeds, totalBeds } from "@/content/properties";

export const metadata: Metadata = {
  title: "Properties & Availability",
  description: "Current bed availability across Afford America's furnished supportive living homes in West Atlanta (30314).",
};

export default function PropertiesPage() {
  return (
    <>
      <PageHero eyebrow="Properties & availability" title="Furnished homes in West Atlanta">
        <p>
          Only {totalAvailableBeds()} of {totalBeds()} beds are open across our {properties.length} homes. Each home is
          small by design, so openings are limited. Bedrooms are shared by two residents and fully furnished,
          and Chappell Road and Chicamauga Avenue also have private rooms.
        </p>
      </PageHero>
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        <p className="mt-10 text-sm text-navy-700">
          Availability as of {formatAvailabilityDate()}. Call or send a referral to confirm a bed before discussing it
          with a client. When a home is full, ask to join its waitlist.
        </p>
      </Section>
    </>
  );
}
