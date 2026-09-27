import { CLOSING } from '../content/copy';

/**
 * Chapter 6 — the last page. Newsprint, the final line of the book, and a
 * credit line. The only chapter where the real system cursor is restored, and
 * the only one the visitor can actually leave.
 */
export function Section8Closing() {
  return (
    <section
      id="section-8"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--paper)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 51,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div
        id="s8-quote"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(28px, 3.6vw, 58px)',
          color: 'var(--ink)',
          lineHeight: 1.3,
          letterSpacing: '2px',
          textAlign: 'center',
          opacity: 0,
          maxWidth: '800px',
          padding: '0 5%',
        }}
      >
        {CLOSING.quoteLines.map((line) => (
          <div style={{ display: 'block' }} key={line}>
            {line}
          </div>
        ))}
      </div>

      <div
        id="s8-author"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(12px, 1.2vw, 18px)',
          color: 'rgba(0,0,0,0.45)',
          letterSpacing: '4px',
          textAlign: 'center',
          opacity: 0,
          marginTop: '30px',
          fontStyle: 'italic',
        }}
      >
        {CLOSING.author}
      </div>

      <div
        id="s8-divider"
        style={{ width: '0%', height: '1px', background: 'rgba(0,0,0,0.2)', marginTop: '60px' }}
      />

      <div
        id="s8-holm"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(10px, 1vw, 14px)',
          color: 'rgba(0,0,0,0.5)',
          letterSpacing: '6px',
          textAlign: 'center',
          opacity: 0,
          marginTop: '40px',
        }}
      >
        {CLOSING.credit}
      </div>

      <div
        id="s8-url"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(10px, 1vw, 14px)',
          color: 'rgba(0,0,0,0.3)',
          letterSpacing: '4px',
          textAlign: 'center',
          opacity: 0,
          marginTop: '10px',
        }}
      >
        {CLOSING.names}
      </div>
    </section>
  );
}
