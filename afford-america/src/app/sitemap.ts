import type { MetadataRoute } from "next";
import { properties } from "@/content/properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = ["", "/properties", "/living-here", "/partners", "/refer", "/contact", ...properties.map((p) => `/properties/${p.slug}`)];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
