import { PORTRAIT_TEXT, TRACKS } from '../content/copy';
import { PortraitArt } from './illustrations';

/**
 * Chapter 3 — the portrait, now carrying the two build tracks. The face is
 * still inked in as a very thick stroke and still leans toward the cursor; the
 * heading is still laid across it word by word, and the two bare columns sit
 * under it separated by a single hairline.
 */
export function Section4Portrait() {
  return (
    <section
      id="section-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 48,
      }}
    >
      <div
        id="s4-vignette"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
      />

      <PortraitArt />

      {/* Overlay heading — the existing word-by-word reveal lands here */}
      <div
        id="s4-text"
        style={{
          opacity: 0,
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          justifyContent: 'center',
          gap: '1.5vw 2.5vw',
          padding: '6% 8%',
          zIndex: 2,
        }}
      >
        {PORTRAIT_TEXT}
      </div>

      {/* The two tracks, revealed with the heading */}
      <div id="s4-tracks">
        {TRACKS.columns.map((track) => (
          <div className="s4-track" key={track.title}>
            <div className="s4-track-title">{track.title}</div>
            <div className="s4-track-subtitle">{track.subtitle}</div>
            <p className="s4-track-body">{track.description}</p>

            <div className="s4-track-label">OPEN TO</div>
            <ul className="s4-track-list">
              {track.eligibility.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="s4-track-label">PRIZES</div>
            <ul className="s4-track-list">
              {track.prizes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}

        <div id="s4-disclaimer">{TRACKS.disclaimer}</div>
      </div>
    </section>
  );
}
