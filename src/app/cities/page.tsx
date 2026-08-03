import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCities } from "@/lib/posts";
import { citySlug, formatDateRange } from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import FadeUp from "@/components/FadeUp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cities",
  description: "Every city I've lived and worked from, in the order I lived them.",
  alternates: { canonical: "/cities" },
  openGraph: { url: "/cities", images: ["/opengraph-image"] },
};

export default async function CitiesPage() {
  const cities = await getCities().catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <PageHeader
        eyebrow="The Route"
        title="Cities"
        subtitle={
          cities.length > 0
            ? `${cities.length} cities, in the order I lived them.`
            : undefined
        }
      />

      {cities.length === 0 ? (
        <p className="text-muted text-center py-24">No cities yet.</p>
      ) : (
        <ol>
          {cities.map((entry, i) => (
            <li key={entry.city}>
              <FadeUp>
                <Link
                  href={`/cities/${encodeURIComponent(citySlug(entry.city))}`}
                  className="group block sm:grid sm:grid-cols-5 sm:gap-8 sm:items-center"
                >
                  {/* Photography leads. The old version of this page had none —
                      on a travel blog, which was the core problem with it. */}
                  <div className="relative overflow-hidden rounded-xl bg-raised aspect-[4/3] sm:aspect-[4/3] sm:col-span-3">
                    {entry.coverImage ? (
                      <Image
                        src={entry.coverImage}
                        alt={entry.city}
                        fill
                        sizes="(min-width: 640px) 60vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-raised to-border" />
                    )}
                  </div>

                  <div className="pt-4 sm:pt-0 sm:col-span-2">
                    {/* Index + country as one tiny line. The stop number is
                        deliberately small — post count used to be the biggest
                        element on this page, which was backwards. */}
                    <p className="label mb-2 block">
                      <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {entry.country && (
                        <>
                          <span className="mx-2 text-faint" aria-hidden>·</span>
                          {entry.country}
                        </>
                      )}
                    </p>

                    <h2 className="font-serif text-[2.125rem] sm:text-[2.5rem] font-bold text-ink leading-[1.04] tracking-[-0.025em] group-hover:text-gold transition-colors">
                      {entry.city}
                    </h2>

                    <p className="meta mt-3">
                      {formatDateRange(entry.firstAt, entry.lastAt)}
                      <span className="mx-2 text-faint" aria-hidden>·</span>
                      <span className="tabular-nums">{entry.count}</span>
                      {entry.count === 1 ? " post" : " posts"}
                    </p>
                  </div>
                </Link>
              </FadeUp>

              {/* Connector between stops — omitted after the last one so the
                  route reads as ending rather than continuing. */}
              {i < cities.length - 1 && (
                <div className="h-14 sm:h-16 flex justify-center sm:justify-start" aria-hidden>
                  <span className="w-px bg-border sm:ml-[30%]" />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
