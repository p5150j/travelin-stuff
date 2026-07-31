import Link from "next/link";
import { getCities } from "@/lib/posts";
import { citySlug } from "@/lib/utils";

/**
 * Discovery surface, not a signature line. The previous version was a name and a
 * copyright — a dead end on every page. Both reference sites in the design
 * research (Along Dusty Roads, Salt in Our Hair) use the footer as a real way
 * back into the content.
 *
 * Async because the Places column lists actual cities. That's one Firestore read
 * per route render, which ISR absorbs at 60s; it's wrapped in the same
 * catch(() => []) the pages use, so a Firestore outage degrades the footer to
 * static links rather than breaking every page.
 */
export default async function Footer() {
  const cities = await getCities().catch(() => []);

  // getCities() is ordered chronologically for the /cities timeline. Here the
  // job is discovery, so surface the most-written-about places instead.
  const featured = [...cities].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="sm:flex sm:justify-between sm:gap-12">
          <div className="max-w-xs mb-10 sm:mb-0">
            <p className="font-serif text-[1.375rem] font-bold text-ink tracking-[-0.015em]">
              Wandering &amp; Working
            </p>
            <p className="text-[0.9375rem] text-muted leading-relaxed mt-2">
              Two years of living and working remotely — deep-dives into the cities
              I&apos;ve actually called home.
            </p>
          </div>

          {/* Two columns hold at 390px because every label is one short word. */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <p className="label mb-4 block">Read</p>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/blog">All posts</FooterLink>
                <FooterLink href="/cities">Cities</FooterLink>
                <FooterLink href="/about">About</FooterLink>
              </ul>
            </div>

            {featured.length > 0 && (
              <div>
                <p className="label mb-4 block">Places</p>
                <ul className="flex flex-col gap-3">
                  {featured.map(({ city }) => (
                    <FooterLink
                      key={city}
                      href={`/cities/${encodeURIComponent(citySlug(city))}`}
                    >
                      {city}
                    </FooterLink>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="meta">© {new Date().getFullYear()} Patrick</p>
          <p className="meta">a life in motion</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[0.9375rem] text-muted hover:text-ink transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
