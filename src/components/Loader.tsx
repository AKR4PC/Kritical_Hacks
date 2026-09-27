import { forwardRef } from 'react';

/**
 * The boot screen. A full-bleed black field with a Ministry of Truth progress
 * counter above the typed title; the counter's digits are wiped in from below
 * and it turns red on 100.
 */
export const Loader = forwardRef<HTMLDivElement>(function Loader(_, ref) {
  return (
    <div
      id="loader"
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--black)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
      }}
    >
      <div
        id="loader-number"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(120px, 20vw, 280px)',
          color: 'var(--white)',
          lineHeight: 1,
          letterSpacing: '-2px',
          transition: 'color 0.3s ease',
          height: 'clamp(120px, 20vw, 280px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      <div
        id="loader-caption"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(17px, 1.8vw, 28px)',
          fontWeight: 500,
          color: 'var(--white)',
          letterSpacing: '8px',
          textIndent: '8px',
          lineHeight: 1.2,
          minHeight: '34px',
          textAlign: 'center',
        }}
      />

      <div
        id="loader-title"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(14px, 1.5vw, 22px)',
          color: 'var(--red)',
          letterSpacing: '6px',
          minHeight: '30px',
        }}
      />
    </div>
  );
});
