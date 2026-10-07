"use client";

import { useActionState } from "react";
import { submitTourRequest, type FormState } from "@/app/actions";
import { FormStatus, Honeypot, SelectField, TextArea, TextField } from "@/components/form-fields";

const initial: FormState = { status: "idle" };

export function ContactForm({
  propertyOptions,
  defaultProperty,
  defaultTopic,
}: {
  propertyOptions: { value: string; label: string }[];
  defaultProperty?: string;
  defaultTopic?: string;
}) {
  const [state, action, pending] = useActionState(submitTourRequest, initial);
  const e = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-navy-100">
        <h2 className="font-display text-3xl font-semibold text-navy-900">Message sent</h2>
        <p className="mt-3 text-lg">{state.message ?? "Thank you."}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-5 rounded-3xl bg-white p-6 ring-1 ring-navy-100 sm:p-10" noValidate>
      <Honeypot />
      <FormStatus status={state.status} message={state.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Name" required autoComplete="name" errors={e.name} />
        <TextField name="organization" label="Organization" hint="If applicable" autoComplete="organization" errors={e.organization} />
        <TextField name="email" label="Email" type="email" required autoComplete="email" errors={e.email} />
        <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" errors={e.phone} />
        <SelectField
          name="inquiryType"
          label="What can we help with?"
          required
          defaultValue={defaultTopic}
          errors={e.inquiryType}
          options={[
            { value: "tour", label: "Schedule a property tour" },
            { value: "availability", label: "Check bed availability" },
            { value: "waitlist", label: "Join a property waitlist" },
            { value: "partnership", label: "Referral agreement / partnership" },
            { value: "other", label: "Something else" },
          ]}
        />
        <SelectField
          name="preferredProperty"
          label="Property"
          defaultValue={defaultProperty}
          placeholder="Any property"
          options={propertyOptions}
          errors={e.preferredProperty}
        />
      </div>
      <TextField
        name="preferredTimes"
        label="Best days and times for a tour"
        hint="e.g. Weekday mornings, or Tuesday after 2pm"
        errors={e.preferredTimes}
      />
      <TextArea name="message" label="Message" maxLength={1500} errors={e.message} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy-700 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
