import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/* Fraunces replaces Playfair Display. Playfair is a high-contrast Didone — its
   hairlines go spindly below ~30px, which is exactly where post-card titles
   live. Fraunces carries an optical-size axis so it holds up small AND at
   display size, and SOFT/WONK give it the warmth the design is after. */
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif-family",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "Wandering & Working | A Remote Work Travel Blog",
    template: "%s | Wandering & Working",
  },
  description:
    "Two years of living and working remotely across the world — honest deep-dives into every city, neighborhood, and coffee shop that became home.",
  keywords: ["remote work", "digital nomad", "travel blog", "living abroad", "slow travel"],
  authors: [{ name: "Patrick" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wandering & Working",
    title: "Wandering & Working | A Remote Work Travel Blog",
    description:
      "Two years of living and working remotely across the world — honest deep-dives into every city.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Wandering & Working" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wandering & Working",
    description: "Two years of living and working remotely across the world.",
    images: ["/og-default.jpg"],
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
    <html lang="en" className={`${inter.variable} ${serif.variable} h-full antialiased`}>
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
