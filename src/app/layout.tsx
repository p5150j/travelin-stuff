import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

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
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
