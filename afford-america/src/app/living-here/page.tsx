import type { Metadata } from "next";
import { ButtonLink, Check, Eyebrow, H2, PageHero, Section } from "@/components/ui";
import { monthlyPackage, notProvided } from "@/content/site";

export const metadata: Metadata = {
  title: "Living Here",
  description: "What daily life looks like in an Afford America home, and what the all-inclusive package covers.",
};

const rhythm = [
  ["Every day", "The house host sanitizes kitchens, bathrooms, and shared spaces. Residents keep their own room tidy."],
  ["Every week", "Grocery orders are coordinated and delivered, including EBT/SNAP purchases."],
  ["Every two weeks", "A professional cleaning crew cleans every common area, top to bottom."],
  ["Any time", "Residents come and go, keep their own appointments, and welcome their own care providers."],
];

const bring = ["Personal clothing and shoes", "Photo ID and benefits paperwork", "Personal medications and prescriptions", "Phone and charger"];

export default function LivingHerePage() {
  return (
    <>
      <PageHero eyebrow="Living here" title="Independent living, without the bills and logistics">
        <p>
          Residents live on their own terms in a shared, furnished home. Housing is fully covered before move-in, and we
          handle the household so residents can focus on their health, family, and community.
        </p>
      </PageHero>

      <Section>
        <Eyebrow>What is included</Eyebrow>
        <H2>Everything in the ${monthlyPackage.price.toLocaleString("en-US")} monthly package</H2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {monthlyPackage.includes.map((i) => (
            <div key={i.title} className="rounded-2xl bg-white p-7 ring-1 ring-navy-100">
              <h3 className="text-lg font-semibold text-navy-900">{i.title}</h3>
              <p className="mt-2">{i.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-frost/60">
        <Eyebrow>The rhythm of the home</Eyebrow>
        <H2>What to expect</H2>
        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          {rhythm.map(([when, what]) => (
            <div key={when} className="flex gap-5 rounded-2xl bg-white p-6 ring-1 ring-navy-100">
              <dt className="w-36 shrink-0 font-display text-xl font-semibold text-accent">{when}</dt>
              <dd>{what}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Moving in</Eyebrow>
            <H2>What to bring</H2>
            <p className="mt-4">The room is furnished with a bed, linens, and storage. Residents only need:</p>
            <ul className="mt-5 space-y-3">
              {bring.map((b) => (
                <li key={b} className="flex gap-2">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-navy-900 p-8 text-navy-100">
            <h2 className="font-display text-2xl font-semibold text-white">An important note on care</h2>
            <p className="mt-4">{notProvided}</p>
            <div className="mt-8">
              <ButtonLink href="/contact" variant="light">
                Ask us a question
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
