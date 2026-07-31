import { MetadataRoute } from "next";
import { getAllPosts, getCities } from "@/lib/posts";
import { citySlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://yourdomain.com";

  const posts = await getAllPosts(true).catch(() => []);
  const cities = await getCities().catch(() => []);

  const postUrls = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt?.toDate() ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cityUrls = cities.map(({ city }) => ({
    url: `${base}/cities/${citySlug(city)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...postUrls,
    ...cityUrls,
  ];
}
