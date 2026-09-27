/**
 * Environment flags, sampled once at boot exactly like the source does.
 * The 3D pipeline, the transition style and the scroll geometry are all
 * decided from these two values, so they must never be re-evaluated later.
 */

export const prefersReducedMotion =
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const viewportWidth = window.innerWidth;
export const viewportHeight = window.innerHeight;

/** Phone layout: stacked scenes, cheap renderer, shorter scroll runway. */
export const isMobile = viewportWidth <= 768;

/** Touch/tablet: 3D orbit is disabled so gestures fall through to scrolling. */
export const isTabletOrTouch = viewportWidth <= 1024;
