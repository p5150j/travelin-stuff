import type { Metadata } from "next";
import Link from "next/link";
import { getCities } from "@/lib/posts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cities",
  description: "Every city I've lived and worked from — browse posts by location.",
};

export default async function CitiesPage() {
  const cities = await getCities().catch(() => []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <div className="border-b border-[#e8e3d8] pb-10 mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-[#8b6835] mb-4">Locations</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1c1a16]">Cities</h1>
        <p className="text-[#8a8074] mt-3">{cities.length} cities covered so far.</p>
      </div>

      {cities.length === 0 ? (
        <p className="text-[#8a8074] text-center py-24">No cities yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cities.map(({ city, country, count }) => (
            <Link
              key={city}
              href={`/cities/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, "-"))}`}
              className="group flex items-center justify-between p-6 bg-white border border-[#e8e3d8] rounded-2xl hover:border-[#1c1a16] transition-all"
            >
              <div>
                <p className="font-serif text-lg font-bold text-[#1c1a16]">{city}</p>
                <p className="text-sm text-[#8a8074] mt-0.5">{country}</p>
              </div>
              <span className="text-3xl font-bold text-[#e8e3d8] group-hover:text-[#1c1a16]/10 transition-colors tabular-nums">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
