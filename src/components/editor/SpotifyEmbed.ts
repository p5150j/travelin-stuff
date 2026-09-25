import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Spotify player embed — an atom block that renders the official
 * `open.spotify.com/embed` iframe. No API key, no script: Spotify's embed is
 * just a URL rewrite of the share link.
 *
 * The node stores only the embed `src`; the iframe's height is derived from
 * the content kind at render time (tracks get the compact player, everything
 * else the tall one), so the stored HTML round-trips deterministically.
 *
 * Old posts are untouched: this is a new tag no existing content contains,
 * and the parse rule claims only Spotify embed iframes — any other pasted
 * <iframe> is still stripped by the schema, as before.
 */

/**
 * Share link (or embed link) → canonical embed URL, dark theme.
 * Accepts track/album/playlist/episode/show/artist links, with or without
 * an intl segment ("/intl-de/"), query junk ("?si=…"), or an existing
 * "/embed/" prefix. Returns null for anything that isn't a Spotify link.
 */
export function toSpotifyEmbedUrl(input: string): string | null {
  const m = input.match(
    /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]+)/i
  );
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1].toLowerCase()}/${m[2]}?theme=0`;
}

/** Compact player for a single track; tall player for collections. */
export function spotifyEmbedHeight(src: string): number {
  return /\/embed\/track\//.test(src) ? 152 : 352;
}

export const SpotifyEmbed = Node.create({
  name: "spotifyEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe[src*="open.spotify.com/embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        height: String(spotifyEmbedHeight(HTMLAttributes.src ?? "")),
        loading: "lazy",
        allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
      }),
    ];
  },
});
