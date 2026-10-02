import Link from "next/link";
import { site } from "@/content/site";
import { MobileNav } from "./mobile-nav";

export const navItems = [
  { href: "/properties", label: "Properties" },
  { href: "/living-here", label: "Living Here" },
  { href: "/partners", label: "For Referral Partners" },
  { href: "/contact", label: "Tour & Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-pine-100 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full bg-pine-700 font-display text-lg font-bold text-white"
          >
            AA
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-pine-900">{site.shortBrand}</span>
            <span className="block text-xs uppercase tracking-widest text-pine-600">Community Living</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="font-medium text-ink hover:text-pine-700">
              {item.label}
            </Link>
          ))}
          <Link
            href="/refer"
            className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white transition-colors hover:bg-clay-dark"
          >
            Make a Referral
          </Link>
        </nav>

        <MobileNav items={navItems} />
      </div>
    </header>
  );
}
