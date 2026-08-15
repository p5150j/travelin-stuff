"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import EditorToolbar from "./EditorToolbar";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[480px] px-6 py-5 focus:outline-none prose-editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // sync external value changes (e.g. loading existing post)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    // No overflow-hidden here — it would break the toolbar's position:sticky.
    // Rounding lives on the children instead.
    <div className="border border-stone-300 rounded-xl focus-within:ring-2 focus-within:ring-orange-400">
      <EditorContent editor={editor} className="rounded-t-xl overflow-hidden" />
      <EditorToolbar editor={editor} />
    </div>
  );
}
