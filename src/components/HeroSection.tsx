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
  const subRef  = useRef<HTMLParagraphElement>(null);
  const btnRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([labelRef.current, h1aRef.current, h1bRef.current, subRef.current, btnRef.current], {
        opacity: 0,
        y: 40,
      });

      gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(h1aRef.current,  { opacity: 1, y: 0, duration: 0.9 }, "-=0.4")
        .to(h1bRef.current,  { opacity: 1, y: 0, duration: 0.9 }, "-=0.65")
        .to(subRef.current,  { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(btnRef.current,  { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden py-24 sm:py-32 border-b border-[#e8e3d8]">

      {/* Scrolling city names — background decoration */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 pointer-events-none select-none" aria-hidden>
        <MarqueeRow cities={DOUBLE} direction="left"  speed={60} />
        <MarqueeRow cities={DOUBLE} direction="right" speed={80} offset="-15s" />
        <MarqueeRow cities={DOUBLE} direction="left"  speed={50} offset="-30s" />
      </div>

      {/* Hero content */}
      <div className="relative z-10">
        <p ref={labelRef} className="text-xs tracking-[0.35em] uppercase text-[#8b6835] mb-6">
          {postCount > 0 ? `${postCount} posts · ` : ""}{cityCount > 0 ? `${cityCount} cities · ` : ""}remote life · real stories
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-[6rem] font-bold text-[#1c1a16] leading-[1.02] mb-7 max-w-4xl">
          <span ref={h1aRef} className="block">Living, Working</span>
          <span ref={h1bRef} className="block">& Wandering.</span>
        </h1>

        <p ref={subRef} className="text-[#8a8074] text-lg sm:text-xl max-w-lg leading-relaxed mb-10">
          Deep-dives into every city I&apos;ve called home — what it actually feels like to live and work there, not just visit.
        </p>

        <div ref={btnRef} className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="px-7 py-3 bg-[#1c1a16] text-[#faf9f6] text-sm font-medium tracking-wide hover:bg-[#3a3630] transition-colors rounded-full"
          >
            Read All Posts
          </Link>
          <Link
            href="/cities"
            className="px-7 py-3 border border-[#e8e3d8] text-[#8a8074] text-sm tracking-wide hover:border-[#1c1a16] hover:text-[#1c1a16] transition-colors rounded-full"
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
    <div className="flex whitespace-nowrap" style={style}>
      {cities.map((city, i) => (
        <span
          key={i}
          className="font-serif font-bold mx-8 text-[#1c1a16]"
          style={{ fontSize: "clamp(2rem,5vw,4.5rem)", opacity: 0.035 }}
        >
          {city}
        </span>
      ))}
    </div>
  );
}
