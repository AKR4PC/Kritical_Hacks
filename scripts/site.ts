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
 * This matters more than it looks: `canonical`, `og:url`, `robots.txt` and the
 * sitemap all derive from it, and a wrong value here does not merely omit a
 * hint — it tells a crawler to consolidate every signal onto an address that
 * does not serve the site. Change it here and every one of them follows.
 */
export const PRODUCTION_ORIGIN = 'https://kritical-hacks.vercel.app';

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
 * with the date printed in the search listing — the one thing on this site that
 * can outrank a plain blue link.
 *
 * The offline build runs overnight from 31 October into 1 November 2026.
 * Supplied as plain ISO 8601 dates rather than date-times: the exact hour the
 * doors open is not stated anywhere reliable, and a wrong clock time in a
 * search result is worse information than a date alone. Add a time offset
 * (`2026-10-31T09:00:00+05:30`) once it is fixed.
 *
 * Keep these in step with the copy — the masthead says `24 HOUR HACKATHON`, and
 * `EVENT_DURATION_TEXT` is what tells a crawler that is literal.
 */
export const EVENT_START_DATE: string | undefined = '2026-10-31';
export const EVENT_END_DATE: string | undefined = '2026-11-01';

/** ISO 8601 duration, matching the 24-hour build in the copy. */
export const EVENT_DURATION_TEXT: string | undefined = 'PT24H';

/**
 * When registration opened, which is what `offers.validFrom` describes. Note
 * this is deliberately *not* the event start date: the offer to enter is valid
 * from the moment registration goes live, weeks before anyone can attend.
 */
export const REGISTRATION_OPEN_DATE: string | undefined = '2026-10-03';