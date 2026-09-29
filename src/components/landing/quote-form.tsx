import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/inquiries";
import { COMPANY, PREFILL_EVENT } from "@/lib/site";

const EMAIL_ENDPOINT = `https://formsubmit.co/ajax/${COMPANY.email}`;

type Fields = { name: string; contact: string; country: string; message: string; product: string };

function summary(f: Fields) {
  return [
    "Export quotation request",
    `Name: ${f.name}`,
    `Contact: ${f.contact}`,
    `Country: ${f.country || "-"}`,
    `Interested in: ${f.product || "-"}`,
    `Message: ${f.message || "-"}`,
  ].join("\n");
}

/** Shown only if BOTH saving and emailing failed: one tap still reaches us. */
function Fallback({ fields }: { fields: Fields }) {
  const text = encodeURIComponent(summary(fields));
  return (
    <div className="mt-4 rounded-md border border-border bg-surface p-4 text-sm">
      <p className="text-fg">Please send it to us directly — your details are already filled in:</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="flex-1">
          <a href={`${COMPANY.whatsappUrl}?text=${text}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="flex-1">
          <a href={`mailto:${COMPANY.email}?subject=Export%20quotation%20request&body=${text}`}>
            Email us
          </a>
        </Button>
      </div>
    </div>
  );
}

export function QuoteForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [failed, setFailed] = useState<Fields | null>(null);
  const [product, setProduct] = useState("");

  useEffect(() => {
    const onPrefill = (e: Event) => setProduct((e as CustomEvent<string>).detail ?? "");
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setError("");
    setFailed(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const fields: Fields = {
      name: get("name"),
      contact: get("contact"),
      country: get("country"),
      message: get("message"),
      product,
    };

    if (!fields.name || fields.contact.length < 3) {
      setError("Please add your name and an email or WhatsApp/Zalo number so we can reply.");
      return;
    }

    setSending(true);
    // 1) Save to the database (source of truth)  2) email a notification. Either one is enough.
    const results = await Promise.allSettled([
      submitInquiry({
        data: {
          ...fields,
          website: get("website"),
          pageUrl: window.location.href,
          referrer: document.referrer,
        },
      }),
      fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          _subject: `Export quotation request — ${fields.name}${fields.country ? ` (${fields.country})` : ""}`,
          ...(fields.contact.includes("@") ? { _replyto: fields.contact } : {}),
          _template: "table",
          _captcha: "false",
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
      }),
    ]);
    setSending(false);

    if (results.some((r) => r.status === "fulfilled")) {
      setSent(true);
      setProduct("");
      form.reset();
    } else {
      setFailed(fields);
      setError("Sorry, sending failed. Please use one of the options below or call us.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-bg p-8" role="status">
        <p className="font-display text-3xl text-fg">Request received.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thank you. Our export desk will reply within 24 hours with a factory quotation. For urgent
          projects, call{" "}
          <a href={`tel:${COMPANY.phone}`} className="text-primary">
            {COMPANY.phoneDisplay}
          </a>{" "}
          or message us on{" "}
          <a
            href={COMPANY.zaloUrl}
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zalo
          </a>
          .
        </p>
        <Button className="mt-8" variant="ghost" onClick={() => setSent(false)}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-bg p-6 md:p-8"
      noValidate
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-5">
        {product ? (
          <p className="flex items-center justify-between gap-3 rounded-md border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm text-fg">
            <span>
              Interested in: <strong>{product}</strong>
            </span>
            <button
              type="button"
              onClick={() => setProduct("")}
              aria-label="Remove selected product"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </p>
        ) : null}
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" enterKeyHint="next" required />
        </div>
        <div>
          <Label htmlFor="contact">Email or WhatsApp / Zalo</Label>
          <Input
            id="contact"
            name="contact"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            placeholder="you@school.com or +66 …"
            required
          />
        </div>
        <div>
          <Label htmlFor="country">Country (optional)</Label>
          <Input
            id="country"
            name="country"
            autoComplete="country-name"
            enterKeyHint="next"
            placeholder="Thailand, Indonesia, Philippines…"
          />
        </div>
        <div>
          <Label htmlFor="message">What do you need? (optional)</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Rooms, quantities, finishes, delivery window… or just say hello."
          />
        </div>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      {failed ? <Fallback fields={failed} /> : null}
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          "Request factory quotation"
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-subtle">
        No obligation. Typical reply within 24 hours.
      </p>
    </form>
  );
}
