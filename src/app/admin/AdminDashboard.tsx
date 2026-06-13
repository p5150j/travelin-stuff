"use client";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Post, getAllPosts, createPost, updatePost, deletePost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import PostEditor from "./PostEditor";

interface Props {
  user: User;
  onSignOut: () => void;
}

export default function AdminDashboard({ user, onSignOut }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const all = await getAllPosts(false);
    setPosts(all);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Omit<Post, "id">) {
    if (editing === "new") {
      await createPost(data);
    } else if (editing) {
      await updatePost(editing.id, data);
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    await load();
  }

  if (editing !== null) {
    return (
      <PostEditor
        post={editing === "new" ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    );
  }

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between mb-10 pb-8 border-b border-[#e8e3d8]">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8b6835] mb-1">CMS</p>
          <h1 className="font-serif text-2xl font-bold text-[#1c1a16]">Posts</h1>
          <p className="text-xs text-[#8a8074] mt-1">{user.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="px-4 py-2 bg-[#1c1a16] text-white text-sm font-medium rounded-lg hover:bg-[#3a3630] transition-colors"
          >
            + New Post
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 border border-[#e8e3d8] text-[#8a8074] text-sm rounded-lg hover:border-[#1c1a16] hover:text-[#1c1a16] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[#8a8074] text-center py-24">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-[#8a8074] text-center py-24">No posts yet — create your first one.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {[{ label: "Published", items: published }, { label: "Drafts", items: drafts }].map(({ label, items }) =>
            items.length === 0 ? null : (
              <div key={label}>
                <p className="text-xs tracking-widest uppercase text-[#8a8074] mb-3">{label} · {items.length}</p>
                <div className="flex flex-col gap-2">
                  {items.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 bg-white border border-[#e8e3d8] rounded-xl hover:border-[#1c1a16]/30 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[#1c1a16] font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8a8074]">
                          <span>{post.city}, {post.country}</span>
                          {post.publishedAt && (
                            <>
                              <span>·</span>
                              <time>{formatDate(post.publishedAt)}</time>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditing(post)}
                          className="text-xs text-[#8a8074] hover:text-[#1c1a16] px-3 py-1.5 border border-[#e8e3d8] rounded-lg hover:border-[#1c1a16] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 border border-[#e8e3d8] rounded-lg hover:border-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
