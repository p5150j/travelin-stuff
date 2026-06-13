"use client";
import { useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Post } from "@/lib/posts";
import { slugify } from "@/lib/utils";
import { uploadAsset } from "@/lib/storage";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), { ssr: false });

interface Props {
  post: Post | null;
  onSave: (data: Omit<Post, "id">) => Promise<void>;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [city, setCity] = useState(post?.city ?? "");
  const [country, setCountry] = useState(post?.country ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!post) setSlug(slugify(v));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadAsset(file, "images");
      setCoverImage(url);
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const now = Timestamp.now();
    await onSave({
      title, slug, excerpt, content, city, country, coverImage,
      tags: [...new Set(tags.split(",").map((t) => t.trim()).filter(Boolean))],
      published,
      publishedAt: published ? (post?.publishedAt ?? now) : null,
      createdAt: post?.createdAt ?? now,
      updatedAt: now,
    });
    setSaving(false);
  }

  const inputCls = "w-full px-3 py-2.5 bg-white border border-[#e8e3d8] rounded-lg text-sm text-[#1c1a16] placeholder-[#c4bdb4] focus:outline-none focus:border-[#1c1a16] transition-colors";
  const labelCls = "block text-xs tracking-widest uppercase text-[#8a8074] mb-1.5";

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-10 pb-8 border-b border-[#e8e3d8]">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b6835] mb-1">CMS</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c1a16]">
            {post ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <button type="button" onClick={onCancel} className="text-sm text-[#8a8074] hover:text-[#1c1a16] transition-colors">
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>Slug</label>
          <input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={labelCls}>Cover Image</label>
          <div className="flex gap-2 items-center">
            <input className={inputCls} value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Paste URL or upload →" />
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
              className="shrink-0 px-4 py-2.5 border border-[#e8e3d8] rounded-lg text-sm text-[#8a8074] hover:border-[#1c1a16] hover:text-[#1c1a16] disabled:opacity-50 transition-colors"
            >
              {coverUploading ? "Uploading…" : "Upload"}
            </button>
          </div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="Cover preview" className="mt-3 h-36 w-full object-cover rounded-xl border border-[#e8e3d8]" />
          )}
        </div>

        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea className={inputCls} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="remote work, food, nightlife" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-10 h-6 rounded-full border transition-colors relative ${published ? "bg-[#1c1a16] border-[#1c1a16]" : "bg-transparent border-[#e8e3d8]"}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${published ? "translate-x-4" : "translate-x-0.5"}`} />
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="sr-only" />
          </div>
          <span className="text-sm text-[#1c1a16]">{published ? "Published" : "Draft"}</span>
        </label>

        <div className="flex gap-3 pt-4 border-t border-[#e8e3d8]">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#1c1a16] text-white text-sm font-medium rounded-lg hover:bg-[#3a3630] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save Post"}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-[#e8e3d8] text-[#8a8074] text-sm rounded-lg hover:border-[#1c1a16] hover:text-[#1c1a16] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
