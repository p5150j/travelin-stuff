import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { citySlug, formatDate } from "@/lib/utils";
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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toDate().toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
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
