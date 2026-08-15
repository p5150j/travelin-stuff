"use client";
import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import { uploadAsset } from "@/lib/storage";

interface Props {
  editor: Editor;
}

type UploadType = "image" | "video" | null;

export default function EditorToolbar({ editor }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadType>(null);
  const [progress, setProgress] = useState(0);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("image");
    setProgress(0);
    try {
      const url = await uploadAsset(file, "images", setProgress);
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("video");
    setProgress(0);
    try {
      const url = await uploadAsset(file, "videos", setProgress);
      editor.chain().focus().insertContent({ type: "video", attrs: { src: url } }).run();
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  }

  function setLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  /** Caption lives as an attribute on the image node, so this edits the
      currently selected image rather than inserting anything. */
  function setCaption() {
    const prev = editor.getAttributes("image").caption;
    const caption = window.prompt("Caption", prev ?? "");
    if (caption === null) return;
    editor
      .chain()
      .focus()
      .updateAttributes("image", { caption: caption.trim() || null })
      .run();
  }

  const imageSelected = editor.isActive("image");
  const inTable = editor.isActive("table");

  const btn = (active: boolean) =>
    `p-1.5 rounded text-sm transition-colors ${
      active
        ? "bg-stone-800 text-white"
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
    }`;

  const divider = <div className="w-px h-5 bg-stone-200 mx-1" />;

  return (
    // Sticky to the BOTTOM of the viewport: on a long post the cursor is in the
    // middle of the screen and the top of the editor is hundreds of pixels away,
    // so a top toolbar meant scrolling away from what you'd just selected. The
    // bar rides the viewport bottom while any part of the editor is in view and
    // settles at the editor's end, so it never covers the fields below the form.
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-stone-50 border-t border-stone-200 rounded-b-xl sticky bottom-0 z-20">
      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))} title="Heading 1">H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="Heading 2">H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="Heading 3">H3</button>

      {divider}

      {/* Inline marks */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Bold"><strong>B</strong></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italic"><em>I</em></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Underline"><span className="underline">U</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))} title="Strikethrough"><span className="line-through">S</span></button>

      {divider}

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(editor.isActive({ textAlign: "left" }))} title="Align left">
        <AlignLeftIcon />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(editor.isActive({ textAlign: "center" }))} title="Align center">
        <AlignCenterIcon />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btn(editor.isActive({ textAlign: "right" }))} title="Align right">
        <AlignRightIcon />
      </button>

      {divider}

      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Bullet list">
        <ListIcon />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Numbered list">
        <ListOrderedIcon />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Blockquote">
        <QuoteIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleNode("pullQuote", "paragraph").run()}
        className={btn(editor.isActive("pullQuote")) + " flex items-center gap-1"}
        title="Pull quote — a line lifted out of the flow, set large"
      >
        <QuoteIcon />
        <span className="text-xs">Pull</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))} title="Code block">
        <CodeIcon />
      </button>

      {divider}

      {/* Link */}
      <button type="button" onClick={setLink} className={btn(editor.isActive("link"))} title="Link">
        <LinkIcon />
      </button>

      {divider}

      {/* Media */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />

      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        disabled={!!uploading}
        className={btn(false) + " flex items-center gap-1"}
        title="Upload image"
      >
        <ImageIcon />
        <span className="text-xs">{uploading === "image" ? `${Math.round(progress)}%` : "Image"}</span>
      </button>

      <button
        type="button"
        onClick={() => videoInputRef.current?.click()}
        disabled={!!uploading}
        className={btn(false) + " flex items-center gap-1"}
        title="Upload video"
      >
        <VideoIcon />
        <span className="text-xs">{uploading === "video" ? `${Math.round(progress)}%` : "Video"}</span>
      </button>

      {/* Only meaningful with an image selected — click the image first. */}
      <button
        type="button"
        onClick={setCaption}
        disabled={!imageSelected}
        className={btn(imageSelected && !!editor.getAttributes("image").caption) + " flex items-center gap-1 disabled:opacity-30"}
        title={imageSelected ? "Add or edit caption" : "Select an image first"}
      >
        <CaptionIcon />
        <span className="text-xs">Caption</span>
      </button>

      {divider}

      {/* Data table. Starts 3×2 with a header row — the shape of a cost
          breakdown, which is the main thing these are for. */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()
        }
        className={btn(false) + " flex items-center gap-1"}
        title="Insert data table (cost breakdown, specs)"
      >
        <TableIcon />
        <span className="text-xs">Table</span>
      </button>

      {/* Row/column controls only exist while the cursor is inside a table —
          otherwise they're six dead buttons cluttering the bar. */}
      {inTable && (
        <>
          <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={btn(false)} title="Add row below">+Row</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className={btn(false)} title="Delete row">−Row</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={btn(false)} title="Add column right">+Col</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className={btn(false)} title="Delete column">−Col</button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={btn(false) + " text-red-500"} title="Delete table">×Table</button>
        </>
      )}

      {divider}

      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Divider">—</button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false) + " disabled:opacity-30"} title="Undo">↩</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false) + " disabled:opacity-30"} title="Redo">↪</button>
    </div>
  );
}

function AlignLeftIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" /></svg>;
}
function AlignCenterIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" /></svg>;
}
function AlignRightIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" /></svg>;
}
function ListIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" /></svg>;
}
function ListOrderedIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 14h2l-2 4h2" /></svg>;
}
function QuoteIcon() {
  return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>;
}
function CodeIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
}
function LinkIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
}
function ImageIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>;
}
function TableIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16v14H4z M4 10h16 M10 10v9" /></svg>;
}
function CaptionIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16v10H4z M6 19h9" /></svg>;
}
function VideoIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" /></svg>;
}
