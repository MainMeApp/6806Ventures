import { ButtonLink, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-4xl font-semibold text-navy-900">Page not found</h1>
        <p className="mt-4 text-lg">That page does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/properties" variant="secondary">
            View properties
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
