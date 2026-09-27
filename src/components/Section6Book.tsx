import { forwardRef } from 'react';
import { ELIGIBILITY, GUIDELINES } from '../content/copy';

const COLUMN_MASK = {
  maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
} as const;

const COLUMN_TEXT = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(11px, 1.1vw, 16px)',
  color: 'var(--white)',
  lineHeight: 2,
  letterSpacing: '1px',
  willChange: 'transform',
} as const;

/**
 * Chapter 4 — the rulebook. Two columns crawl in opposite directions around a
 * slowly turning black book: the house rules on the left, who may compete on the
 * right. After eight seconds the Ministry interrupts to read out the heading.
 */
export const Section6Book = forwardRef<HTMLCanvasElement>(function Section6Book(_, ref) {
  return (
    <section
      id="section-6"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--red)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 47,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Left column climbs */}
      <div
        id="s6-left"
        style={{
          position: 'absolute',
          left: '3%',
          top: 0,
          width: '22%',
          height: '100%',
          overflow: 'hidden',
          ...COLUMN_MASK,
        }}
      >
        <div id="s6-left-text" style={COLUMN_TEXT}>
          <div className="s6-heading">{GUIDELINES.heading}</div>
          <ul className="s6-list">
            {GUIDELINES.items.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right column descends */}
      <div
        id="s6-right"
        style={{
          position: 'absolute',
          right: '3%',
          top: 0,
          width: '22%',
          height: '100%',
          overflow: 'hidden',
          ...COLUMN_MASK,
        }}
      >
        <div id="s6-right-text" style={COLUMN_TEXT}>
          <div className="s6-heading">{ELIGIBILITY.heading}</div>
          <p className="s6-para">{ELIGIBILITY.intro}</p>

          <div className="s6-rule" aria-hidden="true" />

          <div className="s6-sub">{ELIGIBILITY.student.label}</div>
          <ul className="s6-list">
            {ELIGIBILITY.student.items.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="s6-note">{ELIGIBILITY.student.note}</p>

          <div className="s6-rule" aria-hidden="true" />

          <div className="s6-sub">{ELIGIBILITY.professional.label}</div>
          <ul className="s6-list">
            {ELIGIBILITY.professional.items.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="s6-rule" aria-hidden="true" />

          <p className="s6-note">{ELIGIBILITY.footnote}</p>
        </div>
      </div>

      {/* The book itself */}
      <canvas
        id="book-canvas"
        ref={ref}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      <div
        id="s6-thoughtcrime"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          opacity: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 100px)',
            color: 'var(--white)',
            letterSpacing: '8px',
            textAlign: 'center',
          }}
        >
          {GUIDELINES.heading}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px, 2vw, 28px)',
            color: 'var(--white)',
            letterSpacing: '4px',
          }}
        >
          {GUIDELINES.subline}
        </div>
      </div>
    </section>
  );
});
