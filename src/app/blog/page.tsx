import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PageHeader from "@/components/PageHeader";
import ArchiveList from "@/components/ArchiveList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Posts",
  description: "Every post from two years of living and working remotely across the world.",
  alternates: { canonical: "/blog" },
  // Both fields needed: setting openGraph at all replaces the inherited object,
  // so omitting `images` drops the default card and omitting `url` inherits "/".
  openGraph: { url: "/blog", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  const posts = await getAllPosts(true).catch(() => []);

  return (
    // Narrower than the card grid was — dense rows want a shorter measure so the
    // eye doesn't have to travel from thumbnail to city across a 72rem line.
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <PageHeader
        eyebrow="Archive"
        title="All Posts"
        subtitle={`${posts.length} entries and counting.`}
      />

      {posts.length === 0 ? (
        <p className="text-muted text-center py-24">No posts yet — check back soon.</p>
      ) : (
        <ArchiveList posts={posts} />
      )}
    </div>
  );
}
