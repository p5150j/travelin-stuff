/**
 * Headless checks on the TipTap editor's schema and custom node serialisation.
 *
 * Why this exists: /admin is behind Google auth AND the editor is a dynamic
 * `ssr: false` import, so nothing about it is reachable from a server request.
 * A schema conflict (duplicate node name, one extension stealing another's parse
 * rule) or a broken renderHTML would otherwise only show up by clicking around
 * in a browser — and a broken parseHTML silently corrupts stored content on
 * re-save, which is the expensive kind of bug.
 *
 * Run: npm run verify:editor
 *
 * Not a substitute for clicking. It cannot test keyboard behaviour, node views,
 * or anything that needs a DOM.
 */
import { getSchema } from "@tiptap/core";
import { editorExtensions } from "../src/components/editor/extensions";
import { CaptionedImage } from "../src/components/editor/CaptionedImage";
import { PullQuote } from "../src/components/editor/PullQuote";

let failures = 0;

function ok(name: string, cond: boolean, detail = "") {
  if (!cond) failures++;
  console.log(`${cond ? "  ok  " : " FAIL "} ${name}${cond ? "" : "  → " + detail}`);
}

function eq(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  ok(name, a === e, `got ${a}, expected ${e}`);
}

console.log("\nschema");
console.log("──────");

// getSchema throws on duplicate node/mark names, so reaching the next line at
// all is meaningful.
const schema = getSchema(editorExtensions as never);
const nodes = Object.keys(schema.nodes);

for (const n of ["table", "tableRow", "tableCell", "tableHeader"]) {
  ok(`table node "${n}" registered`, nodes.includes(n));
}
ok('custom node "pullQuote" registered', nodes.includes("pullQuote"));
ok('custom node "video" registered', nodes.includes("video"));
ok('"image" kept its name (CaptionedImage extends, not replaces)', nodes.includes("image"));
ok('"blockquote" survives alongside pullQuote', nodes.includes("blockquote"));
ok("link mark survives StarterKit link:false", "link" in schema.marks);
ok("underline mark survives StarterKit underline:false", "underline" in schema.marks);

const imageAttrs = Object.keys(schema.nodes.image.spec.attrs ?? {});
ok(`image has a "caption" attr (${imageAttrs.join(", ")})`, imageAttrs.includes("caption"));
ok("pullQuote and blockquote are distinct types", schema.nodes.pullQuote !== schema.nodes.blockquote);

try {
  const cell = schema.nodes.tableCell.createAndFill();
  const row = schema.nodes.tableRow.create(null, cell ? [cell, cell] : []);
  const table = schema.nodes.table.create(null, [row]);
  ok("a table builds from the schema", table.childCount === 1 && row.childCount === 2);
} catch (e) {
  ok("a table builds from the schema", false, String(e));
}

try {
  const pq = schema.nodes.pullQuote.create(null, schema.text("Rent is not what the spreadsheets say."));
  ok("pullQuote accepts inline text", pq.textContent.startsWith("Rent"));
} catch (e) {
  ok("pullQuote accepts inline text", false, String(e));
}

console.log("\nserialisation");
console.log("─────────────");

const ctx = { options: { HTMLAttributes: {} } };
const renderImage = CaptionedImage.config.renderHTML!.bind(ctx as never);

// The critical one: content with no caption must serialise byte-identically to
// stock Image output, so existing posts survive a re-save untouched.
eq(
  "no caption → bare <img>, unchanged from stock Image",
  renderImage({ HTMLAttributes: { src: "a.jpg", alt: "A" } } as never),
  ["img", { src: "a.jpg", alt: "A" }]
);

eq(
  "caption → figure > img + figcaption, data-caption not leaked onto img",
  renderImage({ HTMLAttributes: { src: "a.jpg", alt: "A", "data-caption": "Alfama, 7am" } } as never),
  ["figure", {}, ["img", { src: "a.jpg", alt: "A" }], ["figcaption", {}, "Alfama, 7am"]]
);

const rules = CaptionedImage.config.parseHTML!.call(ctx as never) as {
  tag: string;
  getAttrs?: (el: unknown) => unknown;
}[];
eq("parse rules: figure first, then bare img", [rules[0].tag, rules[1].tag], ["figure", "img[src]"]);

/** Minimal element stand-in — getAttrs only calls querySelector/getAttribute. */
function fakeFigure(img: Record<string, string> | null, caption?: string) {
  return {
    querySelector(sel: string) {
      if (sel === "img") return img ? { getAttribute: (k: string) => img[k] ?? null } : null;
      if (sel === "figcaption") return caption === undefined ? null : { textContent: caption };
      return null;
    },
  };
}

const getAttrs = rules[0].getAttrs!;

eq(
  "figure + figcaption → attrs extracted, caption trimmed",
  getAttrs(fakeFigure({ src: "b.jpg", alt: "B" }, "  Trimmed me  ")),
  { src: "b.jpg", alt: "B", title: null, caption: "Trimmed me" }
);
eq(
  "figure without figcaption → caption null",
  getAttrs(fakeFigure({ src: "b.jpg", alt: "B" })),
  { src: "b.jpg", alt: "B", title: null, caption: null }
);
eq(
  "blank figcaption → null, not empty string",
  getAttrs(fakeFigure({ src: "b.jpg" }, "   ")),
  { src: "b.jpg", alt: null, title: null, caption: null }
);
eq(
  "figure with no img → false, so other extensions get a shot",
  getAttrs(fakeFigure(null)),
  false
);

eq(
  "pullQuote renders blockquote.pull with a content hole",
  PullQuote.config.renderHTML!.call({ options: {} } as never, { HTMLAttributes: {} } as never),
  ["blockquote", { class: "pull" }, 0]
);
eq(
  "pullQuote claims only blockquote.pull, never bare blockquote",
  (PullQuote.config.parseHTML!.call({ options: {} } as never) as { tag: string }[]).map((r) => r.tag),
  ["blockquote.pull"]
);
ok("pullQuote outranks Blockquote's default priority of 100", PullQuote.config.priority === 200);

console.log(
  failures === 0 ? "\nall checks passed\n" : `\n${failures} CHECK(S) FAILED\n`
);
process.exit(failures === 0 ? 0 : 1);
