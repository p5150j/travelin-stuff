import { ImageResponse } from "next/og";
import { siteName } from "@/lib/site";

/**
 * Generated default OG card, replacing the `public/og-default.jpg` that was
 * referenced everywhere but never existed — so every non-post share resolved to
 * a 404. Generating it means there's no binary to keep in sync with the palette,
 * and Next wires og:image/twitter:image automatically from this file.
 *
 * Individual posts override this with their own cover photo.
 *
 * Satori (what renders this) supports a subset of CSS: flexbox only, no
 * shorthand-heavy rules, and every element with more than one child needs an
 * explicit `display: flex`.
 */
export const alt = `${siteName} — a remote work travel blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#111111",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FDE102",
              fontWeight: 600,
            }}
          >
            Remote life · real stories
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#FDE102",
              fontWeight: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Living, Working</span>
            <span
              style={{
                backgroundColor: "#FDE102",
                color: "#111111",
                padding: "0 16px",
                marginLeft: -16,
                alignSelf: "flex-start",
              }}
            >
              &amp; Wandering.
            </span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#b3a83e",
              maxWidth: 760,
            }}
          >
            Deep-dives into every city I&apos;ve called home — what it actually
            feels like to live and work there, not just visit.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #FDE102",
            paddingTop: 28,
            fontSize: 24,
            color: "#FDE102",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {siteName}
        </div>
      </div>
    ),
    size
  );
}
