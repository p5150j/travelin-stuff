"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapStop {
  city: string;
  href: string;
  lat: number;
  lon: number;
  /** 1-based stop number — matches the numbered list below the map. */
  n: number;
}

/**
 * The route, drawn: dark Carto basemap (no API key), a dashed yellow line
 * connecting the stops in travel order, and square yellow markers carrying
 * the same mono stop numbers as the list. Leaflet is loaded inside the
 * effect so none of it touches the server bundle; the div renders as a
 * placeholder until then. Markers are divIcons, so Leaflet's default icon
 * image assets (which break under bundlers) are never requested.
 */
export default function CityMap({ stops }: { stops: MapStop[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;

      map = L.map(ref.current, {
        scrollWheelZoom: false, // page scroll must win on a tall page
        zoomControl: true,
      });

      /* CARTO's dark basemap. The key is deliberately hardcoded: basemap keys
         ship to every browser in the tile URLs regardless, so an env var only
         adds indirection — restrict it by domain in the CARTO dashboard. */
      L.tileLayer(
        "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_4jei_1_a284ddb7a10f6ae720ffa171",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      const latlngs = stops.map((s) => [s.lat, s.lon] as [number, number]);

      L.polyline(latlngs, {
        color: "#FDE102",
        weight: 2,
        dashArray: "6 8",
        opacity: 0.75,
      }).addTo(map);

      for (const s of stops) {
        const icon = L.divIcon({
          className: "", // suppress Leaflet's default white box
          html: `<div class="map-stop">${String(s.n).padStart(2, "0")}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        L.marker([s.lat, s.lon], { icon })
          .addTo(map)
          .bindPopup(`<a href="${s.href}">${s.city}</a>`);
      }

      map.fitBounds(L.latLngBounds(latlngs).pad(0.25));
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [stops]);

  return (
    <div
      ref={ref}
      aria-label="Map of the route"
      className="h-[320px] sm:h-[440px] w-full rounded-xl overflow-hidden border border-border bg-raised"
    />
  );
}
