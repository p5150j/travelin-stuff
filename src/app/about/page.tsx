import type { Metadata } from "next";
import Link from "next/link";
import FadeUp from "@/components/FadeUp";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fourteen years shipping software, three exits, and years of living in the places most people only visit. Who's behind this blog and why it exists.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", images: ["/opengraph-image"] },
};

/* Section head: numbered mono label over a full-strength rule — the arus
   section anatomy, carried onto the reading column. */
function SectionHead({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between border-t-2 border-t-ink pt-3 mb-6">
      <span className="label tabular-nums">{n}</span>
      <span className="label">{label}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <FadeUp className="border-b border-border pb-10 mb-12">
        <p className="label chip mb-5">The Story</p>
        <h1 className="font-serif text-[2.75rem] sm:text-6xl text-ink leading-[0.98]">
          About
        </h1>
        <p className="text-muted mt-5 text-[1.0625rem] sm:text-xl leading-relaxed max-w-xl">
          I&apos;m Patrick. By day I architect AI systems that have to work in
          production, not just in a demo. The rest of the time I live in the
          places most people only visit.
        </p>
      </FadeUp>

      <FadeUp className="mb-14">
        <SectionHead n="01" label="The Operator" />
        <div className="prose">
          <p>
            Fourteen years shipping software. Three exits. Teams from two to
            80+, products from $0 to $50M ARR. I&apos;ve been the CTO, the VP
            of Engineering, the technical product guy — usually the one
            architecting strategy on Monday and pushing production code on
            Friday. These days that means enterprise AI: fine-tuning
            open-source models, GraphRAG over corporate repositories, systems
            where the data never leaves the building.
          </p>
          <p>
            I mentor early-stage AI companies at Techstars — All-Star, three
            years running. Give First isn&apos;t a slogan; it&apos;s how the
            whole thing works.
          </p>
          <p>
            The job is the engine. It funds the route, and it&apos;s why every
            post on this blog cares about upload speed.
          </p>
        </div>
      </FadeUp>

      <FadeUp className="mb-14">
        <SectionHead n="02" label="The Route" />
        <div className="prose">
          <p>
            Germany, Croatia, Australia, Vietnam, the Philippines, Brazil. Not
            two-week tourist passes — months at a time, working US hours, with
            a Starlink in the luggage. I flew to Melbourne to hand over a
            company we&apos;d just sold. I went to Saigon for a reset and found
            the best city I&apos;ve ever been to. A box jellyfish wrapped
            itself around my leg within hours of landing in El Nido, and I
            stayed anyway.
          </p>
          <p>
            I research places like an engineer — cost of living, internet,
            hospitals, visas — then I commit. The underrated spot, not the
            influencer hotspot.
          </p>
        </div>
      </FadeUp>

      <FadeUp className="mb-14">
        <SectionHead n="03" label="The Other Resume" />
        <div className="prose">
          <p>
            The defining fact of my adult life isn&apos;t on the resume: I
            raised my kids as a full-time single parent for twenty years. Both
            launched now — one in college, one married with a kid of her own,
            which makes me a grandfather. A word I&apos;m still getting used to
            typing.
          </p>
          <p>
            The empty nest is real. This blog is partly what I&apos;m doing
            about it: the chapter where I was needed at home every day is
            closed, and I&apos;m out here working out — in real time — what the
            next twenty years are for.
          </p>
        </div>
      </FadeUp>

      <FadeUp className="mb-14">
        <SectionHead n="04" label="Why This Exists" />
        <div className="prose">
          <p>
            This is not a highlight reel. I write the version I wished existed
            when I was running the numbers on a place: what it actually costs,
            what&apos;s overrated, where the friction is, who it&apos;s for and
            who it&apos;s not. Real prices. Real internet speeds. The
            jellyfish.
          </p>
          <p>
            If a city is worse than the famous one next door, I&apos;ll say so.
            If it&apos;s better, I&apos;ll tell you before the crowds get
            there. Useful to the next person who actually wants to go — not
            just scroll.
          </p>
        </div>
      </FadeUp>

      {/* The arus "Now" list, verbatim anatomy: label row with the date, then
          hairline rows. Update as the route moves. */}
      <FadeUp>
        <ul className="text-[0.9375rem] leading-snug">
          <li className="label border-t-2 border-t-ink pt-2 pb-2 flex justify-between">
            <span>Now</span>
            <span>September 2026</span>
          </li>
          <li className="border-b border-border py-2.5 text-body">
            Architecting an in-house AI platform for an enterprise compliance
            company. Remote, like always.
          </li>
          <li className="border-b border-border py-2.5 text-body">
            Writing from the Big Island of Hawai&apos;i. Teaching free coding
            and AI classes in Hilo.
          </li>
          <li className="border-b border-border py-2.5 text-body font-semibold">
            Next stop: Iloilo City, Philippines.
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <Link
            href="/blog"
            className="label inline-block border-b-2 border-b-ink pb-0.5 hover:bg-yellow hover:text-bg transition-colors"
          >
            Read the field reports →
          </Link>
          <a
            href="https://arus.io"
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-block border-b-2 border-b-ink pb-0.5 hover:bg-yellow hover:text-bg transition-colors"
          >
            The work side: arus.io →
          </a>
        </div>
      </FadeUp>
    </div>
  );
}
