import { gsap } from '../gsap';
import { prefersReducedMotion } from '../env';

let split = false;

/**
 * The quote is split into per-word masks once, then each word is slid up from
 * behind its own mask. The split is idempotent so re-entry never nests spans.
 */
function ensureSplit(): void {
  if (split) return;
  split = true;
  const quote = document.querySelector('#s2-quote p');
  if (!quote) return;
  const words = quote.textContent!.trim().split(' ');
  quote.innerHTML = words
    .map(
      (word) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.15;">` +
        `<span class="s2-sw" style="display:inline-block;transform:translateY(110%);">${word}</span>` +
        `</span>`
    )
    .join(' ');
}

/** Renders the statement line-by-line, as if a pen were drawing it. */
export function showPrisonersQuote(): void {
  ensureSplit();
  if (prefersReducedMotion) {
    gsap.set('.s2-sw', { y: 0 });
    gsap.set('#s2-actions', { opacity: 1, y: 0 });
    return;
  }

  const WORD_STAGGER = 0.04;
  gsap.to('.s2-sw', {
    y: 0,
    duration: 0.7,
    stagger: WORD_STAGGER,
    ease: 'power3.out',
    delay: 0.2,
  });

  // The plates settle in behind the last words rather than landing with the cut.
  const wordCount = document.querySelectorAll('.s2-sw').length;
  gsap.fromTo(
    '#s2-actions',
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.2 + WORD_STAGGER * wordCount,
    }
  );
}

export function hidePrisonersQuote(): void {
  gsap.set('.s2-sw', { y: '110%' });
  gsap.set('#s2-actions', { opacity: 0, y: 14 });
}

/** Traces the crowd illustration's outline in black, one path at a time. */
export function drawPrisoners(): void {
  const paths = Array.from(document.querySelectorAll<SVGPathElement>('#s2-prisoners path'));
  paths.forEach((p) => {
    try {
      const len = p.getTotalLength();
      p.style.fill = 'none';
      p.style.stroke = 'black';
      p.style.strokeWidth = '2';
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    } catch {
      /* a path the browser cannot measure is simply not animated */
    }
  });
  if (prefersReducedMotion) {
    gsap.set(paths, { strokeDashoffset: 0 });
  } else {
    gsap.to(paths, { strokeDashoffset: 0, duration: 0.25, stagger: 0.0015, ease: 'power2.inOut' });
  }
}

/** Rewinds the illustration for the trip back to the hero. */
export function rewindPrisoners(): void {
  document.querySelectorAll<SVGPathElement>('#s2-prisoners path').forEach((p) => {
    try {
      p.style.strokeDashoffset = String(p.getTotalLength());
    } catch {
      /* see drawPrisoners */
    }
  });
}
