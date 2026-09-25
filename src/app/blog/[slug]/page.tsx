import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { citySlug, formatDate, truncate } from "@/lib/utils";
import { siteUrl, siteName } from "@/lib/site";
import FadeUp from "@/components/FadeUp";
import PostByline from "@/components/PostByline";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(true);
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  // Meta descriptions get cut around 160 chars; excerpt has no length cap.
  const description = truncate(post.excerpt, 155);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toDate().toISOString(),
      modifiedTime: post.updatedAt?.toDate().toISOString(),
      authors: ["Patrick"],
      tags: post.tags,
      /* No width/height — the previous 1200×630 was asserted about whatever
         cover happened to be uploaded, and wrong dimensions crop badly. Omitting
         them lets the platform read the real ones. Falls through to the
         generated site card when a post has no cover. */
      ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // For the spec strip. 200wpm; floor of 1 so a short dispatch never says "0".
  const words = post.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  /* BlogPosting structured data — what earns rich results in search. Every field
     already exists on the post; nothing here is invented. Emitted as a plain
     <script> because JSON-LD isn't part of the Metadata API. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toDate().toISOString(),
    dateModified: post.updatedAt?.toDate().toISOString() ?? post.publishedAt?.toDate().toISOString(),
    author: { "@type": "Person", name: "Patrick" },
    publisher: { "@type": "Organization", name: siteName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
    url: `${siteUrl}/blog/${post.slug}`,
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    ...(post.city ? { contentLocation: { "@type": "Place", name: post.city } } : {}),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // Serialised via JSON.stringify, so the only injection surface is the
        // post's own fields — same trust boundary as the body content.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover is a hard-cropped photo band closed by a full-strength yellow
          rule — no gradient scrim, no text floating on the image. The title
          gets its own block below, same anatomy as an arus section. svh on
          mobile so the band doesn't jump as the URL bar collapses. */}
      {post.coverImage && (
        <div className="relative w-full h-[52svh] sm:h-[60vh] overflow-hidden border-b-2 border-b-ink">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title block: chip → display title → lede, then the spec strip. */}
      <header className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <FadeUp>
          <Link
            href={`/cities/${encodeURIComponent(citySlug(post.city))}`}
            className="label chip hover:opacity-80 transition-opacity"
          >
            {post.city}
            {post.country ? ` · ${post.country}` : ""}
          </Link>
          <h1 className="font-serif text-[2.5rem] sm:text-6xl text-ink leading-[0.98] mt-5">
            {post.title}
          </h1>
          <p className="mt-5 text-[1.0625rem] sm:text-xl text-muted leading-relaxed">
            {post.excerpt}
          </p>
        </FadeUp>

        {/* Spec strip — double rule top, hairline bottom, mono data. The arus
            header language carrying the post's own numbers. */}
        <FadeUp
          delay={0.05}
          className="mt-8 border-t-2 border-t-ink border-b border-border py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1"
        >
          {post.publishedAt ? (
            <time className="meta">{formatDate(post.publishedAt)}</time>
          ) : (
            <span className="meta">Unpublished</span>
          )}
          <span className="meta">
            <span className="tabular-nums">{minutes}</span> min read
          </span>
        </FadeUp>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <FadeUp>
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </FadeUp>

        {post.tags.length > 0 && (
          <FadeUp delay={0.1} className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-2">
            <span className="meta mr-2">Filed</span>
            {[...new Set(post.tags)].map((tag, i) => (
              <span key={`${tag}-${i}`} className="text-xs px-3 py-1 border border-border text-muted">
                {tag}
              </span>
            ))}
          </FadeUp>
        )}

        <FadeUp delay={0.15}>
          <PostByline city={post.city} />
        </FadeUp>

        {/* "More from {city}" moved into the byline, so this is just the way out. */}
        <FadeUp delay={0.2} className="mt-10 border-t border-border pt-8">
          <Link
            href="/blog"
            className="label inline-block border-b-2 border-b-ink pb-0.5 hover:bg-yellow hover:text-bg transition-colors"
          >
            ← All Posts
          </Link>
        </FadeUp>
      </div>
    </article>
  );
}
