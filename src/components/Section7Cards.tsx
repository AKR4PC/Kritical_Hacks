import { CARD_STACK } from '../content/copy';

/**
 * Chapter 5 — the card stack. Nine photographs pile up one at a time as the
 * backdrop bleeds from propaganda red to black, each carrying the editorial tag
 * of whoever is on it. Move the cursor once the stack has landed and the top
 * three cards track it under a cold interrogation lamp; hold the pointer near
 * the exact centre and the equation briefly admits it is wrong.
 */
export function Section7Cards() {
  return (
    <section
      id="section-7"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--red)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 49,
        overflow: 'hidden',
        perspective: '1200px',
      }}
    >
      <div id="s7-spotlight" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 25 }} />

      <div id="s7-heading" aria-hidden="true">
        {CARD_STACK.heading}
      </div>

      <div
        id="s7-math"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(3)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 13vw, 210px)',
          color: 'var(--red)',
          letterSpacing: '10px',
          opacity: 0,
          zIndex: 30,
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 0 60px var(--red-glow), 0 0 140px var(--red-glow-soft)',
          willChange: 'transform, opacity',
        }}
      >
        {CARD_STACK.math}
      </div>

      <div
        id="s7-cards-wrapper"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '440px',
          transformStyle: 'preserve-3d',
        }}
      >
        {CARD_STACK.images.map((src, i) => (
          <div className="s7-card" id={`s7-card-${i + 1}`} key={src}>
            <img src={src} alt="" loading="lazy" draggable={false} />
            <span className="s7-tag">{CARD_STACK.labels[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
