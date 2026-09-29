import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Factory,
  FileCheck,
  Globe,
  Menu,
  MessageCircle,
  Package,
  PenTool,
  Phone,
  Ruler,
  Ship,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "@/components/landing/quote-form";
import { COMPANY, MAIN_SITE, PREFILL_EVENT } from "@/lib/site";

const NAV = [
  { href: "#products", label: "Collections" },
  { href: "#capability", label: "Factory" },
  { href: "#process", label: "Export process" },
  { href: "#quote", label: "Request quote" },
];

const STATS = [
  { value: "7+", label: "Years producing" },
  { value: "3,000 m²", label: "Owned factory" },
  { value: "1,500+", label: "Items delivered" },
  { value: "24h", label: "Export quotation" },
];

const REASONS = [
  {
    icon: Factory,
    title: "Owned 3,000 m² factory",
    body: "Design, machining, finishing and packing stay under one roof — so quality is controlled from timber to container.",
  },
  {
    icon: Ruler,
    title: "Factory-direct pricing",
    body: "No trading-house markup. Schools and contractors across Asia buy at workshop cost with volume flexibility.",
  },
  {
    icon: Globe,
    title: "Built for Asian classrooms",
    body: "Humidity-ready finishes, heavy-duty frames, and sizes that match primary, secondary and university standards.",
  },
  {
    icon: Ship,
    title: "Export-ready logistics",
    body: "FOB or CIF, container loading plans, commercial documents, and packing designed for long-haul shipping.",
  },
];

const PRODUCTS = [
  {
    title: "Student desks & chairs",
    copy: "Stackable, height-correct sets for primary and secondary classrooms.",
    image: "student-desks",
  },
  {
    title: "Teacher & meeting rooms",
    copy: "Desks, storage and conference tables for staff rooms and administration.",
    image: "teacher",
  },
  {
    title: "Kindergarten interiors",
    copy: "Rounded, low-height tables, cubbies and soft seating for early years.",
    image: "kindergarten",
  },
  {
    title: "Libraries & media centers",
    copy: "Study tables, lounge seating and shelving for quiet and collaborative zones.",
    image: "library",
  },
  {
    title: "STEM & specialist labs",
    copy: "Workbenches, stools and storage for science, makerspaces and CTE rooms.",
    image: "stem",
  },
  {
    title: "Lockers, dorms & boards",
    copy: "Steel lockers, bunk beds, whiteboards and assembly-hall seating.",
    image: "dorm",
  },
];

const STEPS = [
  {
    n: "01",
    icon: FileCheck,
    title: "Brief",
    body: "Send drawings, room lists or photos. We confirm quantities, finishes and destination port.",
  },
  {
    n: "02",
    icon: PenTool,
    title: "3D & quotation",
    body: "Free layout studies and a factory-direct quote, typically within 24 hours.",
  },
  {
    n: "03",
    icon: Factory,
    title: "Production",
    body: "Machining and finishing in our Thanh Hoa workshop under a closed quality loop.",
  },
  {
    n: "04",
    icon: Package,
    title: "QC & packing",
    body: "Each piece is checked, then packed for container loading with part labels and packing lists.",
  },
  {
    n: "05",
    icon: Ship,
    title: "Delivery",
    body: "FOB Vietnam or CIF to your nearest Asian port — we stay on the line until arrival.",
  },
];

