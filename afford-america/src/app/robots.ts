import type { MetadataRoute } from "next";

// Keep search engines out until launch: set ALLOW_INDEXING=true in production.
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.ALLOW_INDEXING === "true";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return allow
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
