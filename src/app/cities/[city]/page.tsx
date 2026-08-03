import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostsByCity, getCities } from "@/lib/posts";
import { citySlug } from "@/lib/utils";
import PostCard from "@/components/PostCard";
import PageHeader from "@/components/PageHeader";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(true);
    const cities = [...new Set(posts.map((p) => p.city))];
    return cities.map((city) => ({ city: citySlug(city) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;

  // Prefer the stored city name and its cover photo over anything derived from
  // the slug — the entry already carries both. Falls back to a title-cased slug
  // so metadata still renders if Firestore is unreachable.
  const entry = (await getCities().catch(() => [])).find((c) => citySlug(c.city) === slug);
  const label = entry?.city ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description = `All posts from my time living and working in ${label}.`;

  return {
    title: label,
    description,
    alternates: { canonical: `/cities/${slug}` },
    openGraph: {
      type: "website",
      url: `/cities/${slug}`,
      // City cover rather than the generic site card. No width/height: these are
      // whatever was uploaded, and declaring dimensions we haven't measured is
      // worse than letting the platform read them.
      ...(entry?.coverImage ? { images: [{ url: entry.coverImage, alt: label }] } : {}),
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  // Named `slug`, not `citySlug` — that would shadow the imported helper.
  const { city: slug } = await params;

  const allPosts = await getAllPosts(true).catch(() => []);
  const matchingCity = allPosts.find((p) => citySlug(p.city) === slug)?.city;

  if (!matchingCity) notFound();

  const posts = await getPostsByCity(matchingCity).catch(() => []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      {/* matchingCity is the name as stored on the post. The slug-derived
          title-case version this used to show disagreed with /cities for any
          city not entered in Title Case, and mangled acronyms. */}
      <PageHeader
        eyebrow={posts[0]?.country}
        title={matchingCity}
        subtitle={`${posts.length} post${posts.length !== 1 ? "s" : ""}`}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-y-14">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
