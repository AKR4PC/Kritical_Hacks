import { gsap, SplitText } from '../gsap';
import { prefersReducedMotion } from '../env';

const SELECTORS = ['#s8-author', '#s8-holm', '#s8-url'] as const;

/** SplitText must be reverted before the quote can be split again. */
type SplittableQuote = HTMLElement & { _split?: SplitText };

/**
 * The last page. A beat of silence, then the final line of the book arriving
 * letter by letter, then the attribution, a hairline rule, and the credit.
 */
export function startClosingAnimation(): void {
  const quote = document.getElementById('s8-quote') as SplittableQuote | null;
  if (!quote) return;

  if (prefersReducedMotion) {
    quote.style.opacity = '1';
    gsap.set(SELECTORS, { opacity: 1 });
    gsap.set('#s8-divider', { width: '200px' });
    return;
  }

  // Reset everything so a second visit replays identically.
  gsap.set(SELECTORS, { opacity: 0 });
  gsap.set('#s8-divider', { width: '0px' });
  quote.style.opacity = '1';

  quote._split?.revert();
  quote._split = new SplitText(quote, { type: 'chars,words,lines', linesClass: 's8-line' });

  gsap.set(quote._split.chars, {
    opacity: 0,
    y: 60,
    rotationX: -90,
    transformOrigin: '50% 50% -20px',
  });

  gsap
    .timeline()
    // 1 — silence before the storm.
    .to({}, { duration: 0.4 })
    // 2 — letters rise line by line, flipping up on the X axis.
    .to(quote._split.chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1.4,
      stagger: { amount: 2.2, from: 'start' },
      ease: 'power4.out',
    })
    // 3 — the attribution fades in like a whisper.
    .to('#s8-author', { opacity: 1, duration: 1.8, ease: 'power2.out' }, '-=0.4')
    // 4 — a hairline rule draws itself across the page.
    .to('#s8-divider', { width: '200px', duration: 1.6, ease: 'expo.inOut' }, '+=0.6')
    // 5 — the credits materialise.
    .to('#s8-holm', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '+=0.2')
    .to('#s8-url', { opacity: 1, duration: 1, ease: 'power2.out' }, '+=0.2');
}

/** Section 8 is the only place the visitor is left alone; hide the label there. */
export function setCursorLabelVisible(visible: boolean): void {
  const el = document.getElementById('cursor-text');
  if (el) el.style.display = visible ? '' : 'none';
}
