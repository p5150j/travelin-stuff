# Next Steps

Handoff notes as of **1 Aug 2026**. `CLAUDE.md` is the reference documentation —
this file is only what's *outstanding* and what to watch out for.

---

## Do these first

### 1. Deploy the Firestore rules — nothing else is blocked on it, but it's stale

`firestore.rules` in the repo scopes public reads to published posts. **That is not
live yet.** The deployed rules are still the original `allow read: if true`.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

**Deploy the code and the rules together.** If the rules land while an older build
is still serving, `/cities/[city]` and `/blog/[slug]` will throw permission errors —
the tightened read rule requires every unauthenticated query to carry
`where("published", "==", true)`, and the current code does, but an older deploy
doesn't. See *Firestore Rules — the query constraint* in `CLAUDE.md`.

### 2. Click-test the editor — none of it has been exercised

`/admin` is behind Google auth and the editor is a `dynamic({ ssr: false })`
import, so it cannot be reached from a server request. `npm run verify:editor`
covers the schema and serialisation; **everything interactive is unverified.**

Worth walking through:

- [ ] Insert an image → select it → **Caption** → type → save → reload. Caption
      should render under the photo, edge-to-edge on mobile with the caption
      inset.
- [ ] **Pull** button → type a line → save → reload. Should survive as
      `<blockquote class="pull">`, large serif, no quote rule.
- [ ] **Table** → tab between cells → `+Row`/`+Col`/`−Row`/`−Col`/`×Table`.
      Row/col buttons only appear while the cursor is inside a table.
- [ ] Open an **older post** (one written before captions existed), re-save, and
      confirm its content didn't change. There's a check for this in
      `verify:editor`, but confirm against real data.
- [ ] City **suggestion chips** appear; typing `vegas` when `Vegas` exists shows
      the case-clash warning and the "Use" button works.

### 3. Lock down writes — needs your Firebase Auth UID

Both `firestore.rules` and `storage.rules` still say `allow write: if request.auth != null`.
With Google Sign-In enabled that means **any Google account** can sign in and
create, edit, or delete posts. There's a `TODO` in `firestore.rules`.

Not urgent while nothing is deployed — the config isn't public yet, so nobody has
it. **It becomes urgent the moment the site goes live**, because
`NEXT_PUBLIC_*` vars ship in the client bundle by design, so anyone can pull them
out of the JS and write to Firestore directly without ever finding `/admin`.

Get the UID from Firebase Console → Authentication → Users, then in both files:

```
allow write: if request.auth != null && request.auth.uid == "<uid>";
```

Also gate `/admin` on the same uid rather than merely on a user being present,
and add a size cap to `storage.rules` (uploads are currently unbounded, and video
is allowed).

### 4. Pre-launch placeholders

- [ ] `yourdomain.com` → real domain in `src/app/layout.tsx`, `src/app/sitemap.ts`,
      `public/robots.txt`
- [ ] `public/og-default.jpg` (1200×630) — **does not exist**, so every OG card
      currently 404s
- [ ] Netlify env vars, and add the Netlify domain to Firebase → Authentication →
      Authorized Domains

---

## Design work remaining

The design research produced a ranked list; all of it is done except:

**Break the uniform grid.** The honest gap. Card aspect ratios vary by breakpoint,
but nothing on the site breaks its container or goes deliberately asymmetric. The
research called for full-bleed moments and one dominant column per row rather than
even grids.

**An off-black inverted section.** Along Dusty Roads uses white-on-near-black to
invert expectation and give routes contrast against each other. Would also address
the item above.

**`Inter` → a serif body.** Your taste call. Inter is a great *UI* face doing
*reading* face work, and it's the most generic sans on the web — one of the four
things the research named as separating "designed" from "could belong to anyone".
Fraunces or Newsreader at 17px would be warmer. Bigger visual change than anything
already shipped.

**Newsletter — explicitly skipped.** Every reference site has one and it's the top
audience-building gap, but it was declined for now and it brushes against the
"no user-facing complexity until asked" rule.

---

## Content strategy (from the research, not yet acted on)

Nothing here is built — it's direction for what to write, and it's what the data
blocks were built to serve.

**Three post tiers**, matched to effort:
- *Text only* — the journal entry. Cheap, daily-cadence-capable. The actual moat:
  almost nobody writes daily from one city for three months.
- *Text + images* — the deep-dive. The workhorse.
- *Text + images + video* — "day in the life". Tentpoles, a few per city.

The measured win is video **embedded in a text post** (+46% pageviews, +35s on
page), not video-only — which is what `VideoNode` already produces.

**Topics with real search demand:** visa guides with income thresholds,
cost-of-living breakdowns, wifi/internet speed, neighbourhood guides, coworking
reviews with real prices. These are what the `<table>` spec blocks are for.

**Voice:** unflinching. Real costs, not promotional pricing. Lows alongside highs.
Depth over frequency — one strong post a week beats five thin ones, partly because
thin content no longer surfaces in AI-mediated search at all.

---

## Gotchas a fresh session should know

**Data hygiene.** One or more posts may still have lowercase `city`/`country`
(`vegas`, `usa`). The editor now guards against creating new ones, but existing
records need fixing by hand. `getCities()` groups on the exact string while
`citySlug()` lowercases, so casing variants split a city into two stops sharing one
URL — and `getPostsByCity` is case-sensitive, so the losing variant's posts become
unreachable. Full explanation in `CLAUDE.md`.

**`/cities` date ranges are built on `publishedAt`,** a proxy for when you were
actually somewhere. Backfilling an old post shifts that city's range and can
reorder the route.

**The jump-nav on `/blog` is invisible with one year of posts** — it only renders
when there's more than one year group. Currently unverified for the multi-year
case.

**Never inline hex.** Use the palette tokens (`text-ink`, `border-border`, …).
There is currently zero inline hex in `src/` outside the `:root` definition.

**`--faint` fails contrast by design** — decorative only. `--muted` is the lightest
token safe for text.

**`Image` with `fill` always needs `sizes`.** Next's own dev warning caught three
missing ones already.

**Full-bleed media uses `-1.25rem` to match `px-5` page padding.** Change the page
padding and that CSS must change too.

**Tags were dropped from `PostCard`** during the design pass — deliberate, they
were noise as pills over the image. One-line restore if you disagree. Tags still
render on the post page itself.

---

## Verify everything still works

```bash
npm run lint            # should be zero errors, zero warnings
npx tsc --noEmit        # should be silent
npm run build           # 15 static pages at last run
npm run verify:editor   # 24 checks
npm run dev             # http://localhost:3000
```

**Load it on a real phone.** Mobile is the primary target and the type scale,
grain, and full-bleed media are things you have to see at arm's length — none of
that is verifiable from a terminal.
