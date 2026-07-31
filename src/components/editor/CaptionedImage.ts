import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

/**
 * Image with an optional caption, rendered as semantic
 * `<figure><img><figcaption>`.
 *
 * The caption is an *attribute* rather than editable child content, which keeps
 * the node an atom — the same shape TipTap's Image already had, so `setImage()`
 * and every existing stored `<img>` keep working untouched. The trade is that
 * the caption is edited via a toolbar prompt rather than typed inline, matching
 * how the link button already works in this editor.
 *
 * Keeps the node name "image", so nothing else in the app needs to change.
 */
export const CaptionedImage = Image.extend({
  // Claim <figure> before any generic rule can take it.
  priority: 200,

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-caption"),
        renderHTML: (attrs) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        // Captioned form.
        tag: "figure",
        getAttrs: (el) => {
          const figure = el as HTMLElement;
          const img = figure.querySelector("img");
          if (!img) return false; // not our figure — let something else try
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            caption: figure.querySelector("figcaption")?.textContent?.trim() || null,
          };
        },
      },
      // Bare <img> — every post written before captions existed.
      { tag: "img[src]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { "data-caption": caption, ...imgAttrs } = HTMLAttributes;
    const img = ["img", mergeAttributes(this.options.HTMLAttributes, imgAttrs)];

    // No caption → plain <img>, identical to stock Image output. Keeps content
    // that never had a caption byte-for-byte unchanged on re-save.
    if (!caption) return img as ["img", Record<string, unknown>];

    return ["figure", {}, img, ["figcaption", {}, caption]];
  },
});
