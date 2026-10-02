"use client";

import { useActionState } from "react";
import { submitReferral, type FormState } from "@/app/actions";
import { FormStatus, Honeypot, SelectField, TextArea, TextField, YesNoField } from "@/components/form-fields";

const initial: FormState = { status: "idle" };

export function ReferralForm({
  propertyOptions,
  defaultProperty,
}: {
  propertyOptions: { value: string; label: string }[];
  defaultProperty?: string;
}) {
  const [state, action, pending] = useActionState(submitReferral, initial);
  const e = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-pine-100">
        <h2 className="font-display text-3xl font-semibold text-pine-900">Thank you</h2>
        <p className="mt-3 text-lg">{state.message ?? "Referral received."}</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-10 rounded-3xl bg-white p-6 ring-1 ring-pine-100 sm:p-10" noValidate>
      <Honeypot />
      <FormStatus status={state.status} message={state.message} />

      <fieldset className="space-y-5">
        <legend className="font-display text-2xl font-semibold text-pine-900">1. About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="referrerName" label="Your name" required autoComplete="name" errors={e.referrerName} />
          <TextField name="referrerOrg" label="Organization" required autoComplete="organization" errors={e.referrerOrg} />
          <TextField name="referrerRole" label="Role or title" hint="e.g. HUD-VASH Housing Specialist" errors={e.referrerRole} />
          <TextField name="referrerPhone" label="Phone" type="tel" required autoComplete="tel" errors={e.referrerPhone} />
          <TextField name="referrerEmail" label="Work email" type="email" required autoComplete="email" errors={e.referrerEmail} className="sm:col-span-2" />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-2xl font-semibold text-pine-900">2. About the client</legend>
        <p className="rounded-xl bg-sand/70 px-4 py-3 text-sm">
          Please share initials only. Do not include full names, dates of birth, Social Security numbers, diagnoses, or
          medical records. We will collect what we need securely during the screening call.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="clientInitials" label="Client initials" required maxLength={6} errors={e.clientInitials} />
          <SelectField
            name="clientAgeRange"
            label="Age range"
            required
            errors={e.clientAgeRange}
            options={[
              { value: "18-54", label: "18 to 54" },
              { value: "55-64", label: "55 to 64" },
              { value: "65+", label: "65 or older" },
            ]}
          />
          <TextField
            name="fundingSource"
            label="Funding source"
            required
            hint="e.g. HUD-VASH, GHVP, SSDI, SSI, VA pension"
            errors={e.fundingSource}
          />
          <SelectField
            name="moveInTimeframe"
            label="Needed move-in"
            required
            errors={e.moveInTimeframe}
            options={[
              { value: "immediately", label: "Immediately" },
              { value: "within-2-weeks", label: "Within 2 weeks" },
              { value: "within-30-days", label: "Within 30 days" },
              { value: "30-plus-days", label: "More than 30 days" },
            ]}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <YesNoField name="veteran" label="Is the client a veteran?" required errors={e.veteran} />
          <YesNoField
            name="monthlyIncomeConfirmed"
            label="Income or voucher confirmed?"
            hint="Covers the $1,500 monthly package"
            required
            errors={e.monthlyIncomeConfirmed}
          />
          <YesNoField name="ambulatory" label="Is the client ambulatory?" required errors={e.ambulatory} />
          <YesNoField
            name="independentAdls"
            label="Independent with daily living activities?"
            hint="Bathing, dressing, eating without staff help"
            required
            errors={e.independentAdls}
          />
          <YesNoField
            name="selfMedicates"
            label="Manages their own medications?"
            required
            errors={e.selfMedicates}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-2xl font-semibold text-pine-900">3. Placement</legend>
        <SelectField
          name="preferredProperty"
          label="Preferred property"
          defaultValue={defaultProperty}
          placeholder="No preference"
          options={propertyOptions}
          errors={e.preferredProperty}
        />
        <TextArea
          name="notes"
          label="Anything else we should know?"
          hint="Scheduling needs, transportation, pets, preferred contact times. No medical details."
          maxLength={1500}
          errors={e.notes}
        />
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required className="mt-1.5 size-5 accent-pine-700" />
          <span>
            The client knows about and agrees to this housing referral, and I am authorized to share this information.
            <span className="text-clay"> *</span>
            {e.consent?.length ? (
              <span className="block text-sm font-medium text-clay-dark">{e.consent[0]}</span>
            ) : null}
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-clay px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-clay-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Submit Referral"}
      </button>
    </form>
  );
}
