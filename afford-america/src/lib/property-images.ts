import "server-only";
import fs from "node:fs";
import path from "node:path";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const PUBLIC_DIR = path.join(process.cwd(), "public");

function listImages(slug: string): string[] {
  const dir = path.join(PUBLIC_DIR, "properties", slug);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();
  } catch {
    return [];
  }
}

// Main image is the file named main.*; falls back to the first image in the folder.
export function getMainImage(slug: string): string | null {
  const files = listImages(slug);
  const main = files.find((f) => /^main\./i.test(f)) ?? files[0];
  return main ? `/properties/${slug}/${main}` : null;
}

// Readable alt text from a filename like "01-shared-bedroom.jpg" -> "shared bedroom".
export function photoLabel(src: string): string {
  const name = src.split("/").pop() ?? "";
  return name
    .replace(IMAGE_EXT, "")
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

// Alt text for the main photo. A dedicated main.* file uses the property's
// description; a fallback (first gallery image) is described from its filename.
export function mainImageAlt(src: string | null, name: string, mainPhotoAlt?: string): string {
  if (src && !/\/main\.[a-z]+$/i.test(src)) return `${name}: ${photoLabel(src)}`;
  return mainPhotoAlt ?? `Photo of ${name}`;
}

export function getGalleryImages(slug: string): string[] {
  const main = getMainImage(slug);
  return listImages(slug)
    .map((f) => `/properties/${slug}/${f}`)
    .filter((src) => src !== main);
}
