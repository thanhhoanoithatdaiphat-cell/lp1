import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "daiphat-export-inquiries";

type Inquiry = {
  name: string;
  country: string;
  project: string;
  quantity: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
};

export function QuoteForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const inquiry: Inquiry = {
      name: String(data.get("name") ?? "").trim(),
      country: String(data.get("country") ?? "").trim(),
      project: String(data.get("project") ?? "").trim(),
      quantity: String(data.get("quantity") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    if (!inquiry.name || !inquiry.country || !inquiry.email) {
      setError("Please add your name, destination country and email.");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Inquiry[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([inquiry, ...existing].slice(0, 40)));
      setSent(true);
      event.currentTarget.reset();
    } catch {
      setError("Could not save this request. Please try again or call us.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-bg p-8">
        <p className="font-display text-3xl text-fg">Request received.</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Thank you. Our export desk will reply within 24 hours with a factory quotation and next
          steps. For urgent projects, call +84 967 156 678.
        </p>
        <Button className="mt-8" variant="ghost" onClick={() => setSent(false)}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-bg p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div>
          <Label htmlFor="country">Destination country</Label>
          <Input id="country" name="country" placeholder="Thailand, Indonesia, Philippines…" required />
        </div>
        <div>
          <Label htmlFor="project">Project type</Label>
          <Input id="project" name="project" placeholder="Classrooms, library, full campus…" />
        </div>
        <div>
          <Label htmlFor="quantity">Estimated quantity</Label>
          <Input id="quantity" name="quantity" placeholder="e.g. 240 desks, 12 classrooms" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="phone">WhatsApp / Zalo / phone</Label>
          <Input id="phone" name="phone" autoComplete="tel" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes or specifications</Label>
          <Textarea id="notes" name="notes" placeholder="Room list, finishes, Incoterms, delivery window…" />
        </div>
      </div>
      {error ? <p className="mt-4 text-sm text-primary">{error}</p> : null}
      <Button type="submit" size="lg" className="mt-6 w-full">
        Request factory quotation
      </Button>
      <p className="mt-3 text-center text-xs text-subtle">No obligation. Typical reply within 24 hours.</p>
    </form>
  );
}
