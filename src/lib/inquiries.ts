import { createServerFn } from "@tanstack/react-start";

export type InquiryInput = {
  name: string;
  contact: string;
  country: string;
  product: string;
  message: string;
  pageUrl: string;
  referrer: string;
  /** Honeypot: real visitors never fill this. */
  website: string;
};

const clip = (v: unknown, max: number) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

function parse(raw: unknown): InquiryInput {
  const d = (raw ?? {}) as Record<string, unknown>;
  const input: InquiryInput = {
    name: clip(d.name, 120),
    contact: clip(d.contact, 200),
    country: clip(d.country, 80),
    product: clip(d.product, 120),
    message: clip(d.message, 3000),
    pageUrl: clip(d.pageUrl, 500),
    referrer: clip(d.referrer, 500),
    website: clip(d.website, 200),
  };
  if (!input.name || input.contact.length < 3) {
    throw new Error("Name and contact are required.");
  }
  return input;
}

/** Saves a quotation request to the database. Server-only (runs on the server). */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator(parse)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    if (data.website) return { ok: true }; // bot: pretend success, store nothing
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    // The NOT EXISTS guard swallows accidental double-taps (same contact within 1 minute).
    await sql`
      insert into inquiries (name, contact, country, product, message, page_url, referrer)
      select ${data.name}, ${data.contact}, ${data.country || null}, ${data.product || null},
             ${data.message || null}, ${data.pageUrl || null}, ${data.referrer || null}
      where not exists (
        select 1 from inquiries
        where contact = ${data.contact} and created_at > now() - interval '1 minute'
      )
    `;
    return { ok: true };
  });
