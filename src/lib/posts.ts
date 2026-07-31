import {
  collection,
  doc,
  getDocs,
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

// The `published` equality filter is load-bearing for security, not just
// correctness: firestore.rules scopes public reads to published posts, and
// Firestore *rejects* a query it can't prove stays inside the rule rather than
// filtering it. Drop the filter and this query fails for unauthenticated
// readers — which includes ISR on the server. Sorting stays in JS so no
// composite index is needed.
export async function getPostsByCity(city: string): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("published", "==", true),
    where("city", "==", city)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => toPost(d.id, d.data()))
    .sort((a, b) => (b.publishedAt?.toMillis() ?? 0) - (a.publishedAt?.toMillis() ?? 0));
}

// Published-only by design: an unpublished slug 404s instead of rendering the
// draft to anyone holding the URL. See the note on getPostsByCity for why the
// filter also has to be in the query rather than applied after the fetch.
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, "posts"),
    where("published", "==", true),
    where("slug", "==", slug),
    limit(1)
  );
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

/**
 * Distinct city+country pairs across the posts handed in — drafts included, so
 * the editor can suggest a city you've only drafted from. Pure; the caller
 * already holds the posts, so this costs no extra read.
 *
 * Exact strings are preserved rather than merged case-insensitively: if both
 * "Vegas" and "vegas" exist, the editor needs to SHOW both so the split is
 * visible instead of silently hidden.
 */
export function distinctCities(posts: Post[]): { city: string; country: string; count: number }[] {
  const map = new Map<string, { city: string; country: string; count: number }>();
  for (const p of posts) {
    if (!p.city) continue;
    const existing = map.get(p.city);
    if (existing) existing.count++;
    else map.set(p.city, { city: p.city, country: p.country ?? "", count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}

export interface CityEntry {
  city: string;
  country: string;
  count: number;
  /** Cover of the most recent post from the city; "" if none has one. */
  coverImage: string;
  firstAt: Timestamp | null;
  lastAt: Timestamp | null;
}

/**
 * One entry per city, ordered by when you first posted from it — /cities renders
 * these as a numbered journey, so the sort order IS the narrative.
 *
 * Caveat: the date range comes from `publishedAt`, which is a proxy for when you
 * were actually there. Backfilling old posts will skew a city's range and can
 * reorder the timeline. A dedicated arrivedAt/leftAt on the post would fix it.
 */
export async function getCities(): Promise<CityEntry[]> {
  const posts = await getAllPosts(true); // already publishedAt DESC
  const map = new Map<string, CityEntry>();

  for (const p of posts) {
    const entry = map.get(p.city);

    if (!entry) {
      map.set(p.city, {
        city: p.city,
        country: p.country,
        count: 1,
        coverImage: p.coverImage ?? "",
        firstAt: p.publishedAt,
        lastAt: p.publishedAt,
      });
      continue;
    }

    entry.count++;
    // Posts arrive newest-first, so the first cover we see is the most recent.
    if (!entry.coverImage && p.coverImage) entry.coverImage = p.coverImage;

    const t = p.publishedAt?.toMillis();
    if (t != null) {
      if (entry.firstAt == null || t < entry.firstAt.toMillis()) entry.firstAt = p.publishedAt;
      if (entry.lastAt == null || t > entry.lastAt.toMillis()) entry.lastAt = p.publishedAt;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => (a.firstAt?.toMillis() ?? 0) - (b.firstAt?.toMillis() ?? 0)
  );
}
