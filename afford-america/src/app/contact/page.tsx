import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui";
import { properties } from "@/content/properties";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Tour & Contact",
  description: "Schedule an in-person or video tour of an Afford America home, or contact our placement team.",
};

const TOPICS = new Set(["tour", "availability", "waitlist", "partnership", "other"]);

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { property, topic } = await searchParams;
  const defaultProperty = typeof property === "string" && properties.some((p) => p.slug === property) ? property : undefined;
  const defaultTopic = typeof topic === "string" && TOPICS.has(topic) ? topic : defaultProperty ? "tour" : undefined;

  return (
    <>
      <PageHero eyebrow="Tour & contact" title="See a home or talk with our team">
        <p>Tours are available in person or by video, for prospective residents, families, and case managers.</p>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ContactForm
            defaultProperty={defaultProperty}
            defaultTopic={defaultTopic}
            propertyOptions={properties.map((p) => ({ value: p.slug, label: p.name }))}
          />
          <aside className="h-fit space-y-6 rounded-3xl bg-pine-900 p-8 text-pine-100">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pine-200">Call</p>
              <a href={site.phoneHref} className="font-display text-2xl font-semibold text-white">
                {site.phone}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pine-200">Email</p>
              <a href={`mailto:${site.email}`} className="break-all text-lg text-white">
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pine-200">Hours</p>
              <p>{site.hours}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-pine-200">Area</p>
              <p>{site.serviceArea}</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
