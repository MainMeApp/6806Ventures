import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<typeof Link> & { variant?: "primary" | "accent" | "secondary" | "light" };

const variants = {
  primary: "bg-navy-700 text-white hover:bg-navy-800",
  // For navy backgrounds, where a navy button would disappear.
  accent: "bg-sky text-navy-900 hover:bg-sky-light",
  secondary: "border-2 border-navy-700 text-navy-800 hover:bg-navy-50",
  light: "bg-white text-navy-900 hover:bg-frost",
};

export function ButtonLink({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors ${variants[variant]} ${className}`}
    />
  );
}

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-widest text-accent">{children}</p>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl ${className}`}>{children}</h2>
  );
}

export function Check() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-5 shrink-0 text-navy-600" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Cross() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-5 shrink-0 text-alert" fill="currentColor">
      <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="bg-navy-900 px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-navy-200">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg text-navy-100">{children}</div>}
      </div>
    </div>
  );
}
