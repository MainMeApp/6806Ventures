import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

export type Submission = {
  kind: "referral" | "tour" | "inquiry";
  subject: string;
  // Shown as the first line of the email, e.g. "New tour request".
  heading: string;
  replyTo?: string;
  fields: Record<string, string>;
  // Optional thank-you email to the person who filled in the form.
  confirmation?: { to: string; subject: string; text: string };
};

const RESEND_API = process.env.RESEND_API_BASE ?? "https://api.resend.com";

// Delivers a form submission.
// - With RESEND_API_KEY set, emails the details to SUBMISSIONS_TO_EMAIL (default: the
//   site's contact email) and, when SEND_CONFIRMATION_EMAILS=true, thanks the submitter.
// - Locally without a key, appends to .data/submissions.jsonl for testing.
// - On a live host without a key it throws, so the visitor is told to email instead of
//   the submission vanishing.
export async function deliverSubmission(sub: Submission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.SUBMISSIONS_TO_EMAIL ?? site.email).split(",").map((s) => s.trim());
  const from = process.env.SUBMISSIONS_FROM_EMAIL ?? `${site.brand} <onboarding@resend.dev>`;

  if (apiKey) {
    await sendEmail(apiKey, {
      from,
      to,
      subject: sub.subject,
      text: `${sub.heading}\n\n${toText(sub.fields)}\n\nReply to this email to respond directly.`,
      html: toHtml(sub.heading, sub.fields),
      ...(sub.replyTo ? { reply_to: sub.replyTo } : {}),
    });

    if (sub.confirmation && process.env.SEND_CONFIRMATION_EMAILS === "true") {
      try {
        await sendEmail(apiKey, {
          from,
          to: [sub.confirmation.to],
          subject: sub.confirmation.subject,
          text: sub.confirmation.text,
          reply_to: to[0],
        });
      } catch (err) {
        // The team already has the submission; a failed thank-you should not fail the form.
        console.error("Confirmation email failed", err);
      }
    }
    return;
  }

  if (process.env.VERCEL) {
    console.error(`[submission:${sub.kind}] RESEND_API_KEY is not set; submission not delivered.\n${toText(sub.fields)}`);
    throw new Error("Email delivery is not configured");
  }

  const record = { receivedAt: new Date().toISOString(), ...sub };
  console.info(`[submission:${sub.kind}] ${sub.subject}\n${toText(sub.fields)}`);
  try {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "submissions.jsonl"), JSON.stringify(record) + "\n");
  } catch {
    // Read-only filesystem: the log line above is the record.
  }
}

async function sendEmail(apiKey: string, body: Record<string, unknown>) {
  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Email delivery failed (${res.status}): ${await res.text()}`);
  }
}

function toText(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([k, v]) => `${k}: ${v || "(blank)"}`)
    .join("\n");
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function toHtml(heading: string, fields: Record<string, string>) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #dde5f0;color:#2a4d7d;font-weight:600;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #dde5f0;color:#14233a;white-space:pre-wrap">${v ? escapeHtml(v) : '<span style="color:#8a99ad">(blank)</span>'}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px">
<h2 style="color:#142a4a;margin:0 0 4px">${escapeHtml(heading)}</h2>
<p style="color:#16707a;margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:1px">${escapeHtml(site.brand)} website</p>
<table style="border-collapse:collapse;width:100%;font-size:15px">${rows}</table>
<p style="color:#2a4d7d;font-size:13px;margin-top:16px">Reply to this email to respond directly.</p>
</div>`;
}
