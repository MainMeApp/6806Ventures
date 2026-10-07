import Image from "next/image";

export function PropertyPhoto({
  src,
  alt,
  sizes,
  preload = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden bg-linear-to-br from-navy-100 via-frost to-navy-200 ${className}`}
        role="img"
        aria-label={`${alt} (photo coming soon)`}
      >
        <svg aria-hidden viewBox="0 0 64 64" className="size-16 text-navy-600/60" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M8 30 32 10l24 20" />
          <path d="M14 26v28h36V26" />
          <path d="M27 54V40h10v14" />
        </svg>
        <span className="absolute bottom-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-navy-800">
          Photo coming soon
        </span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
    </div>
  );
}
