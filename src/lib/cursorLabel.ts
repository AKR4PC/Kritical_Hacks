import { gsap } from './gsap';
import { prefersReducedMotion } from './env';
import { CURSOR_WORDS } from '../content/copy';

const ALT_INTERVAL = 600;

/**
 * A word — not a pointer — follows the cursor: THOUGHTCRIME, DOUBLETHINK,
 * alternating forever. Hidden entirely on touch devices and when motion is
 * reduced, where it would be noise rather than atmosphere.
 */
export function attachCursorLabel(element: HTMLElement): void {
  element.textContent = CURSOR_WORDS[0];
  element.style.opacity = '0';

  if (prefersReducedMotion) {
    element.style.display = 'none';
    return;
  }

  let wordIndex = 0;
  let shown = false;

  window.addEventListener('mousemove', (e) => {
    element.style.left = `${e.clientX}px`;
    element.style.top = `${e.clientY}px`;
    if (!shown) {
      shown = true;
      element.style.opacity = '1';
    }
  });

  setInterval(() => {
    if (!shown) return;
    wordIndex = wordIndex === 0 ? 1 : 0;
    gsap.to(element, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        element.textContent = CURSOR_WORDS[wordIndex];
        gsap.to(element, { opacity: 1, duration: 0.2 });
      },
    });
  }, ALT_INTERVAL);
}
