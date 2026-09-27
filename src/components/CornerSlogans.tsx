import { EVENT_NAME_SPLIT, SLOGANS, SPONSOR_LOGO } from '../content/copy';

/** The wordmark ships with intrinsic width/height, which would fight the layout. */
const LOGO_IMG_STYLE = { width: 'auto' } as const;

/**
 * The hero's frame. Three slogans in the corners, the TinyFish wordmark holding
 * the top-right slot where "WAR IS PEACE" used to sit, and the event name split
 * either side of the hanging year.
 *
 * All five sit behind every chapter after the hero, so they are only ever seen
 * against the red field.
 */
export function CornerSlogans() {
  return (
    <>
      <div id="top-left" className="corner">
        {SLOGANS.topLeft}
      </div>

      <a
        id="top-right"
        className="corner corner-logo"
        href={SPONSOR_LOGO.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={SPONSOR_LOGO.src} alt={SPONSOR_LOGO.alt} style={LOGO_IMG_STYLE} />
      </a>

      <div id="bottom-left" className="corner">
        {SLOGANS.bottomLeft}
      </div>
      <div id="bottom-right" className="corner">
        {SLOGANS.bottomRight}
      </div>

      {/* The event name, bracketing the year the hand is holding. */}
      <div id="name-left" className="corner corner-name">
        {EVENT_NAME_SPLIT.left}
      </div>
      <div id="name-right" className="corner corner-name">
        {EVENT_NAME_SPLIT.right}
      </div>
    </>
  );
}
