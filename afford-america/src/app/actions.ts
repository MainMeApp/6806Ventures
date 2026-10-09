"use server";

import { z } from "zod";
import { deliverSubmission } from "@/lib/submissions";
import { placementName } from "@/content/properties";
import { site } from "@/content/site";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
  // What the visitor typed, sent back on errors so React's post-submit form reset
  // restores their answers instead of clearing them.
  values?: Record<string, string>;
  // Changes on every failed attempt; forms use it as a key to remount with `values`.
  attempt?: number;
};

function submittedValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string" && !k.startsWith("$")) values[k] = v;
  return values;
}

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
      values: submittedValues(formData),
      attempt: Date.now(),
    };
  }
  const d = parsed.data;
  const propertyName = placementName(d.preferredProperty);

  try {
    await deliverSubmission({
      kind: "referral",
      subject: `New referral: ${d.clientInitials} from ${d.referrerOrg} (${TIMEFRAMES[d.moveInTimeframe]})`,
      heading: "New placement referral",
      replyTo: d.referrerEmail,
      confirmation: {
        to: d.referrerEmail,
        subject: "We received your referral",
        text: `Hi ${d.referrerName},\n\nThank you for referring ${d.clientInitials} to ${site.brand}. A placement coordinator will contact you within one business day to talk through fit, funding, and move-in timing.\n\nIf it's urgent, reply to this email with "Urgent" in the subject line.\n\n${site.brand}\n${site.email}`,
      },
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
        "Move-in timeframe": TIMEFRAMES[d.moveInTimeframe],
        "Preferred property": propertyName,
        Notes: d.notes,
      },
    });
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      values: submittedValues(formData),
      attempt: Date.now(),
      message: `We could not send your referral. Please email ${site.email} or try again in a few minutes.`,
    };
  }

  return {
    status: "success",
    message: "Referral received. A placement coordinator will contact you within one business day.",
  };
}

const TIMEFRAMES = {
  immediately: "Immediately",
  "within-2-weeks": "Within 2 weeks",
  "within-30-days": "Within 30 days",
  "30-plus-days": "More than 30 days",
} as const;

const TOPICS = {
  tour: "Book a tour",
  availability: "Check bed availability",
  waitlist: "Join a waitlist",
  partnership: "Referral agreement / partnership",
  other: "Something else",
} as const;

const TOUR_TYPES = { "in-person": "In person", video: "Video call" } as const;
const TIME_WINDOWS = {
  morning: "Morning (9am to 12pm)",
  afternoon: "Afternoon (12pm to 3pm)",
  "late-afternoon": "Late afternoon (3pm to 6pm)",
} as const;
const VISITOR_ROLES = {
  "case-manager": "Case manager or social worker",
  resident: "Prospective resident",
  family: "Family member or supporter",
  other: "Other",
} as const;

const tourSchema = z
  .object({
    name: required("Name"),
    organization: text(),
    email: z.string().trim().email("Enter a valid email."),
    phone: required("Phone", 40),
    inquiryType: z.enum(Object.keys(TOPICS) as [keyof typeof TOPICS], { message: "Choose a topic." }),
    visitorRole: z.enum(Object.keys(VISITOR_ROLES) as [keyof typeof VISITOR_ROLES], { message: "Choose one." }),
    preferredProperty: text(),
    tourType: z.enum(["", ...Object.keys(TOUR_TYPES)] as ["", ...(keyof typeof TOUR_TYPES)[]]).default(""),
    preferredDate: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.")]).default(""),
    timeWindow: z.enum(["", ...Object.keys(TIME_WINDOWS)] as ["", ...(keyof typeof TIME_WINDOWS)[]]).default(""),
    preferredTimes: text(300),
    message: text(1500),
  });

// Tour-only requirements, checked separately so they're reported together with
// any other missing fields instead of only after those are fixed.
function tourErrors(raw: Record<string, unknown>) {
  const errors: Record<string, string[]> = {};
  if (raw.inquiryType !== "tour") return errors;
  if (!raw.tourType) errors.tourType = ["Choose in person or video."];
  const date = typeof raw.preferredDate === "string" ? raw.preferredDate : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.preferredDate = ["Choose a date for the tour."];
  // Compare against yesterday in UTC so evening requests in Atlanta aren't rejected.
  else if (date < new Date(Date.now() - 86_400_000).toISOString().slice(0, 10))
    errors.preferredDate = ["Choose a date in the future."];
  if (!raw.timeWindow) errors.timeWindow = ["Choose a time of day."];
  return errors;
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function submitTourRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { status: "success" };

  const raw = Object.fromEntries(formData);
  const parsed = tourSchema.safeParse(raw);
  const extra = tourErrors(raw);
  if (!parsed.success || Object.keys(extra).length) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: { ...(parsed.success ? {} : z.flattenError(parsed.error).fieldErrors), ...extra },
      values: submittedValues(formData),
      attempt: Date.now(),
    };
  }
  const d = parsed.data;
  const propertyName = placementName(d.preferredProperty);
  const isTour = d.inquiryType === "tour";
  const when = isTour ? `${formatDate(d.preferredDate)}, ${TIME_WINDOWS[d.timeWindow as keyof typeof TIME_WINDOWS]}` : "";

  const fields: Record<string, string> = {
    Name: d.name,
    "I am a": VISITOR_ROLES[d.visitorRole],
    Organization: d.organization,
    Email: d.email,
    Phone: d.phone,
    Topic: TOPICS[d.inquiryType],
    Property: propertyName,
  };
  if (isTour) {
    fields["Tour type"] = TOUR_TYPES[d.tourType as keyof typeof TOUR_TYPES];
    fields["Requested date"] = formatDate(d.preferredDate);
    fields["Requested time"] = TIME_WINDOWS[d.timeWindow as keyof typeof TIME_WINDOWS];
  }
  fields["Other availability"] = d.preferredTimes;
  fields.Message = d.message;

  try {
    await deliverSubmission({
      kind: isTour ? "tour" : "inquiry",
      subject: isTour
        ? `Tour request: ${d.name}, ${propertyName}, ${when}`
        : `Website inquiry (${TOPICS[d.inquiryType]}): ${d.name}${d.organization ? `, ${d.organization}` : ""}`,
      heading: isTour ? "New tour request" : `New website inquiry: ${TOPICS[d.inquiryType]}`,
      replyTo: d.email,
      fields,
      confirmation: {
        to: d.email,
        subject: isTour ? "We received your tour request" : "We received your message",
        text: isTour
          ? `Hi ${d.name},\n\nThanks for requesting ${d.tourType === "video" ? "a video tour" : "an in-person tour"} of ${propertyName === "No preference" ? "our homes" : propertyName} on ${when}. We'll email you within one business day to confirm the time.\n\n${site.brand}\n${site.email}`
          : `Hi ${d.name},\n\nThanks for reaching out to ${site.brand}. We'll get back to you within one business day.\n\n${site.brand}\n${site.email}`,
      },
    });
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      values: submittedValues(formData),
      attempt: Date.now(),
      message: `We could not send your request. Please email ${site.email} or try again in a few minutes.`,
    };
  }

  return {
    status: "success",
    message: isTour
      ? `Tour requested for ${when}. We'll email you within one business day to confirm.`
      : "Thanks. We will reach out within one business day.",
  };
}
