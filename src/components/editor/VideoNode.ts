import { Node, mergeAttributes } from "@tiptap/core";

export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        class: "w-full rounded-xl my-4 max-h-[560px]",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const video = document.createElement("video");
      video.src = node.attrs.src;
      video.controls = true;
      video.className = "w-full rounded-xl my-4 max-h-[560px]";
      const wrapper = document.createElement("div");
      wrapper.appendChild(video);
      return { dom: wrapper };
    };
  },
});
