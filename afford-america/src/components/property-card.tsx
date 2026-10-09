import Link from "next/link";
import { displayAddress, LOW_AVAILABILITY, type Property } from "@/content/properties";
import { getGalleryImages, getMainImage, mainImageAlt } from "@/lib/property-images";
import { PropertyPhoto } from "./property-photo";

export function AvailabilityBadge({ available }: { available: number }) {
  const full = available === 0;
  const low = !full && available <= LOW_AVAILABILITY;
  const tone = full ? "bg-frost text-ink" : low ? "bg-navy-800 text-white" : "bg-navy-100 text-navy-800";
  const dot = full ? "bg-teal-700" : low ? "bg-teal-300" : "bg-navy-600";
  const label = full
    ? "Full · waitlist open"
    : low
      ? `Only ${available} ${available === 1 ? "bed" : "beds"} left`
      : `${available} beds open`;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>
      <span aria-hidden className={`size-2 rounded-full ${dot} ${low ? "animate-pulse motion-reduce:animate-none" : ""}`} />
      {label}
    </span>
  );
}

// Filled segments are occupied beds, so a nearly full home reads as nearly full.
export function OccupancyBar({ total, available, onDark = false }: { total: number; available: number; onDark?: boolean }) {
  const occupied = total - available;
  return (
    <div>
      <div className="flex gap-1" role="img" aria-label={`${occupied} of ${total} beds taken`}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < occupied ? (onDark ? "bg-navy-200" : "bg-navy-700") : "bg-teal-500"
            }`}
          />
        ))}
      </div>
      <p className={`mt-1.5 text-sm ${onDark ? "text-navy-100" : "text-navy-700"}`}>
        {available === 0 ? `All ${total} beds taken` : `${available} of ${total} beds open`}
      </p>
    </div>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  const main = getMainImage(property.slug);
  const photoCount = main ? 1 + getGalleryImages(property.slug).length : 0;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy-100 transition-shadow hover:shadow-md">
      <div className="relative">
        <PropertyPhoto
          src={main}
          alt={mainImageAlt(main, property.name, property.mainPhotoAlt)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-4/3"
        />
        {property.privateRoom && (
          <span className="absolute left-3 top-3 rounded-full bg-teal-300 px-3 py-1 text-xs font-semibold text-navy-900">
            Private room · ${property.privateRoom.price.toLocaleString("en-US")}/mo
          </span>
        )}
        {photoCount > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-semibold text-white">
            {photoCount} photos
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <AvailabilityBadge available={property.availableBeds} />
        <h3 className="mt-3 font-display text-2xl font-semibold text-navy-900">
          <Link href={`/properties/${property.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {property.name}
          </Link>
        </h3>
        <p className="text-sm text-navy-700">
          {displayAddress(property)} · {property.neighborhood}
        </p>
        <p className="mt-3 flex-1 text-base">{property.summary}</p>
        <div className="mt-5">
          <OccupancyBar total={property.totalBeds} available={property.availableBeds} />
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-navy-100 pt-4 text-center text-sm">
          <div>
            <dt className="text-navy-700">Beds</dt>
            <dd className="font-semibold">{property.totalBeds}</dd>
          </div>
          <div>
            <dt className="text-navy-700">Bedrooms</dt>
            <dd className="font-semibold">{property.bedrooms}</dd>
          </div>
          <div>
            <dt className="text-navy-700">Baths</dt>
            <dd className="font-semibold">{property.bathrooms}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
