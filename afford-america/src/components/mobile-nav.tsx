"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-pine-200 px-3 py-2 font-medium text-pine-900"
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-pine-100 bg-cream px-4 pb-6 pt-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block py-3 text-lg font-medium text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/refer"
            onClick={close}
            className="mt-3 block rounded-full bg-clay px-5 py-3 text-center font-semibold text-white"
          >
            Make a Referral
          </Link>
        </nav>
      )}
    </div>
  );
}
