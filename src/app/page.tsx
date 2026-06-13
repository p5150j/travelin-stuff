import Link from "next/link";
import { getAllPosts, getCities } from "@/lib/posts";
import HeroSection from "@/components/HeroSection";
import AnimatedPostGrid from "@/components/AnimatedPostGrid";
import PostCard from "@/components/PostCard";
import FadeUp from "@/components/FadeUp";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, cities] = await Promise.all([
    getAllPosts(true).catch(() => []),
    getCities().catch(() => []),
  ]);

  const [hero, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const remaining = rest.slice(2, 8);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <HeroSection
        postCount={posts.length}
        cityCount={cities.length}
        cities={cities.map((c) => c.city)}
      />

      {posts.length > 0 && (
        <section className="py-16">
          <FadeUp className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-xl text-[#1c1a16] font-bold">Latest</h2>
            <Link href="/blog" className="text-xs tracking-widest uppercase text-[#8a8074] hover:text-[#8b6835] transition-colors">
              All Posts →
            </Link>
          </FadeUp>

          <AnimatedPostGrid>
            {hero && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <PostCard post={hero} large />
                </div>
                <div className="flex flex-col gap-4">
                  {secondary.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
            {remaining.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {remaining.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </AnimatedPostGrid>
        </section>
      )}

      {posts.length === 0 && (
        <section className="py-32 text-center text-[#8a8074]">
          <p className="text-lg">Posts coming soon — the journey is getting documented.</p>
        </section>
      )}

      {cities.length > 0 && (
        <section className="py-16 border-t border-[#e8e3d8]">
          <FadeUp className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-xl text-[#1c1a16] font-bold">Cities</h2>
            <Link href="/cities" className="text-xs tracking-widest uppercase text-[#8a8074] hover:text-[#8b6835] transition-colors">
              All Cities →
            </Link>
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-wrap gap-2">
            {cities.map(({ city, country, count }) => (
              <Link
                key={city}
                href={`/cities/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, "-"))}`}
                className="group flex items-center gap-2 px-4 py-2 border border-[#e8e3d8] rounded-full text-sm bg-white hover:border-[#1c1a16] transition-colors"
              >
                <span className="text-[#1c1a16] font-medium">{city}</span>
                <span className="text-[#8a8074] text-xs">{country}</span>
                <span className="text-[#e8e3d8] text-xs">·</span>
                <span className="text-[#8a8074] text-xs">{count}</span>
              </Link>
            ))}
          </FadeUp>
        </section>
      )}
    </div>
  );
}
