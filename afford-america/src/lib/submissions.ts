import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export type Submission = {
  kind: "referral" | "tour";
  subject: string;
  replyTo?: string;
  fields: Record<string, string>;
};

// Delivers a form submission. With RESEND_API_KEY and SUBMISSIONS_TO_EMAIL set
// it sends a plain-text email; otherwise it appends to .data/submissions.jsonl
// so the forms can be tested locally without any accounts.
export async function deliverSubmission(sub: Submission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUBMISSIONS_TO_EMAIL;
  const from = process.env.SUBMISSIONS_FROM_EMAIL ?? "Afford America Website <onboarding@resend.dev>";

  const text = Object.entries(sub.fields)
    .map(([k, v]) => `${k}: ${v || "(blank)"}`)
    .join("\n");

  if (apiKey && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: sub.subject,
        text,
        ...(sub.replyTo ? { reply_to: sub.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      throw new Error(`Email delivery failed (${res.status}): ${await res.text()}`);
    }
    return;
  }

  const record = { receivedAt: new Date().toISOString(), ...sub };
  console.info(`[submission:${sub.kind}] ${sub.subject}\n${text}`);
  try {
    const dir = path.join(process.cwd(), ".data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, "submissions.jsonl"), JSON.stringify(record) + "\n");
  } catch {
    // Read-only filesystems (e.g. serverless) without email configured: the log line above is the record.
  }
}
