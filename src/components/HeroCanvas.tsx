import { forwardRef } from 'react';

/**
 * The hero: a WebGL field of Big Brother's eyes behind a hanging hand that
 * holds the year on four strings. It is fixed to the viewport and torn out by
 * the first chapter's glitch transition.
 */
export const HeroCanvas = forwardRef<HTMLCanvasElement>(function HeroCanvas(_, ref) {
  return (
    <>
      <canvas id="hero-canvas" ref={ref} aria-hidden="true" />
      <div
        id="hero-vignette"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,0.3)',
        }}
      />
      {/* The red curtain that wipes across the whole viewport on the first cut. */}
      <div
        id="wipe"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--red)',
          transform: 'scaleY(0)',
          transformOrigin: 'top',
          zIndex: 100,
        }}
      />
    </>
  );
});
