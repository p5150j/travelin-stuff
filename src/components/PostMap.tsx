"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface Props {
  city: string;
  lat: number;
  lon: number;
}

/**
 * The "Where" block at the foot of a post: one city chip pinned on a dark
 * basemap. Deliberately a GRAPHIC, not a widget — every interaction is off
 * (no zoom, no drag), it just locates the post. Leaflet loads inside the
 * effect so none of it touches the server bundle.
 *
 * The CARTO key is hardcoded on purpose: basemap keys ship to every browser
 * in the tile URLs regardless — it's domain-restricted in the CARTO
 * dashboard, not hidden.
 */
export default function PostMap({ city, lat, lon }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;

      map = L.map(ref.current, {
        center: [lat, lon],
        zoom: 10,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        // Leaflet's attribution widget is library chrome; the license-required
        // OSM/CARTO credit renders below the map in our own type instead.
        attributionControl: false,
      });

      // NO detectRetina: it switches Leaflet to 128px tiles, which fights the
      // 257px seam-overlap rule in globals.css (tiles must stay 256-based).
      // The overlap is what actually kills the hairline seams at fractional
      // zoom/DPR; retina sharpness loses the trade.
      L.tileLayer(
        "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_4jei_1_a284ddb7a10f6ae720ffa171",
        { maxZoom: 19 }
      ).addTo(map);

      // divIcon with zero footprint; the .map-pin chip centers itself with a
      // CSS transform, so the name can be any length without anchor math.
      const icon = L.divIcon({
        className: "",
        html: `<div class="map-pin">${city}</div>`,
        iconSize: [0, 0],
      });
      L.marker([lat, lon], { icon, interactive: false, keyboard: false }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [city, lat, lon]);

  return (
    <div>
      <div
        ref={ref}
        aria-label={`Map showing ${city}`}
        className="h-56 sm:h-72 w-full rounded-xl overflow-hidden border border-border bg-raised"
      />
      {/* Required by the OSM (ODbL) and CARTO basemap licenses — kept, but as
          a spec footnote in our own type rather than Leaflet's overlay. */}
      <p className="meta mt-2 text-right normal-case tracking-normal">
        map data ©{" "}
        <a href="https://www.openstreetmap.org/copyright" className="hover:text-ink" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>{" "}
        · ©{" "}
        <a href="https://carto.com/attributions" className="hover:text-ink" target="_blank" rel="noopener noreferrer">
          CARTO
        </a>
      </p>
    </div>
  );
}
