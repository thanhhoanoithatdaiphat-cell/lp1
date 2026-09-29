import { useEffect, useState, type FormEvent } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY, PREFILL_EVENT } from "@/lib/site";

const ENDPOINT = `https://formsubmit.co/ajax/${COMPANY.email}`;

type Inquiry = {
  name: string;
  country: string;
  project: string;
  quantity: string;
  email: string;
  phone: string;
  notes: string;
};

function summary(i: Inquiry) {
  return [
    "Export quotation request",
    `Name: ${i.name}`,
    `Country: ${i.country}`,
    `Project: ${i.project || "-"}`,
    `Quantity: ${i.quantity || "-"}`,
    `Email: ${i.email}`,
    `Phone: ${i.phone || "-"}`,
    `Notes: ${i.notes || "-"}`,
  ].join("\n");
}

/** Shown when automatic sending fails: the customer can still reach us in one tap. */
function Fallback({ inquiry }: { inquiry: Inquiry }) {
  const text = encodeURIComponent(summary(inquiry));
  return (
    <div className="mt-4 rounded-md border border-border bg-surface p-4 text-sm">
      <p className="text-fg">
        We could not send this automatically. Send it to us directly instead — your details are
        already filled in:
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button asChild size="default" className="flex-1">
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
  const [failed, setFailed] = useState<Inquiry | null>(null);
  const [project, setProject] = useState("");

  useEffect(() => {
    const onPrefill = (e: Event) => setProject((e as CustomEvent<string>).detail ?? "");
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
    const inquiry: Inquiry = {
      name: get("name"),
      country: get("country"),
      project: get("project"),
      quantity: get("quantity"),
      email: get("email"),
      phone: get("phone"),
      notes: get("notes"),
    };

    if (data.get("_honey")) return; // bot trap
    if (!inquiry.name || !inquiry.country || !inquiry.email) {
      setError("Please add your name, destination country and email.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(inquiry.email)) {
      setError("Please enter a valid email address so we can reply.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...inquiry,
          _subject: `Export quotation request — ${inquiry.name} (${inquiry.country})`,
          _replyto: inquiry.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
      setProject("");
      form.reset();
    } catch {
      setFailed(inquiry);
      setError("Sorry, sending failed. Please use one of the options below or call us.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-bg p-8" role="status">
        <p className="font-display text-3xl text-fg">Request received.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thank you. Our export desk will reply within 24 hours with a factory quotation and next
          steps. For urgent projects, call{" "}
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
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" enterKeyHint="next" required />
        </div>
        <div>
          <Label htmlFor="country">Destination country</Label>
          <Input
            id="country"
            name="country"
            autoComplete="country-name"
            enterKeyHint="next"
            placeholder="Thailand, Indonesia, Philippines…"
            required
          />
        </div>
        <div>
          <Label htmlFor="project">Project type</Label>
          <Input
            id="project"
            name="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Classrooms, library, full campus…"
          />
        </div>
        <div>
          <Label htmlFor="quantity">Estimated quantity</Label>
          <Input id="quantity" name="quantity" placeholder="e.g. 240 desks, 12 classrooms" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">WhatsApp / Zalo / phone</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes or specifications</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Room list, finishes, Incoterms, delivery window…"
          />
        </div>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      {failed ? <Fallback inquiry={failed} /> : null}
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
