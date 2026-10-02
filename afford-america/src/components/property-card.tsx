import Link from "next/link";
import type { Property } from "@/content/properties";
import { getMainImage } from "@/lib/property-images";
import { PropertyPhoto } from "./property-photo";

export function AvailabilityBadge({ available }: { available: number }) {
  const full = available === 0;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
        full ? "bg-sand text-ink" : "bg-pine-100 text-pine-800"
      }`}
    >
      <span aria-hidden className={`size-2 rounded-full ${full ? "bg-clay" : "bg-pine-600"}`} />
      {full ? "Waitlist only" : `${available} ${available === 1 ? "bed" : "beds"} available`}
    </span>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-pine-100 transition-shadow hover:shadow-md">
      <PropertyPhoto
        src={getMainImage(property.slug)}
        alt={`${property.name} exterior`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-4/3"
      />
      <div className="flex flex-1 flex-col p-6">
        <AvailabilityBadge available={property.availableBeds} />
        <h3 className="mt-3 font-display text-2xl font-semibold text-pine-900">
          <Link href={`/properties/${property.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {property.name}
          </Link>
        </h3>
        <p className="text-sm text-pine-700">
          {property.neighborhood}, Atlanta {property.zip}
        </p>
        <p className="mt-3 flex-1 text-base">{property.summary}</p>
        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-pine-100 pt-4 text-center text-sm">
          <div>
            <dt className="text-pine-700">Beds</dt>
            <dd className="font-semibold">{property.totalBeds}</dd>
          </div>
          <div>
            <dt className="text-pine-700">Bedrooms</dt>
            <dd className="font-semibold">{property.bedrooms}</dd>
          </div>
          <div>
            <dt className="text-pine-700">Baths</dt>
            <dd className="font-semibold">{property.bathrooms}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
