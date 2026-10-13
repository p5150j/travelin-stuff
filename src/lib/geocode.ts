/**
 * City name → coordinates via Nominatim (OpenStreetMap's geocoder).
 *
 * Runs server-side only, during ISR renders of /cities. Results are cached
 * for 30 days through Next's fetch cache, so each city geocodes roughly once
 * per deploy — well inside Nominatim's 1 req/s usage policy, which also
 * requires the identifying User-Agent below. Callers should still request
 * cities SEQUENTIALLY, not in a Promise.all, for the cold-cache case.
 *
 * City names here are editorial, not canonical ("Australian Coastal"), so
 * resolution is best-effort: try "city, country", fall back to the country
 * alone, and return null rather than guessing when neither resolves — a
 * missing pin beats a wrong one.
 */

export interface GeoPoint {
  lat: number;
  lon: number;
}

async function query(q: string): Promise<GeoPoint | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      {
        headers: { "User-Agent": "WanderingAndWorking/1.0 (https://travel.arus.io)" },
        next: { revalidate: 60 * 60 * 24 * 30 },
      }
    );
    if (!res.ok) return null;
    const rows: { lat: string; lon: string }[] = await res.json();
    const hit = rows?.[0];
    if (!hit) return null;
    const lat = parseFloat(hit.lat);
    const lon = parseFloat(hit.lon);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  } catch {
    return null;
  }
}

export async function geocodeCity(city: string, country: string): Promise<GeoPoint | null> {
  const exact = await query(country ? `${city}, ${country}` : city);
  if (exact) return exact;
  return country ? query(country) : null;
}
