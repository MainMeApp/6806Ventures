import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink, Check, Section } from "@/components/ui";
import { AvailabilityBadge } from "@/components/property-card";
import { PropertyPhoto } from "@/components/property-photo";
import { getProperty, properties } from "@/content/properties";
import { monthlyPackage, notProvided } from "@/content/site";
import { getGalleryImages, getMainImage } from "@/lib/property-images";

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  const image = getMainImage(slug);
  return {
    title: property.name,
    description: property.summary,
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const main = getMainImage(slug);
  const gallery = getGalleryImages(slug);

  return (
    <>
      <div className="bg-pine-900 px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/properties" className="text-sm font-medium text-pine-200 hover:text-white">
            &larr; All properties
          </Link>
          <PropertyPhoto
            src={main}
            alt={`${property.name} exterior`}
            sizes="(min-width: 1152px) 1152px, 100vw"
            preload
            className="mt-4 aspect-video rounded-3xl sm:aspect-[21/9]"
          />
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <AvailabilityBadge available={property.availableBeds} />
            <h1 className="mt-3 font-display text-4xl font-semibold text-pine-900 sm:text-5xl">{property.name}</h1>
            <p className="mt-1 text-lg text-pine-700">
              {property.street ? `${property.street}, ` : ""}
              {property.neighborhood}, Atlanta, GA {property.zip}
            </p>
            <p className="mt-6 text-lg">{property.summary}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Total beds", property.totalBeds],
                ["Open now", property.availableBeds],
                ["Bedrooms", property.bedrooms],
                ["Bathrooms", property.bathrooms],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 text-center ring-1 ring-pine-100">
                  <dt className="text-sm text-pine-700">{label}</dt>
                  <dd className="font-display text-3xl font-semibold text-pine-900">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-2xl font-semibold text-pine-900">Home features</h2>
                <ul className="mt-4 space-y-2">
                  {property.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-pine-900">Nearby</h2>
                <ul className="mt-4 space-y-2">
                  {property.nearby.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-semibold text-pine-900">Photos</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gallery.map((src, i) => (
                    <PropertyPhoto
                      key={src}
                      src={src}
                      alt={`${property.name} photo ${i + 2}`}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="aspect-4/3 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-white p-7 ring-1 ring-pine-100 lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-widest text-clay">All-inclusive</p>
            <p className="mt-1 font-display text-4xl font-semibold text-pine-900">
              ${monthlyPackage.price.toLocaleString("en-US")}
              <span className="text-base font-normal text-pine-700"> / month</span>
            </p>
            <ul className="mt-5 space-y-2 text-base">
              {monthlyPackage.includes.map((i) => (
                <li key={i.title} className="flex gap-2">
                  <Check />
                  {i.title}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href={`/refer?property=${property.slug}`}>Refer a client here</ButtonLink>
              <ButtonLink href={`/contact?property=${property.slug}`} variant="secondary">
                Request a tour
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-pine-700">{notProvided}</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
