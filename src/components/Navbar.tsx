"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // onClick closes the mobile drawer — without it the menu stayed open behind
  // the new page after navigating.
  // Mono label links with underline hover — the arus header language.
  const link = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`label transition-colors hover:underline underline-offset-4 ${
        pathname === href ? "underline underline-offset-4" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );

  return (
    // Double rule top + hairline bottom, straight off the arus header.
    <header className="sticky top-0 z-50 border-t-2 border-t-ink border-b border-border bg-bg/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
        <Link href="/" className="label hover:bg-yellow hover:text-bg transition-colors px-1 -mx-1">
          Wandering & Working
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          {link("/blog", "Posts")}
          {link("/cities", "Cities")}
          {link("/about", "About")}
        </div>

        <button
          className="sm:hidden p-2 text-muted hover:text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-border bg-bg px-5 py-4 flex flex-col gap-4">
          {link("/blog", "Posts")}
          {link("/cities", "Cities")}
          {link("/about", "About")}
        </div>
      )}
    </header>
  );
}
