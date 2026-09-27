import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { prefersReducedMotion } from './env';

gsap.registerPlugin(SplitText);

/**
 * The smooth-scroll instance is shared globally because three separate render
 * loops have to feed it a frame: the hero scene, the book scene and the
 * transition timelines all need to know whether scrolling is under lock.
 */
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

/**
 * Smooth scroll is only installed when motion is allowed — with reduced motion
 * the page falls back to native scrolling, which is the accessible path.
 */
if (!prefersReducedMotion) {
  window.lenis = new Lenis();
}

export function getLenis(): Lenis | undefined {
  return window.lenis;
}

export { gsap, SplitText };
