import Link from "next/link";
import { site, notProvided } from "@/content/site";
import { navItems } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="bg-pine-900 px-4 py-14 text-pine-100 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold text-white">{site.brand}</p>
          <p className="mt-3 text-sm">{site.tagline}</p>
          <p className="mt-4 text-sm">{site.serviceArea}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[...navItems, { href: "/refer", label: "Make a Referral" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl space-y-3 border-t border-pine-700 pt-6 text-xs text-pine-200">
        <p>{notProvided}</p>
        <p className="flex items-center gap-2">
          <EqualHousingIcon />
          Equal Housing Opportunity. We do not discriminate on the basis of race, color, religion, sex, national
          origin, familial status, or disability.
        </p>
        <p>
          &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function EqualHousingIcon() {
  return (
    <svg aria-label="Equal Housing Opportunity" role="img" viewBox="0 0 24 24" className="size-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 13h6M9 16h6" />
    </svg>
  );
}
