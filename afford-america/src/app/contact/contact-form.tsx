"use client";

import { useActionState, useState } from "react";
import { submitTourRequest, type FormState } from "@/app/actions";
import { FormStatus, Honeypot, SelectField, TextArea, TextField } from "@/components/form-fields";

const initial: FormState = { status: "idle" };

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
  const [topic, setTopic] = useState(defaultTopic ?? "tour");
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const isTour = topic === "tour";

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-10 text-center ring-1 ring-navy-100">
        <h2 className="font-display text-3xl font-semibold text-navy-900">{isTour ? "Tour requested" : "Message sent"}</h2>
        <p className="mt-3 text-lg">{state.message ?? "Thank you."}</p>
      </div>
    );
  }

  return (
    <form key={state.attempt ?? 0} action={action} className="relative space-y-6 rounded-3xl bg-white p-6 ring-1 ring-navy-100 sm:p-10" noValidate>
      <Honeypot />
      <FormStatus status={state.status} message={state.message} />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="inquiryType"
          label="What can we help with?"
          required
          defaultValue={topic}
          onChange={setTopic}
          errors={e.inquiryType}
          options={[
            { value: "tour", label: "Book a tour" },
            { value: "availability", label: "Check bed availability" },
            { value: "waitlist", label: "Join a property waitlist" },
            { value: "partnership", label: "Referral agreement / partnership" },
            { value: "other", label: "Something else" },
          ]}
        />
        <SelectField
          name="preferredProperty"
          label="Property"
          defaultValue={v.preferredProperty ?? defaultProperty}
          placeholder="Any property"
          options={propertyOptions}
          errors={e.preferredProperty}
        />
      </div>

      {isTour && (
        <fieldset className="space-y-5 rounded-2xl bg-frost/60 p-5 sm:p-6">
          <legend className="sr-only">Tour details</legend>
          <p className="font-display text-xl font-semibold text-navy-900">Tour details</p>
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectField
              name="tourType"
              defaultValue={v.tourType}
              label="Tour type"
              required
              errors={e.tourType}
              options={[
                { value: "in-person", label: "In person" },
                { value: "video", label: "Video call" },
              ]}
            />
            <TextField
              name="preferredDate"
              defaultValue={v.preferredDate}
              label="Preferred date"
              type="date"
              required
              min={todayLocal()}
              errors={e.preferredDate}
            />
            <SelectField
              name="timeWindow"
              defaultValue={v.timeWindow}
              label="Time of day"
              required
              errors={e.timeWindow}
              options={[
                { value: "morning", label: "Morning (9am to 12pm)" },
                { value: "afternoon", label: "Afternoon (12pm to 3pm)" },
                { value: "late-afternoon", label: "Late afternoon (3pm to 6pm)" },
              ]}
            />
          </div>
          <p className="text-sm text-navy-700">We&apos;ll email you within one business day to confirm the exact time.</p>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name"
              defaultValue={v.name} label="Your name" required autoComplete="name" errors={e.name} />
        <SelectField
          name="visitorRole"
              defaultValue={v.visitorRole}
          label="I am a"
          required
          errors={e.visitorRole}
          options={[
            { value: "case-manager", label: "Case manager or social worker" },
            { value: "resident", label: "Prospective resident" },
            { value: "family", label: "Family member or supporter" },
            { value: "other", label: "Other" },
          ]}
        />
        <TextField name="email"
              defaultValue={v.email} label="Email" type="email" required autoComplete="email" errors={e.email} />
        <TextField name="phone"
              defaultValue={v.phone} label="Phone" type="tel" required autoComplete="tel" errors={e.phone} />
        <TextField
          name="organization"
              defaultValue={v.organization}
          label="Organization"
          hint="If applicable"
          autoComplete="organization"
          errors={e.organization}
          className="sm:col-span-2"
        />
      </div>

      <TextField
        name="preferredTimes"
              defaultValue={v.preferredTimes}
        label={isTour ? "Other days or times that work" : "Best days and times to reach you"}
        hint="Optional, e.g. any weekday morning"
        errors={e.preferredTimes}
      />
      <TextArea name="message"
              defaultValue={v.message} label="Message" hint="Optional" maxLength={1500} errors={e.message} />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy-700 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : isTour ? "Request Tour" : "Send Message"}
      </button>
    </form>
  );
}
