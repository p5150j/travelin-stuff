import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/posts";
import { formatDayMonth } from "@/lib/utils";

interface Props {
  posts: Post[];
}

interface YearGroup {
  /** null for posts with no publishedAt — shouldn't happen for published posts,
      but grouping defensively beats throwing them away. */
  year: number | null;
  posts: Post[];
}

/**
 * The /blog archive: dense chronological rows grouped by year, with a small
 * thumbnail per entry.
 *
 * Deliberately not cards. Cards are a showcase format — they're right on the
 * homepage where the job is to sell three posts. An archive's job is the
 * opposite: fit as many entries on screen as possible while staying scannable,
 * which is why the rows are compact and the year headings do the navigation.
 * The thumbnail keeps photography present without costing the density.
 */
export default function ArchiveList({ posts }: Props) {
  const groups: YearGroup[] = [];

  // posts arrive publishedAt DESC, so a single pass preserves order and the
  // groups come out newest-year-first for free.
  for (const post of posts) {
    const year = post.publishedAt?.toDate().getFullYear() ?? null;
    const current = groups[groups.length - 1];
    if (current && current.year === year) current.posts.push(post);
    else groups.push({ year, posts: [post] });
  }

  return (
    <div>
      {/* Jump links — plain anchors, so this needs no JS and survives with
          scroll-behavior:smooth already set on html. */}
      {groups.length > 1 && (
        <nav className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-border">
          <span className="meta mr-1">Jump to</span>
          {groups.map(({ year, posts: yearPosts }) => (
            <a
              key={year ?? "undated"}
              href={`#year-${year ?? "undated"}`}
              className="inline-flex items-center gap-1.5 min-h-9 px-3 border border-border rounded-full text-sm text-ink hover:border-ink transition-colors"
            >
              <span className="tabular-nums">{year ?? "Undated"}</span>
              <span className="text-faint text-xs tabular-nums">{yearPosts.length}</span>
            </a>
          ))}
        </nav>
      )}

      {groups.map(({ year, posts: yearPosts }) => (
        <section key={year ?? "undated"} className="mb-14 last:mb-0">
          {/* scroll-mt clears the sticky 4rem navbar when jumped to. */}
          <h2
            id={`year-${year ?? "undated"}`}
            className="scroll-mt-20 flex items-baseline justify-between mb-2 pb-3 border-b border-ink"
          >
            <span className="font-serif text-[2rem] sm:text-[2.5rem] font-bold text-ink leading-none tracking-[-0.02em] tabular-nums">
              {year ?? "Undated"}
            </span>
            <span className="meta">
              <span className="tabular-nums">{yearPosts.length}</span>
              {yearPosts.length === 1 ? " post" : " posts"}
            </span>
          </h2>

          <ul>
            {yearPosts.map((post) => (
              <li key={post.id} className="group relative border-b border-border">
                <Link
                  href={`/blog/${post.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={post.title}
                />

                <div className="flex items-center gap-4 py-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-md bg-raised">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        /* Decorative — the title sits right beside it, so alt
                           text here would just be read twice. */
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-raised to-border" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="meta mb-1">{formatDayMonth(post.publishedAt)}</p>
                    <h3 className="font-serif text-[1.25rem] sm:text-[1.4375rem] font-bold text-ink leading-[1.2] tracking-[-0.015em] line-clamp-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  {/* City is plain text, not a link — the row-wide overlay above
                      would swallow the click anyway. /cities is the way in. */}
                  <span className="label shrink-0 self-center hidden sm:block">
                    {post.city}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
