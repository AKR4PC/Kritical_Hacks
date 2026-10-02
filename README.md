# KriticalHacks 2026

A 24 hour national level hackathon, presented as an Orwellian newsprint experience.
Six chapters pinned to a fixed viewport, cut between each other with RGB tears,
television static and a long blackout.

Organised by **AssetMerkle × IGDTUW**, with **TinyFish** as the required
integration.

Built on a pixel-for-pixel recreation of [orwell.byholm.co](https://orwell.byholm.co/).
The design system is the original's and is deliberately untouched: same sections,
same scroll geometry, same 3D hero, same transitions, same type. Only the words
changed.

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build
```

## Finding the site

The experience is a single scroll-driven page, so there is exactly one URL worth
indexing, and the whole job is making sure a crawler can see that URL's worth
without running anything.

`scripts/site.ts` holds the production origin and the published identity. A
plugin in `vite.config.ts` (`kriticalhacks:publish-document`) reads it at build
time and writes into `index.html`:

- **Prerendered body.** Without this the served document is an empty
  `<div id="root">` — every visible word arrives with React, so a crawler's
  first pass sees a title and nothing else. The plugin emits the same copy as a
  plain semantic outline (`h1`–`h4`, lists, sections), generated from
  `src/content/copy.ts` so it cannot drift from the live page. `createRoot`
  replaces it on boot, so nothing is duplicated and nothing is hidden from a
  reader.
- **Canonical URL**, plus `hreflang`.
- **Open Graph and Twitter card**, pointing at `public/og-image.png` — the
  single largest driver of real traffic when a link is shared on WhatsApp.
- **JSON-LD** for `WebSite`, `Organization` and `Event`. The `Event` node is
  the one piece that can earn something a plain blue link cannot: a rich result
  with the date in it. The offline build is marked 31 Oct – 1 Nov 2026 with a
  24-hour duration, and the offer carries a `validFrom` for the day
  registration opened rather than the event's start date.
- **`robots.txt` and `sitemap.xml`**, emitted into `dist/` rather than
  committed, since both have to carry the absolute origin.

Two things are deliberately absent, and both are the same mistake: no extra
keyword meta tag (ignored for ranking, and a spam signal), and no
`robots.txt` that blocks anything a reader needs. A crawler reaching a page
that is not worth indexing is a symptom, not a cure.

The one lever that outranks all of the above is not technical. On a brand-new
domain with no inbound links, Google is judging the site's trust as much as its
text — mentions of the event from the organisers, the college, Unstop, and
participants carry more weight than anything in this file. Point the search
console at the deployed domain and submit the sitemap.

## The chapters

| # | Chapter | What happens |
|---|---------|--------------|
| 0 | Hero | A 3D hand hangs `2 0 2 6` on four strings in a field of watching eyes, framed by **Kritical** / **Hacks**, **AssetMerkle × IGDTUW**, the TinyFish wordmark, **24HR Hackathon** and **Let's Build Together** |
| 2 | The pitch | A line of prisoners drawn in path by path; the statement rises word by word, with the registration plates under it |
| 3 | The bulletin | A sheet of newsprint unrolls 720°. **PRIZE POOL WORTH 175K+** is the only block set in reverse — black plate, red type |
| 4 | Tracks | An enormous face is drawn as a hairline stroke; the two build tracks sit under it, separated by a rule |
| 6 | The rulebook | Two columns of house rules and eligibility crawl in opposite directions around a turning black book |
| 7 | The card stack | Nine photographs of judges and mentors pile up, each tagged as it lands, and `2 + 2 = 5` resolves out of the blast |
| 8 | The last page | Newsprint, the last line, and the credits |

Scroll up at any point and the chapters reassemble in reverse. The numbering is
the recreation's own — it has no chapter 1 or 5.

## How it is put together

The components own the markup; everything that animates lives in plain modules
under `src/lib`, because GSAP timelines, WebGL contexts and a scroll state
machine are not React's business.

```
src/
  components/     presentational markup, one file per chapter
    illustrations/ the two inline SVGs, injected as raw markup so their
                   thousands of paths can be measured and drawn individually
  content/copy.ts every word on the page
  lib/
    env.ts            motion/viewport flags, sampled once at boot
    gsap.ts           GSAP + SplitText + the shared Lenis instance
    loaderController  typed title, the 3 / 20 / 24 / WELCOME counter, 620 ms
                      RGB-tear reveal
    grain.ts          coarse full-viewport film grain
    transitions.ts    glitch / static / blackout / mobile-fade scene cuts
    scrollDirector.ts the chapter state machine and every listener feeding it
    cursorLabel.ts    the word that follows the pointer instead of a cursor
    typewriter.ts     character-by-character reveal
    scenes/           one module per chapter's own behaviour
    three/            hero scene (hand, eyes, year digits) and the book scene
  styles/
    tokens.css    the palette, sampled from the source
    global.css    layout, the redaction hover states, both breakpoints
```

### Fixed sections, real scroll

Every chapter is `position: fixed` and mounted once. The page's scroll runway is
nothing but `body { height: 1200vh }` (900vh on phones), and `scrollDirector`
maps `scrollY` onto a fixed set of chapter boundaries. That is why the page can
be scrubbed backwards and forwards without any of the chapters fighting each
other.

### What was changed, and what was not

Changed: every string, the newspaper headline's reverse treatment, two call to
action plates, the two-track body inside chapter 4, the chapter 6 columns, the
judge/mentor tags, and one added heading. Nothing else.

Kept on purpose, even though it looks like a bug: the source declares a
fractal-noise paper texture on the bulletin and then its own inline `background`
shorthand resets `background-image` to `none`, so the sheet is a flat tone. The
portrait's `stroke-width: 85` is in the SVG's own user units, so it inks a
hairline face rather than a slab.

One judgement call worth stating: the stack settles within about 24px of itself,
so nine tags held open at once stack into an illegible yellow smear. Each tag
therefore prints itself as its card lands and strikes the previous one — the
roster reads `MENTOR #1 → … → JUDGE #3` in scroll order, mentors landing first at
the foot of the stack and judges on top, and two tags never collide.

Two layout fixes were structural rather than cosmetic. The bulletin headline is
the one child of its column carrying `overflow: hidden`, so any flex shrink
silently cropped it — on a 1366×768 laptop it wrapped to two lines, overflowed
the column, and lost 66px of type, which is why `175K+` seemed to dissolve into
the black plate. It now sets `flex-shrink: 0` and is sized to hold one line. And
the tracks overlay's `6%` inset resolves against the element's *width*, not its
height, so on a short, wide laptop the TRACKS heading was eating a third of the
screen and landing on the first track. The inset is now `min(6vw, 8vh)` and the
columns start at an offset derived from both that inset and the heading's own
type size, so the two stay apart from 320px to 1920px.

Analytics is `@vercel/analytics/react` rather than `/next`: the `/next` entry
imports `next/navigation` at module scope, which does not exist in a Vite app
and fails the build.

## Accessibility

The experience is scroll-driven, so it works from the keyboard. Motion is
respected: with `prefers-reduced-motion: reduce` every timeline resolves to its
final state, the film grain and the custom cursor label switch off, and smooth
scrolling is replaced by native scrolling. The one chapter that leaves you alone
— the last page — restores the real system cursor. Every external link opens in
a new tab with `rel="noopener noreferrer"`.
