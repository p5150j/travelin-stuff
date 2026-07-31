import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TableKit } from "@tiptap/extension-table";
import { VideoNode } from "./VideoNode";
import { CaptionedImage } from "./CaptionedImage";
import { PullQuote } from "./PullQuote";

/**
 * The editor's schema, kept out of the React component so it can be built and
 * asserted against headlessly — the editor itself is behind Google auth and a
 * dynamic import, so a schema conflict (duplicate node name, a parse rule one
 * extension steals from another) would otherwise only surface in the browser.
 */
export const editorExtensions = [
  /* StarterKit v3 already bundles Link and Underline. Registering them again
     below made TipTap warn about duplicate extension names, and left it
     ambiguous whether the explicit Link.configure() below actually applied —
     so turn StarterKit's copies off and keep the configured ones. */
  StarterKit.configure({ link: false, underline: false }),
  Underline,
  CaptionedImage.configure({ inline: false, allowBase64: false }),
  PullQuote,
  /* Data tables — cost breakdowns, wifi/visa specs. Real <table> markup so the
     numbers stay machine-readable; these are the queries the content research
     says people actually search. resizable:false keeps the output free of
     colgroup widths, which would fight the responsive CSS. */
  TableKit.configure({ table: { resizable: false } }),
  Link.configure({
    openOnClick: false,
    // text-gold, not the old text-orange-700 — that was a stray Tailwind default
    // that made links in the editor a different colour from `.prose a` output.
    HTMLAttributes: { class: "text-gold underline underline-offset-2" },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Placeholder.configure({ placeholder: "Start writing your post…" }),
  VideoNode,
];
