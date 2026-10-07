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
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-mist/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full bg-navy-700 font-display text-lg font-bold text-white"
          >
            AA
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-navy-900">{site.shortBrand}</span>
            <span className="block text-xs uppercase tracking-widest text-navy-600">Community Living</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="font-medium text-ink hover:text-navy-700">
              {item.label}
            </Link>
          ))}
          <Link
            href="/refer"
            className="rounded-full bg-navy-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Make a Referral
          </Link>
        </nav>

        <MobileNav items={navItems} />
      </div>
    </header>
  );
}
