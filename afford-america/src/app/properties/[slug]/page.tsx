import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ButtonLink, Check, Section } from "@/components/ui";
import { AvailabilityBadge, OccupancyBar } from "@/components/property-card";
import { PropertyPhoto } from "@/components/property-photo";
import { PhotoCarousel } from "@/components/photo-carousel";
import { displayAddress, formatAvailabilityDate, getProperty, properties } from "@/content/properties";
import { GetAroundList } from "@/components/get-around";
import { foodNote, monthlyPackage, notProvided } from "@/content/site";
import { getGalleryImages, getMainImage, mainImageAlt, photoLabel } from "@/lib/property-images";

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return {};
  // Link previews use the site-wide logo card (app/opengraph-image.png).
  return {
    title: property.name,
    description: property.summary,
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  // Main photo first, then the rest in filename order.
  const main = getMainImage(slug);
  const photos = [
    ...(main ? [{ src: main, alt: mainImageAlt(main, property.name, property.mainPhotoAlt) }] : []),
    ...getGalleryImages(slug).map((src) => ({ src, alt: `${property.name}: ${photoLabel(src)}` })),
  ];

  return (
    <>
      <div className="bg-navy-900 px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/properties" className="text-sm font-medium text-navy-200 hover:text-white">
            &larr; All properties
          </Link>
          <div className="mt-4">
            {photos.length > 0 ? (
              <PhotoCarousel photos={photos} label={`Photos of ${property.name}`} />
            ) : (
              <PropertyPhoto
                src={null}
                alt={property.name}
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="aspect-4/3 rounded-3xl sm:aspect-[2/1]"
              />
            )}
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <AvailabilityBadge available={property.availableBeds} />
            <h1 className="mt-3 font-display text-4xl font-semibold text-navy-900 sm:text-5xl">{property.name}</h1>
            <p className="mt-1 text-lg text-navy-700">
              {displayAddress(property)}, {property.neighborhood}, Atlanta, GA {property.zip}
            </p>
            <p className="mt-6 text-lg">{property.summary}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Total beds", property.totalBeds],
                ["Open now", property.availableBeds],
                ["Bedrooms", property.bedrooms],
                ["Bathrooms", property.bathrooms],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 text-center ring-1 ring-navy-100">
                  <dt className="text-sm text-navy-700">{label}</dt>
                  <dd className="font-display text-3xl font-semibold text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>

            {property.privateRoom && (
              <div className="mt-10 rounded-3xl bg-navy-800 p-7 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">Also available</p>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4">
                  <h2 className="font-display text-2xl font-semibold">Private room</h2>
                  <p className="font-display text-2xl font-semibold">
                    ${property.privateRoom.price.toLocaleString("en-US")}
                    <span className="text-base font-normal text-navy-100"> / month, same package as shared rooms</span>
                  </p>
                </div>
                <p className="mt-2 text-navy-100">{property.privateRoom.summary}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {property.privateRoom.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-5 shrink-0 text-teal-300" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <ButtonLink href={`/refer?property=${property.slug}:private`} variant="accent">
                    Refer a client for this room
                  </ButtonLink>
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Getting around</h2>
              <p className="mt-1 text-navy-700">Transit, trails, and parks near {property.streetName}.</p>
              <div className="mt-5">
                <GetAroundList items={property.getAround} />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Included in this home</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {property.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <aside className="h-fit rounded-3xl bg-white p-7 ring-1 ring-navy-100 lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">All-inclusive</p>
            <p className="mt-1 font-display text-4xl font-semibold text-navy-900">
              ${monthlyPackage.price.toLocaleString("en-US")}
              <span className="text-base font-normal text-navy-700"> / month</span>
            </p>
            <ul className="mt-5 space-y-2 text-base">
              {monthlyPackage.includes.map((i) => (
                <li key={i.title} className="flex gap-2">
                  <Check />
                  {i.title}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-navy-700">{foodNote}</p>
            <div className="mt-6">
              <OccupancyBar total={property.totalBeds} available={property.availableBeds} />
              <p className="mt-1 text-xs text-navy-700">As of {formatAvailabilityDate()}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {property.availableBeds === 0 ? (
                <ButtonLink href={`/contact?property=${property.slug}&topic=waitlist`}>Join the waitlist</ButtonLink>
              ) : (
                <ButtonLink href={`/refer?property=${property.slug}`}>Refer a client here</ButtonLink>
              )}
              <ButtonLink href={`/contact?property=${property.slug}`} variant="secondary">
                Request a tour
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-navy-700">{notProvided}</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
