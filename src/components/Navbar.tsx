"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm tracking-wide transition-colors ${
        pathname === href ? "text-[#1c1a16]" : "text-[#8a8074] hover:text-[#1c1a16]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e3d8] bg-[#faf9f6]/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-bold text-[#1c1a16] hover:text-[#8b6835] transition-colors tracking-wide">
          Wandering & Working
        </Link>

        <div className="hidden sm:flex items-center gap-8">
          {link("/blog", "Posts")}
          {link("/cities", "Cities")}
          {link("/about", "About")}
        </div>

        <button
          className="sm:hidden p-2 text-[#8a8074] hover:text-[#1c1a16]"
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
        <div className="sm:hidden border-t border-[#e8e3d8] bg-[#faf9f6] px-5 py-4 flex flex-col gap-4">
          {link("/blog", "Posts")}
          {link("/cities", "Cities")}
          {link("/about", "About")}
        </div>
      )}
    </header>
  );
}
