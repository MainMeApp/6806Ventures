"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type Photo = { src: string; alt: string };

// Swipeable photo viewer: scroll-snap does the sliding (so touch swipe works
// natively), and the arrows, thumbnails, and arrow keys just scroll the track.
export function PhotoCarousel({ photos, label }: { photos: Photo[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = (i + count) % count;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div aria-roledescription="carousel" aria-label={label} data-carousel>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(index + 1);
            if (e.key === "ArrowLeft") goTo(index - 1);
          }}
          tabIndex={0}
          data-carousel-track
          className="flex aspect-4/3 snap-x snap-mandatory overflow-x-auto rounded-3xl [scrollbar-width:none] sm:aspect-[2/1] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="relative h-full w-full shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                preload={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              data-carousel-prev
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              data-carousel-next
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white"
            >
              <Chevron dir="right" />
            </button>
            <p
              aria-live="polite"
              data-carousel-count
              className="absolute bottom-3 right-3 rounded-full bg-navy-900/80 px-3 py-1 text-sm font-medium tabular-nums text-white"
            >
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => goTo(i)}
              data-carousel-thumb={i}
              aria-label={`Show photo ${i + 1}: ${photo.alt}`}
              aria-current={i === index}
              className={`relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition sm:w-24 ${
                i === index ? "ring-teal-300" : "opacity-70 ring-transparent hover:opacity-100"
              }`}
            >
              <Image src={photo.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} />
    </svg>
  );
}
