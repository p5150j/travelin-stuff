/**
 * Absolute origin for metadata, OG tags, sitemap and robots.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this in Netlify once a custom domain is live.
 *  2. URL — Netlify injects the site's main address at build time.
 *  3. localhost — dev.
 *
 * Only ever read server-side (metadata, sitemap, robots), so `URL` not being a
 * NEXT_PUBLIC_ var is fine.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "Wandering & Working";