type PhotoProps = {
  name: string;
  widths: number[];
  ratio: [number, number];
  sizes: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** Responsive WebP: phones download the smallest file that fits. */
function Photo({ name, widths, ratio, sizes, alt, className, priority }: PhotoProps) {
  const largest = widths[widths.length - 1];
  return (
    <img
      src={`/images/${name}-${largest}.webp`}
      srcSet={widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      width={largest}
      height={Math.round((largest * ratio[1]) / ratio[0])}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3 text-fg">
      <img
        src="/logo.png"
        alt="Logo Nội Thất Đại Phát"
        width={48}
        height={48}
        className="size-12 shrink-0 object-contain"
      />
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight">Dai Phat</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          School Furniture
        </span>
      </span>
    </a>
  );
}

export function LandingPage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div id="top" className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 md:px-8 md:py-3">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button asChild>
              <a href="#quote">Request export quote</a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
        {open ? (
          <div id="mobile-menu" className="border-t border-border px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-12 items-center text-base text-fg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button asChild>
                <a href="#quote" onClick={() => setOpen(false)}>
                  Request export quote
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="relative isolate min-h-[88dvh] overflow-hidden">
          <Photo
            name="factory"
            widths={[640, 1024, 1600]}
            ratio={[16, 9]}
            sizes="100vw"
            priority
            alt="Dai Phat school furniture factory in Thanh Hoa, Vietnam"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/78 to-bg/25" />
          <div className="relative mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-20">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Made in Vietnam · Export to Asia
            </p>
            <h1 className="max-w-3xl font-display text-[2.6rem] font-medium leading-[1] tracking-tight text-fg sm:text-6xl md:text-7xl">
              School furniture
              <br />
              factory-direct from Vietnam.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Dai Phat designs and manufactures classrooms, libraries, STEM labs and dormitories in
              our 3,000 m² workshop — then ships export-ready to schools across Asia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="#quote">
                  Get a 24-hour quotation
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href="#products">Browse collections</a>
              </Button>
            </div>
            <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-[0.18em] text-subtle">{stat.label}</dt>
                  <dd className="mt-2 font-display text-3xl text-fg md:text-4xl">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                From drawing to dock
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-fg md:text-5xl">
                One workshop. Full control. No middlemen.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Nội Thất Đại Phát has produced interiors in Thanh Hoa since 2019. School furniture
                is built on the same closed loop as our residential and commercial work: survey,
                design, manufacture, finish, and pack — at factory-direct prices.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Custom sizes, laminates and powder-coat colors",
                  "Humidity-stable construction for tropical climates",
                  "FOB / CIF terms and full export documentation",
                  "Free 3D layouts on qualified project briefs",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-fg">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl">
              <Photo
                name="classroom"
                widths={[640, 1100]}
                ratio={[16, 9]}
                sizes="(min-width: 768px) 560px, 100vw"
                alt="Modern classroom furnished with Dai Phat desks and chairs"
                className="aspect-photo w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="capability" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Why Dai Phat
            </p>
            <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">
              Built for export buyers, not showrooms.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {REASONS.map((item) => (
              <article key={item.title} className="rounded-xl border border-border bg-surface p-7">
                <item.icon className="size-6 text-primary" />
                <h3 className="mt-5 font-display text-2xl text-fg">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="bg-paper text-ink">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-fg/70">
                  Collections
                </p>
                <h2 className="mt-4 font-display text-4xl md:text-5xl">
                  Every room a school actually uses.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink/70">
                Specify a single classroom or a full campus. We match construction, finish and
                packing to your destination country.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <article
                  key={product.title}
                  className="group relative overflow-hidden rounded-xl bg-bg text-fg"
                >
                  <div className="overflow-hidden">
                    <Photo
                      name={product.image}
                      widths={[480, 800]}
                      ratio={[4, 3]}
                      sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                      alt={`${product.title} — school furniture by Dai Phat`}
                      className="aspect-photo w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl">{product.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{product.copy}</p>
                    <a
                      href="#quote"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent(PREFILL_EVENT, { detail: product.title }),
                        )
                      }
                      className="mt-5 flex h-12 items-center justify-center gap-2 rounded-sm bg-primary text-sm font-semibold text-primary-fg transition-colors hover:bg-primary/90 after:absolute after:inset-0 after:content-['']"
                    >
                      Get a quote for this <ArrowRight className="size-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-muted">
              Looking for more models?{" "}
              <a
                href={MAIN_SITE.schoolCatalog}
                target="_blank"
                rel="noopener"
                className="font-semibold text-primary hover:underline"
              >
                Browse our full school furniture catalogue
              </a>{" "}
              (Vietnamese).
            </p>
          </div>
        </section>

        <section id="process" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Export process
              </p>
              <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">
                Five steps from brief to berth.
              </h2>
            </div>
            <Photo
              name="export"
              widths={[640, 1100]}
              ratio={[16, 9]}
              sizes="(min-width: 768px) 55vw, 100vw"
              alt="School furniture packed for container export from Vietnam"
              className="aspect-video w-full rounded-xl object-cover"
            />
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {STEPS.map((step) => (
              <li key={step.n} className="rounded-lg border border-border bg-surface p-5">
                <span className="font-display text-2xl text-primary">{step.n}</span>
                <step.icon className="mt-5 size-5 text-fg" />
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="quote" className="border-t border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                Export quotation
              </p>
              <h2 className="mt-4 font-display text-4xl text-fg md:text-5xl">
                Tell us the rooms. We price the factory.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Typical response within 24 hours. Share country, room types and quantities —
                drawings welcome, not required.
              </p>
              <div className="mt-10 space-y-4 text-sm">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fg">
                  <Phone className="size-4 text-primary" />
                  <a href={`tel:${COMPANY.phone}`} className="py-1 hover:text-primary">
                    {COMPANY.phoneDisplay}
                  </a>
                  <span aria-hidden className="text-subtle">
                    /
                  </span>
                  <a href={`tel:${COMPANY.phone2}`} className="py-1 hover:text-primary">
                    {COMPANY.phone2Display}
                  </a>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="ghost">
                    <a href={COMPANY.zaloUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" /> Chat on Zalo
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" /> WhatsApp
                    </a>
                  </Button>
                </div>
                <address className="not-italic text-muted">
                  Da Sy, Dong Quang, Thanh Hoa, Vietnam{" "}
                  <a
                    href={COMPANY.mapUrl}
                    target="_blank"
                    rel="noopener"
                    className="whitespace-nowrap font-semibold text-primary hover:underline"
                  >
                    (Google Maps & reviews)
                  </a>
                  <br />
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">
                    {COMPANY.email}
                  </a>
                </address>
                <p className="text-subtle">
                  Công ty TNHH SX và TM Nội Thất Đại Phát · Tax code 2802794939
                </p>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-28 pt-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-10">
          <div className="space-y-4">
            <Logo />
            <nav
              aria-label="Company links"
              className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted"
            >
              <a
                href={MAIN_SITE.home}
                target="_blank"
                rel="noopener"
                className="py-2 hover:text-primary"
              >
                Main website
              </a>
              <a
                href={MAIN_SITE.facebook}
                target="_blank"
                rel="noopener"
                className="py-2 hover:text-primary"
              >
                Facebook
              </a>
              <a
                href={MAIN_SITE.youtube}
                target="_blank"
                rel="noopener"
                className="py-2 hover:text-primary"
              >
                YouTube
              </a>
            </nav>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-subtle">
            Design · Manufacture · Fit-out. School furniture for Asia, produced in Thanh Hoa since
            2019.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <Button variant="ghost" className="px-2" asChild>
          <a href={`tel:${COMPANY.phone}`}>
            <Phone className="size-4" />
            Call
          </a>
        </Button>
        <Button variant="ghost" className="px-2" asChild>
          <a href={COMPANY.zaloUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            Zalo
          </a>
        </Button>
        <Button className="px-2" asChild>
          <a href="#quote">Get quote</a>
        </Button>
      </div>
    </div>
  );
}
