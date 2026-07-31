"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

interface Props {
  postCount: number;
  cityCount: number;
  cities: string[];
}

export default function HeroSection({ postCount, cityCount, cities }: Props) {
  const DOUBLE = cities.length > 0 ? [...cities, ...cities] : ["..."];
  const rootRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const h1aRef  = useRef<HTMLSpanElement>(null);
  const h1bRef  = useRef<HTMLSpanElement>(null);
  const h1cRef  = useRef<HTMLSpanElement>(null);
  const subRef  = useRef<HTMLParagraphElement>(null);
  const btnRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = [labelRef.current, h1aRef.current, h1bRef.current, h1cRef.current, subRef.current, btnRef.current];
      gsap.set(targets, { opacity: 0, y: 40 });

      gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(h1aRef.current,  { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
        .to(h1bRef.current,  { opacity: 1, y: 0, duration: 0.9 }, "-=0.72")
        .to(h1cRef.current,  { opacity: 1, y: 0, duration: 0.9 }, "-=0.72")
        .to(subRef.current,  { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(btnRef.current,  { opacity: 1, y: 0, duration: 0.6 }, "-=0.45");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden py-24 sm:py-32 border-b border-border">

      {/* Scrolling city names — background decoration */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 pointer-events-none select-none" aria-hidden>
        <MarqueeRow cities={DOUBLE} direction="left"  speed={60} />
        <MarqueeRow cities={DOUBLE} direction="right" speed={80} offset="-15s" />
        <MarqueeRow cities={DOUBLE} direction="left"  speed={50} offset="-30s" />
      </div>

      {/* Hero content */}
      <div className="relative z-10">
        <p ref={labelRef} className="label mb-7 block">
          {postCount > 0 ? `${postCount} posts · ` : ""}{cityCount > 0 ? `${cityCount} cities · ` : ""}remote life · real stories
        </p>

        {/* Three lines rather than two: "Living, Working" set at display size
            overflowed a 390px viewport. Each span is its own line, so the
            breaks are deliberate instead of whatever the browser picks. */}
        <h1 className="font-serif text-[3.5rem] sm:text-7xl lg:text-[6.5rem] font-bold text-ink leading-[0.95] tracking-[-0.03em] mb-7 max-w-4xl">
          <span ref={h1aRef} className="block">Living,</span>
          <span ref={h1bRef} className="block">Working</span>
          <span ref={h1cRef} className="block">&amp; Wandering.</span>
        </h1>

        <p ref={subRef} className="text-muted text-[1.0625rem] sm:text-xl max-w-lg leading-relaxed mb-10">
          Deep-dives into every city I&apos;ve called home — what it actually feels like to live and work there, not just visit.
        </p>

        {/* min-h-12 keeps both buttons at a 48px touch target. */}
        <div ref={btnRef} className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center min-h-12 px-7 bg-ink text-bg text-sm font-medium tracking-wide hover:bg-body transition-colors rounded-full"
          >
            Read All Posts
          </Link>
          <Link
            href="/cities"
            className="inline-flex items-center min-h-12 px-7 border border-border text-muted text-sm tracking-wide hover:border-ink hover:text-ink transition-colors rounded-full"
          >
            Browse Cities
          </Link>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  cities,
  direction,
  speed,
  offset = "0s",
}: {
  cities: string[];
  direction: "left" | "right";
  speed: number;
  offset?: string;
}) {
  const style: React.CSSProperties = {
    animation: `marquee-${direction} ${speed}s linear infinite`,
    animationDelay: offset,
  };

  return (
    // marquee-row is the hook the prefers-reduced-motion block in globals.css
    // uses to stop these — CSS keyframes can't be cancelled from the GSAP guard.
    <div className="marquee-row flex whitespace-nowrap" style={style}>
      {cities.map((city, i) => (
        <span
          key={i}
          className="font-serif font-bold mx-8 text-ink"
          style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", opacity: 0.04 }}
        >
          {city}
        </span>
      ))}
    </div>
  );
}
