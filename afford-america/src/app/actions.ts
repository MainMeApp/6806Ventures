"use server";

import { z } from "zod";
import { deliverSubmission } from "@/lib/submissions";
import { properties } from "@/content/properties";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const text = (max = 200) => z.string().trim().max(max);
const required = (label: string, max = 200) => text(max).min(1, `${label} is required.`);
const yesNo = z.enum(["yes", "no", "unsure"], { message: "Please choose an option." });

function isSpam(formData: FormData) {
  // Honeypot: real people never see or fill the "company_website" field.
  return String(formData.get("company_website") ?? "").length > 0;
}

const referralSchema = z.object({
  referrerName: required("Your name"),
  referrerOrg: required("Organization"),
  referrerRole: text(),
  referrerEmail: z.string().trim().email("Enter a valid email."),
  referrerPhone: required("Phone", 40),
  clientInitials: required("Client initials", 6),
  clientAgeRange: z.enum(["18-54", "55-64", "65+"], { message: "Choose an age range." }),
  veteran: yesNo,
  fundingSource: required("Funding source"),
  monthlyIncomeConfirmed: yesNo,
  ambulatory: yesNo,
  independentAdls: yesNo,
  selfMedicates: yesNo,
  moveInTimeframe: z.enum(["immediately", "within-2-weeks", "within-30-days", "30-plus-days"], {
    message: "Choose a timeframe.",
  }),
  preferredProperty: text(),
  notes: text(1500),
  consent: z.literal("on", { message: "Please confirm the client has agreed to this referral." }),
});

export async function submitReferral(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const parsed = referralSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const d = parsed.data;
  const propertyName =
    properties.find((p) => p.slug === d.preferredProperty)?.name ?? "No preference";

  try {
    await deliverSubmission({
      kind: "referral",
      subject: `New referral: ${d.clientInitials} from ${d.referrerOrg} (${d.moveInTimeframe})`,
      replyTo: d.referrerEmail,
      fields: {
        "Referrer name": d.referrerName,
        Organization: d.referrerOrg,
        Role: d.referrerRole,
        Email: d.referrerEmail,
        Phone: d.referrerPhone,
        "Client initials": d.clientInitials,
        "Age range": d.clientAgeRange,
        Veteran: d.veteran,
        "Funding source": d.fundingSource,
        "Full package covered (100%)": d.monthlyIncomeConfirmed,
        Ambulatory: d.ambulatory,
        "Independent with daily living activities": d.independentAdls,
        "Self-administers medications": d.selfMedicates,
        "Move-in timeframe": d.moveInTimeframe,
        "Preferred property": propertyName,
        Notes: d.notes,
      },
    });
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "We could not send your referral. Please email info@affordamerica.org or try again in a few minutes.",
    };
  }

  return {
    status: "success",
    message: "Referral received. A placement coordinator will contact you within one business day.",
  };
}

const tourSchema = z.object({
  name: required("Name"),
  organization: text(),
  email: z.string().trim().email("Enter a valid email."),
  phone: required("Phone", 40),
  inquiryType: z.enum(["tour", "partnership", "availability", "waitlist", "other"], { message: "Choose a topic." }),
  preferredProperty: text(),
  preferredTimes: text(300),
  message: text(1500),
});

export async function submitTourRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const parsed = tourSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const d = parsed.data;
  const propertyName =
    properties.find((p) => p.slug === d.preferredProperty)?.name ?? "No preference";

  try {
    await deliverSubmission({
      kind: "tour",
      subject: `Website inquiry (${d.inquiryType}): ${d.name}${d.organization ? `, ${d.organization}` : ""}`,
      replyTo: d.email,
      fields: {
        Name: d.name,
        Organization: d.organization,
        Email: d.email,
        Phone: d.phone,
        Topic: d.inquiryType,
        "Preferred property": propertyName,
        "Preferred times": d.preferredTimes,
        Message: d.message,
      },
    });
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "We could not send your message. Please email info@affordamerica.org or try again in a few minutes.",
    };
  }

  return { status: "success", message: "Thanks. We will reach out within one business day to confirm." };
}
