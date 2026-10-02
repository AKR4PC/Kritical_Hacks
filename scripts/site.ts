/**
 * Single source of truth for everything about this site as a *published
 * document* rather than a running app: where it lives, what it is called, and
 * how it should be described to a crawler or a chat client.
 *
 * These values are injected into `index.html` at build time by the plugin in
 * `vite.config.ts`, so there is exactly one place to change them.
 */

/**
 * The production origin, with no trailing slash.
 *
 * This matters more than it looks: `canonical`, `og:url` and the sitemap all
 * derive from it, and a wrong value here does not merely omit a hint — it
 * tells a crawler to consolidate every signal onto an address that does not
 * serve the site. Set it to the real domain (or the Vercel-generated
 * `*.vercel.app` address) before the first deployment.
 */
export const PRODUCTION_ORIGIN = 'https://kriticalhacks.vercel.app';

/** Absolute URL for a path relative to the site root. */
export function absoluteUrl(path: string): string {
  return new URL(path, PRODUCTION_ORIGIN + '/').href;
}

/**
 * The one-line identity of the event. Front-loaded with the exact phrase the
 * site should be found by, because a title is the single strongest on-page
 * relevance signal and the tail is what gets truncated in results anyway.
 */
export const SITE_TITLE = 'KriticalHacks 2026 — 24HR National Level Hackathon';

export const SITE_DESCRIPTION =
  'KriticalHacks 2026 is a 24 hour national level hackathon by AssetMerkle × IGDTUW, ' +
  'with TinyFish. Build web agents across the AI/ML and Web3 tracks. Prize pool worth 175K+. ' +
  'Register, check the guidelines and eligibility, and see the judges and mentors.';

/** Used for social cards and the search-results description. */
export const SITE_NAME = 'KriticalHacks 2026';

/** Shown as the publisher on social cards. */
export const SITE_PUBLISHER = 'AssetMerkle × IGDTUW';

/** Open Graph card size. Used only to assert the dimensions in the meta tags. */
export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** `/robots.txt` needs the absolute sitemap address to be worth publishing. */
export const SITEMAP_URL = absoluteUrl('/sitemap.xml');

/* ── Event dates ────────────────────────────────────────────────────────
 *
 * These drive the JSON-LD `Event` block, which is what can earn a rich result
 * with the date printed in the search listing. Left `undefined` they are simply
 * omitted from the markup — an absent date is neutral, whereas a guessed or
 * stale one is actively wrong information in the results. Set them once the
 * dates are fixed, in ISO 8601 with an offset (`2026-03-14T09:00:00+05:30`).
 *
 * A 24-hour event needs both bounds: `start` for when it opens and `end` for
 * when it closes, which is the morning after.
 */
export const EVENT_START_DATE: string | undefined = undefined;
export const EVENT_END_DATE: string | undefined = undefined;

/** ISO 8601 duration. Omitted unless known. */
export const EVENT_DURATION_TEXT: string | undefined = undefined;