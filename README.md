# Wandering & Working

A travel blog documenting two years of living and working remotely — deep-dives into cities
actually lived in, not just visited. Next.js 16 App Router frontend with a Firebase-backed
CMS at `/admin`.

## Getting started

```bash
npm install
npm run dev
```

Requires a `.env.local` with the Firebase web config (gitignored, never commit it):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Values come from Firebase Console → Project Settings → Your apps.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint — should be zero errors |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · TipTap (rich text) · GSAP +
ScrollTrigger · Firebase (Firestore, Auth, Storage) · deployed to Netlify via
`@netlify/plugin-nextjs`.

## Writing posts

Go to `/admin` and sign in with Google. The dashboard lists published posts and drafts; the
editor handles cover images, inline image/video uploads to Firebase Storage, tags, and a
publish toggle. Drafts are visible only in `/admin` — public routes 404 on an unpublished slug.

Public pages are ISR with a 60s revalidate, so a newly published post appears within a minute
without a rebuild.

## Firebase

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Read `CLAUDE.md` before changing `firestore.rules` — public reads are scoped to published
posts, and Firestore *rejects* rather than filters queries that don't carry a matching
`where("published", "==", true)`. That section explains the constraint and which queries
depend on it.

`functions/` is the untouched Firebase template; nothing is deployed from it.

## Architecture notes

`CLAUDE.md` is the real documentation — data model, route table, admin flow, editor internals,
animation conventions, and the deployment checklist.
