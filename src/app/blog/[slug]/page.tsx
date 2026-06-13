import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import FadeUp from "@/components/FadeUp";

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
      {post.coverImage ? (
        <div className="relative w-full h-[50vh] sm:h-[65vh] overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-5 sm:px-8 pb-10">
            <PostMeta post={post} onImage />
          </div>
        </div>
      ) : (
        <FadeUp className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 pb-8 border-b border-[#e8e3d8]">
          <PostMeta post={post} onImage={false} />
        </FadeUp>
      )}

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <FadeUp>
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </FadeUp>

        {post.tags.length > 0 && (
          <FadeUp delay={0.1} className="mt-12 pt-8 border-t border-[#e8e3d8] flex flex-wrap gap-2">
            {[...new Set(post.tags)].map((tag, i) => (
              <span key={`${tag}-${i}`} className="text-xs px-3 py-1 border border-[#e8e3d8] text-[#8a8074] rounded-full">
                {tag}
              </span>
            ))}
          </FadeUp>
        )}

        <FadeUp delay={0.15} className="mt-10 flex items-center gap-6 text-sm border-t border-[#e8e3d8] pt-8">
          <Link href="/blog" className="text-[#8a8074] hover:text-[#1c1a16] transition-colors">
            ← All Posts
          </Link>
          <Link
            href={`/cities/${encodeURIComponent(post.city.toLowerCase().replace(/\s+/g, "-"))}`}
            className="text-[#8a8074] hover:text-[#1c1a16] transition-colors"
          >
            More from {post.city}
          </Link>
        </FadeUp>
      </div>
    </article>
  );
}

function PostMeta({ post, onImage }: { post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>; onImage: boolean }) {
  return (
    <>
      <div className={`flex items-center gap-2 text-xs tracking-widest uppercase mb-3 ${onImage ? "text-[#c9a96e]" : "text-[#8b6835]"}`}>
        <Link
          href={`/cities/${encodeURIComponent(post.city.toLowerCase().replace(/\s+/g, "-"))}`}
          className="transition-colors hover:opacity-70"
        >
          {post.city}
        </Link>
        {post.publishedAt && (
          <>
            <span className={onImage ? "text-white/30" : "text-[#e8e3d8]"}>·</span>
            <time className={`normal-case tracking-normal text-xs ${onImage ? "text-white/50" : "text-[#8a8074]"}`}>
              {formatDate(post.publishedAt)}
            </time>
          </>
        )}
      </div>
      <h1 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 ${onImage ? "text-white" : "text-[#1c1a16]"}`}>
        {post.title}
      </h1>
      <p className={`text-base sm:text-lg leading-relaxed ${onImage ? "text-white/60" : "text-[#8a8074]"}`}>
        {post.excerpt}
      </p>
    </>
  );
}
