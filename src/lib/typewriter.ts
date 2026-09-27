import { prefersReducedMotion } from './env';

/**
 * Reveals `text` one character at a time. With reduced motion the text simply
 * appears — no fake typing, no timers left dangling.
 */
export function typeWriter(
  element: HTMLElement,
  text: string,
  speed: number,
  onComplete?: () => void
): void {
  if (prefersReducedMotion) {
    element.textContent = text;
    onComplete?.();
    return;
  }
  let i = 0;
  element.textContent = '';
  const timer = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      onComplete?.();
    }
  }, speed);
}
