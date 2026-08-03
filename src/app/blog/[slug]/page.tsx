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

      {/* Cover hero uses 62svh on mobile: svh excludes the collapsing browser
          chrome, so it doesn't jump as the URL bar hides on scroll. */}
      {post.coverImage ? (
        <div className="relative w-full h-[62svh] sm:h-[68vh] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-5 sm:px-8 pb-10">
            <PostMeta post={post} onImage />
          </div>
        </div>
      ) : (
        <FadeUp className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-8 border-b border-border">
          <PostMeta post={post} onImage={false} />
        </FadeUp>
      )}

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <FadeUp>
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </FadeUp>

        {post.tags.length > 0 && (
          <FadeUp delay={0.1} className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
            {[...new Set(post.tags)].map((tag, i) => (
              <span key={`${tag}-${i}`} className="text-xs px-3 py-1 border border-border text-muted rounded-full">
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
          <Link href="/blog" className="text-sm text-muted hover:text-ink transition-colors">
            ← All Posts
          </Link>
        </FadeUp>
      </div>
    </article>
  );
}

function PostMeta({ post, onImage }: { post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>; onImage: boolean }) {
  return (
    <>
      <div className={`label flex items-center gap-2 mb-4 ${onImage ? "!text-gold-lift" : ""}`}>
        <Link
          href={`/cities/${encodeURIComponent(citySlug(post.city))}`}
          className="transition-opacity hover:opacity-70"
        >
          {post.city}
        </Link>
        {post.publishedAt && (
          <>
            <span className={onImage ? "text-white/30" : "text-faint"} aria-hidden>·</span>
            <time className={onImage ? "text-white/55" : "text-muted"}>
              {formatDate(post.publishedAt)}
            </time>
          </>
        )}
      </div>
      <h1
        className={`font-serif text-[2.375rem] sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-[-0.025em] mb-5 ${
          onImage ? "text-white" : "text-ink"
        }`}
      >
        {post.title}
      </h1>
      <p className={`text-[1.0625rem] sm:text-lg leading-relaxed ${onImage ? "text-white/65" : "text-muted"}`}>
        {post.excerpt}
      </p>
    </>
  );
}
