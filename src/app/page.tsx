import Link from "next/link";
import { getAllPosts, getCities } from "@/lib/posts";
import { citySlug } from "@/lib/utils";
import HeroSection from "@/components/HeroSection";
import PostGrid from "@/components/PostGrid";
import FadeUp from "@/components/FadeUp";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, cities] = await Promise.all([
    getAllPosts(true).catch(() => []),
    getCities().catch(() => []),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <HeroSection
        postCount={posts.length}
        cityCount={cities.length}
        cities={cities.map((c) => c.city)}
      />

      {posts.length > 0 && (
        <section className="py-16">
          {/* Section heads are tiny labels, not mid-size serif. The post titles
              are the large type on the page — two competing sizes flattened the
              hierarchy and made the whole thing read as unfinished. */}
          <FadeUp className="flex items-baseline justify-between mb-8 pb-4 border-b border-border">
            <h2 className="label">Latest</h2>
            <Link href="/blog" className="meta hover:text-gold transition-colors">
              All Posts →
            </Link>
          </FadeUp>

          {/* 9 = one lead + two beside it + a row of six. /blog renders the
              same layout unbounded. */}
          <PostGrid posts={posts} max={9} />
        </section>
      )}

      {posts.length === 0 && (
        <section className="py-32 text-center text-muted">
          <p className="text-lg">Posts coming soon — the journey is getting documented.</p>
        </section>
      )}

      {cities.length > 0 && (
        <section className="py-16 border-t border-border">
          <FadeUp className="flex items-baseline justify-between mb-8 pb-4 border-b border-border">
            <h2 className="label">Cities</h2>
            <Link href="/cities" className="meta hover:text-gold transition-colors">
              All Cities →
            </Link>
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-wrap gap-2">
            {cities.map(({ city, country, count }) => (
              <Link
                key={city}
                href={`/cities/${encodeURIComponent(citySlug(city))}`}
                className="group inline-flex items-center gap-2 min-h-11 px-4 border border-border rounded-full text-sm bg-surface hover:border-ink transition-colors"
              >
                <span className="text-ink font-medium">{city}</span>
                <span className="text-muted text-xs">{country}</span>
                <span className="text-faint text-xs" aria-hidden>·</span>
                <span className="text-muted text-xs tabular-nums">{count}</span>
              </Link>
            ))}
          </FadeUp>
        </section>
      )}
    </div>
  );
}
