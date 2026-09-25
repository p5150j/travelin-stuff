import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteUrl, siteName } from "@/lib/site";

/* Full arus.io brand match: Geist Sans (black weight for display) + Geist
   Mono, no serif. The travel site runs the palette inverted — yellow type on
   ink — as the deliberate negative of the work site. */
const sans = Geist({ subsets: ["latin"], variable: "--font-sans-family" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-family" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | A Remote Work Travel Blog`,
    template: `%s | ${siteName}`,
  },
  description:
    "Two years of living and working remotely across the world — honest deep-dives into every city, neighborhood, and coffee shop that became home.",
  keywords: ["remote work", "digital nomad", "travel blog", "living abroad", "slow travel"],
  authors: [{ name: "Patrick" }],
  alternates: { canonical: "/" },
  /* No `title`/`description` here on purpose. openGraph merges shallowly, so an
     explicit title at the root was inherited by every child page — /blog,
     /cities, /about and /cities/[city] all shared one og:title even though their
     <title> was correct. Omitting them lets Next derive og:* from each page's own
     title and description. Same for `images`: the opengraph-image.tsx file
     convention supplies the default card, and posts override it with their cover. */
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      {/* bg/text come from globals.css (#faf9f6 / #1c1a16). The old
          bg-stone-50 text-stone-900 utilities were cool-toned and fought the
          warm palette everything else uses. */}
      <body className="min-h-full flex flex-col">
        <div className="grain" aria-hidden />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
