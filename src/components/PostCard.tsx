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
    <article className={`group relative overflow-hidden rounded-2xl bg-[#f5f3ee] ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />

      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ee] to-[#e8e3d8]" />
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-[#c9a96e] mb-2 tracking-widest uppercase">
          <span>{post.city}</span>
          {post.publishedAt && (
            <>
              <span className="text-white/40">·</span>
              <time className="text-white/50 normal-case tracking-normal">{formatDate(post.publishedAt)}</time>
            </>
          )}
        </div>
        <h2 className={`font-serif font-bold text-white leading-snug group-hover:text-[#c9a96e] transition-colors ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {post.title}
        </h2>
        {large && (
          <p className="mt-2 text-sm text-white/60 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[...new Set(post.tags)].slice(0, 3).map((tag, i) => (
              <span key={`${tag}-${i}`} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
