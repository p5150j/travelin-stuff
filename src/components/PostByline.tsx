import Link from "next/link";
import { citySlug } from "@/lib/utils";

interface Props {
  /** City the post was written from — the byline links back into it. */
  city: string;
}

/**
 * Author block at the foot of a post.
 *
 * The design research was consistent that trust is the currency in this niche,
 * and that a named human is one of the devices that buys it — Along Dusty Roads
 * puts "Andrew & Emily" front and centre. Nothing on this site said who was
 * writing until now.
 *
 * Monogram rather than a photo: there's no avatar asset in the repo, and a
 * missing-image placeholder would undercut the exact thing this is for.
 */
export default function PostByline({ city }: Props) {
  return (
    <div className="mt-12 pt-8 border-t border-border flex items-start gap-4">
      <span
        aria-hidden
        className="shrink-0 w-12 h-12 rounded-full bg-ink text-bg font-serif font-bold text-lg flex items-center justify-center"
      >
        P
      </span>

      <div className="min-w-0">
        <p className="font-serif text-[1.25rem] font-bold text-ink leading-tight tracking-[-0.015em]">
          Patrick
        </p>
        <p className="text-[0.9375rem] text-muted leading-relaxed mt-1.5">
          Two years of working remotely and living in the places I write about —
          long enough to have a regular coffee shop and an opinion about the
          neighbourhoods.
        </p>
        <Link
          href={`/cities/${encodeURIComponent(citySlug(city))}`}
          className="label inline-block mt-4 hover:opacity-70 transition-opacity"
        >
          More from {city} →
        </Link>
      </div>
    </div>
  );
}
