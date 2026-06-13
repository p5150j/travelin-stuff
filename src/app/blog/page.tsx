import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import AnimatedPostGrid from "@/components/AnimatedPostGrid";
import PostCard from "@/components/PostCard";
import FadeUp from "@/components/FadeUp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Posts",
  description: "Every post from two years of living and working remotely across the world.",
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  const posts = await getAllPosts(true).catch(() => []);

  const [hero, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const remaining = rest.slice(2);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <FadeUp className="border-b border-[#e8e3d8] pb-10 mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-[#8b6835] mb-4">Archive</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1c1a16]">All Posts</h1>
        <p className="text-[#8a8074] mt-3">{posts.length} entries and counting.</p>
      </FadeUp>

      {posts.length === 0 ? (
        <p className="text-[#8a8074] text-center py-24">No posts yet — check back soon.</p>
      ) : (
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
      )}
    </div>
  );
}
