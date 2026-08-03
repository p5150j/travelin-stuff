import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Replaces the old static `public/robots.txt`, which hardcoded
 * `Sitemap: https://yourdomain.com/sitemap.xml` — a domain that isn't ours. A
 * static file can't read the deploy URL, so this had to become a route.
 *
 * A `public/robots.txt` would take precedence over this, so that file is gone.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
