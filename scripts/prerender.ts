import {
  CALLS_TO_ACTION,
  CARD_STACK,
  CLOSING,
  ELIGIBILITY,
  EVENT,
  GUIDELINES,
  INFO_BLOCKS,
  INTRO,
  MASTHEAD,
  SLOGANS,
  TRACKS,
} from '../src/content/copy';
import {
  EVENT_DURATION_TEXT,
  EVENT_END_DATE,
  EVENT_START_DATE,
  OG_IMAGE_PATH,
  PRODUCTION_ORIGIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
} from './site';

/**
 * A static, semantic rendering of the page's copy, written into `#root` at
 * build time.
 *
 * The app is a single-page experience: every chapter is mounted by React at
 * runtime, so the document a crawler receives is otherwise an empty
 * `<div id="root">` containing no words at all. Search engines can run
 * JavaScript, but they do it in a deferred second pass, on a schedule, and a
 * page whose entire substance is client-side is a weak candidate for a
 * brand-new domain competing on an exact-match query.
 *
 * This puts the same words in the same order into the served HTML. It is not a
 * separate description of the page and it is not hidden from anyone — it is
 * the page, and `createRoot` replaces it on boot with the live React tree. A
 * reader with JavaScript disabled, and a crawler on its first pass, both see
 * the real content.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

function esc(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

/** A short, plain-text version of a heading for use inside meta and JSON-LD. */
function plain(parts: readonly string[]): string {
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function list(items: readonly string[]): string {
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

/**
 * The bulletin prints half its lines as black bars until the reader hovers
 * them. For the static document the underlying sentence is the useful content,
 * so the redacted lines are emitted as the words they stand in for.
 */
function bulletinLines(): string[] {
  return INFO_BLOCKS.map((block) => block.truth ?? block.main);
}

export function renderPrerenderedBody(): string {
  const tracks = TRACKS.columns.map(
    (track) => `
      <section>
        <h3>${esc(track.title)}</h3>
        <p>${esc(track.subtitle)}</p>
        <p>${esc(track.description)}</p>
        <h4>Open to</h4>
        ${list(track.eligibility)}
        <h4>Prizes</h4>
        ${list(track.prizes)}
      </section>`
  ).join('');

  return `
<article>
  <header>
    <h1>${esc(EVENT.full)}</h1>
    <p>${esc(EVENT.format)} — ${esc(EVENT.organizerLine)}, with ${esc(EVENT.sponsor)}.</p>
  </header>

  <section>
    <h2>About ${esc(EVENT.full)}</h2>
    <p>${esc(INTRO.quote)}</p>
    <p>${esc(MASTHEAD.edition)}</p>
    <p>${esc(CALLS_TO_ACTION.map((c) => c.label).join(' · '))}</p>
  </section>

  <section>
    <h2>${esc(MASTHEAD.headline)}</h2>
    <p>${esc(MASTHEAD.kicker)} — ${esc(EVENT.organizerLine)} presents ${esc(EVENT.name)}.</p>
    ${list(bulletinLines())}
    <p>${esc(MASTHEAD.caption)}</p>
  </section>

  <section>
    <h2>${esc(EVENT.full)} Tracks</h2>
    <p>${esc(TRACKS.disclaimer)}</p>
    ${tracks}
  </section>

  <section>
    <h2>${esc(GUIDELINES.heading)}</h2>
    <p>${esc(GUIDELINES.subline)}</p>
    ${list(GUIDELINES.items)}
  </section>

  <section>
    <h2>${esc(ELIGIBILITY.heading)}</h2>
    <p>${esc(ELIGIBILITY.intro)}</p>
    <h3>${esc(ELIGIBILITY.student.label)}</h3>
    ${list(ELIGIBILITY.student.items)}
    <p>${esc(ELIGIBILITY.student.note)}</p>
    <h3>${esc(ELIGIBILITY.professional.label)}</h3>
    ${list(ELIGIBILITY.professional.items)}
    <p>${esc(ELIGIBILITY.footnote)}</p>
  </section>

  <section>
    <h2>${esc(CARD_STACK.heading)}</h2>
    <p>Judges and mentors for ${esc(EVENT.full)} will be announced shortly.</p>
  </section>

  <footer>
    <blockquote><p>${esc(CLOSING.quoteLines.join(' '))}</p></blockquote>
    <p>${esc(CLOSING.author)}</p>
    <p>${esc(CLOSING.credit)} ${esc(CLOSING.names)}</p>
    <p>${esc(SLOGANS.bottomRight)}</p>
  </footer>
</article>`.trim();
}

/**
 * JSON-LD describing the site and the event.
 *
 * Marking the page up as an `Event` is the one piece of this that can earn
 * something a plain blue-link result cannot: a rich card with the date in the
 * search results. Dates are emitted only when they have actually been set,
 * because a wrong or invented date is worse than no date at all.
 *
 * Serialised by hand rather than through `JSON.stringify` on an object so the
 * payload can stay predictable in the document head; every interpolated value
 * still goes through the same escape used for the body markup.
 */
export function renderStructuredData(): string {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${PRODUCTION_ORIGIN}/#website`,
        url: `${PRODUCTION_ORIGIN}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${PRODUCTION_ORIGIN}/#organizer` },
      },
      {
        '@type': 'Organization',
        '@id': `${PRODUCTION_ORIGIN}/#organizer`,
        name: EVENT.organizerLine,
        url: PRODUCTION_ORIGIN,
      },
      {
        '@type': 'Event',
        '@id': `${PRODUCTION_ORIGIN}/#event`,
        name: `${EVENT.full} — ${EVENT.format}`,
        alternateName: EVENT.full,
        description: SITE_DESCRIPTION,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        inLanguage: 'en',
        isAccessibleForFree: true,
        image: [absoluteUrl(OG_IMAGE_PATH)],
        url: `${PRODUCTION_ORIGIN}/`,
        ...(EVENT_START_DATE
          ? {
              startDate: EVENT_START_DATE,
              endDate: EVENT_END_DATE ?? EVENT_START_DATE,
              // Duration is only claimed when it is actually known.
              ...(EVENT_DURATION_TEXT ? { duration: EVENT_DURATION_TEXT } : {}),
            }
          : {}),
        organizer: { '@id': `${PRODUCTION_ORIGIN}/#organizer` },
        sponsor: { '@type': 'Organization', name: EVENT.sponsor, url: 'https://www.tinyfish.ai/' },
        location: {
          '@type': 'Place',
          name: 'Indraprastha Institute of Information Technology, Delhi',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'New Delhi',
            addressRegion: 'Delhi',
            addressCountry: 'IN',
          },
        },
        offers: {
          '@type': 'Offer',
          url: CALLS_TO_ACTION[0].href,
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          ...(EVENT_START_DATE ? { validFrom: EVENT_START_DATE } : {}),
        },
      },
    ],
  };

  // `</script>` inside a JSON payload would close the tag early.
  return JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
}

export { plain };