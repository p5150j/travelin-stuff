import { Post } from "@/lib/posts";
import AnimatedPostGrid from "./AnimatedPostGrid";
import PostCard from "./PostCard";

interface Props {
  posts: Post[];
  /** Cap the number rendered. Omit to render everything (the /blog archive). */
  max?: number;
}

/**
 * The lead layout: one large post, two stacked beside it, then an even grid.
 * Shared by / and /blog, which previously carried identical copies of this JSX.
 *
 * On mobile it collapses to a single column, so the gap-12 vertical rhythm is
 * doing the real work there — cards carry a title and excerpt under the image
 * and need the separation to not read as one continuous column.
 */
export default function PostGrid({ posts, max }: Props) {
  const visible = max ? posts.slice(0, max) : posts;
  const [lead, ...rest] = visible;
  const beside = rest.slice(0, 2);
  const remaining = rest.slice(2);

  if (!lead) return null;

  return (
    <AnimatedPostGrid>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-6 mb-12 lg:mb-16">
        <div className="lg:col-span-2">
          <PostCard post={lead} large />
        </div>
        <div className="flex flex-col gap-12 lg:gap-8">
          {beside.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {remaining.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-y-14">
          {remaining.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </AnimatedPostGrid>
  );
}
