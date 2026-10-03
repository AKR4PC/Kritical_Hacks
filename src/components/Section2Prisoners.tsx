import { CALLS_TO_ACTION, INTRO, REGISTRATION_NOTE } from '../content/copy';
import { PrisonersArt } from './illustrations';

/**
 * Chapter 1 — the opening statement. A flat propaganda red field, an unblinking
 * eye, and a line of prisoners drawn in rather than printed. The statement slides
 * up word by word behind its own masks, with the two registration plates
 * underneath it.
 */
export function Section2Prisoners() {
  return (
    <section
      id="section-2"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--red)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6%',
        boxSizing: 'border-box',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div id="s2-vignette" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />

      <PrisonersArt />

      <div
        id="s2-eye"
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          background: 'var(--white)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            background: 'var(--black)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div id="s2-quote" style={{ width: '35%' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.2vw, 36px)',
            color: 'var(--white)',
            lineHeight: 1.4,
            letterSpacing: '2px',
          }}
        >
          {INTRO.quote}
        </p>

        <div id="s2-actions">
          {/*
            A full-width row ahead of the plates. `flex-basis: 100%` forces the
            wrap, so the note occupies its own line and the two plates keep
            whatever width they need. Revealed by the same tween that reveals
            the plates, since it is a child of the element it animates.
          */}
          <p id="s2-open">{REGISTRATION_NOTE}</p>

          {CALLS_TO_ACTION.map((action) => (
            <a
              key={action.label}
              className="s2-action"
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: action.background }}
            >
              {action.label}
              <span className="s2-action-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
