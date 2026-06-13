import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  city: string;
  country: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function toPost(id: string, data: DocumentData): Post {
  return { id, ...data } as Post;
}

export async function getAllPosts(publishedOnly = true): Promise<Post[]> {
  const constraints = publishedOnly
    ? [where("published", "==", true), orderBy("publishedAt", "desc")]
    : [orderBy("createdAt", "desc")];
  const q = query(collection(db, "posts"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostsByCity(city: string): Promise<Post[]> {
  const q = query(collection(db, "posts"), where("city", "==", city));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => toPost(d.id, d.data()))
    .filter((p) => p.published)
    .sort((a, b) => (b.publishedAt?.toMillis() ?? 0) - (a.publishedAt?.toMillis() ?? 0));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toPost(snap.docs[0].id, snap.docs[0].data());
}

export async function createPost(data: Omit<Post, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "posts"), data);
  return ref.id;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<void> {
  await updateDoc(doc(db, "posts", id), { ...data, updatedAt: Timestamp.now() });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, "posts", id));
}

export async function getCities(): Promise<{ city: string; country: string; count: number }[]> {
  const posts = await getAllPosts(true);
  const map = new Map<string, { city: string; country: string; count: number }>();
  for (const p of posts) {
    const key = p.city;
    if (map.has(key)) {
      map.get(key)!.count++;
    } else {
      map.set(key, { city: p.city, country: p.country, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
