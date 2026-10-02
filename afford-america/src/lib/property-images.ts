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

export function getGalleryImages(slug: string): string[] {
  const main = getMainImage(slug);
  return listImages(slug)
    .map((f) => `/properties/${slug}/${f}`)
    .filter((src) => src !== main);
}
