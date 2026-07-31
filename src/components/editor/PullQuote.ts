import { Node, mergeAttributes } from "@tiptap/core";

/**
 * A pull quote — the editorial-voice marker: a line lifted out of the flow and
 * set large, with no quote rule. Distinct from StarterKit's Blockquote, which
 * stays available for actual citations.
 *
 * Renders `<blockquote class="pull">`, which `.prose blockquote.pull` styles.
 * Before this existed the CSS was unreachable: `toggleBlockquote()` emits a bare
 * `<blockquote>`, so nothing could ever carry the class.
 */
export const PullQuote = Node.create({
  name: "pullQuote",

  // Above Blockquote's default (100) so `blockquote.pull` is claimed before the
  // generic `blockquote` rule gets a chance at it.
  priority: 200,

  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "blockquote.pull" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["blockquote", mergeAttributes(HTMLAttributes, { class: "pull" }), 0];
  },
});
