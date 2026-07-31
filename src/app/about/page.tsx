import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Two years, dozens of cities, one laptop. A little about who's behind this blog.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <div className="border-b border-border pb-10 mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">The Story</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink">About</h1>
      </div>
      <div className="prose">
        <p>
          I&apos;ve spent the last two years working remotely and slowly making my way through cities
          I&apos;d always wanted to live in — not visit, but actually <em>live in</em>. Coffee shop
          regulars, grocery runs, morning walks, finding the neighborhood that feels right. That kind
          of thing.
        </p>
        <p>
          This blog is where I document all of it. Sometimes it&apos;s a daily journal from three
          months in one place. Sometimes it&apos;s a single post after one transformative week. The
          format follows the journey.
        </p>
        <p>
          I cover what it&apos;s actually like to work and live somewhere — not where to go for the
          weekend, but where to find a desk with good wifi, which neighborhoods are walkable, what the
          visa situation looks like, and whether you&apos;d want to stay longer.
        </p>
        <p>
          More features coming as this grows — subscriptions, city guides, gear lists. But for now,
          just the writing.
        </p>
      </div>
    </div>
  );
}
