import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { COMPANY, MAIN_SITE, SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from "@/lib/site";
import appCss from "../styles.css?url";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  description: SEO_DESCRIPTION,
  ...(SITE_URL ? { url: SITE_URL, logo: `${SITE_URL}/logo.png`, image: `${SITE_URL}/og.jpg` } : {}),
  telephone: COMPANY.phone,
  email: COMPANY.email,
  taxID: COMPANY.taxId,
  foundingDate: COMPANY.foundingYear,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.street,
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.region,
    addressCountry: COMPANY.country,
  },
  sameAs: [MAIN_SITE.home, MAIN_SITE.facebook, MAIN_SITE.youtube],
  areaServed: "Asia",
  knowsAbout: [
    "School furniture",
    "Classroom desks and chairs",
    "Kindergarten furniture",
    "Library furniture",
    "STEM laboratory furniture",
    "Dormitory furniture",
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: SEO_TITLE },
      { name: "description", content: SEO_DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: COMPANY.legalName },
      { name: "theme-color", content: "#14110e" },
      { name: "format-detection", content: "telephone=yes" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      ...(SITE_URL ? [{ rel: "canonical", href: `${SITE_URL}/` }] : []),
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
