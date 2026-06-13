import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostsByCity } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(true);
    const cities = [...new Set(posts.map((p) => p.city))];
    return cities.map((city) => ({ city: city.toLowerCase().replace(/\s+/g, "-") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const label = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: label,
    description: `All posts from my time living and working in ${label}.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const label = citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const allPosts = await getAllPosts(true).catch(() => []);
  const matchingCity = allPosts.find(
    (p) => p.city.toLowerCase().replace(/\s+/g, "-") === citySlug
  )?.city;

  if (!matchingCity) notFound();

  const posts = await getPostsByCity(matchingCity).catch(() => []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <div className="border-b border-[#e8e3d8] pb-10 mb-12">
        {posts[0]?.country && (
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b6835] mb-4">{posts[0].country}</p>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1c1a16]">{label}</h1>
        <p className="text-[#8a8074] mt-3">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
