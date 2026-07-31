import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

interface Props {
  post: Post;
  large?: boolean;
}

export default function PostCard({ post, large = false }: Props) {
  return (
    // Root stays <article> — AnimatedPostGrid queries for it to build the
    // scroll stagger. Changing this tag silently kills the animation.
    <article className="group relative">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />

      {/* Image sits above the text rather than under a gradient. Taller crop on
          phones (4:5) so a full-width card fills more of the screen; wider on
          desktop where a tall card would push the title below the fold. */}
      <div
        className={`relative overflow-hidden rounded-xl bg-raised ${
          large ? "aspect-[4/5] sm:aspect-[16/10]" : "aspect-[4/5] sm:aspect-[3/2]"
        }`}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            /* Mobile-first: one column full-bleed on phones, two up at sm,
               three up at lg. Without this Next assumes 100vw everywhere and
               over-fetches badly on the multi-column breakpoints. */
            sizes={
              large
                ? "(min-width: 1024px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-raised to-border" />
        )}
      </div>

      <div className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="label">{post.city}</span>
          {post.publishedAt && (
            <>
              <span className="text-faint" aria-hidden>·</span>
              <time className="meta">{formatDate(post.publishedAt)}</time>
            </>
          )}
        </div>

        {/* Big serif title carries the hierarchy now that there's no image
            overlay competing with it — 26px on mobile, up from the original 18px. */}
        <h2
          className={`font-serif font-bold text-ink tracking-[-0.015em] group-hover:text-gold transition-colors ${
            large
              ? "text-[2rem] sm:text-[2.625rem] leading-[1.06]"
              : "text-[1.625rem] sm:text-[1.75rem] leading-[1.15]"
          }`}
        >
          {post.title}
        </h2>

        {large && (
          <p className="mt-3 text-[0.9375rem] text-muted leading-relaxed line-clamp-2 max-w-prose">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
