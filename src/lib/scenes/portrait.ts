import { gsap } from '../gsap';
import { prefersReducedMotion } from '../env';
import { PORTRAIT_TEXT_PLAIN } from '../../content/copy';

const PORTRAIT_SELECTOR = '#s4-woman';
const TEXT_ID = 's4-text';

let split = false;

/**
 * The portrait is drawn as a very thick stroke rather than a fill, so the face
 * appears to be inked in by a pen travelling along its own outline.
 */
function drawPortrait(): SVGPathElement[] {
  const paths = Array.from(document.querySelectorAll<SVGPathElement>(`${PORTRAIT_SELECTOR} path`));
  paths.forEach((p) => {
    p.style.fill = 'none';
    p.style.stroke = '#000000';
    p.style.strokeWidth = '85';
    try {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    } catch {
      /* a path the browser cannot measure is simply not animated */
    }
  });
  return paths;
}

/** Rebuilds the overlay sentence as per-word masks ready to rise into view. */
function buildText(): void {
  const textEl = document.getElementById(TEXT_ID);
  if (!textEl || split) return;
  split = true;
  const words = textEl.textContent!.trim().split(/\s+/);
  textEl.innerHTML = words
    .map(
      (word) =>
        `<div style="overflow:hidden;display:inline-block;">` +
        `<span class="s4w" style="font-family:'Bebas Neue',sans-serif;` +
        `font-size:clamp(32px,5.5vw,96px);color:#ffffff;font-weight:900;` +
        `display:inline-block;transform:translateY(110%) skewY(6deg);">${word}</span></div>`
    )
    .join(' ');
  gsap.set(`#${TEXT_ID}`, { opacity: 1 });
}

/** The two track columns rise into place under the heading, one block at a time. */
function revealTracks(): void {
  const tracks = document.getElementById('s4-tracks');
  if (!tracks) return;
  if (prefersReducedMotion) {
    gsap.set(tracks, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    tracks,
    { opacity: 0, y: 26 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', delay: 0.15 }
  );
  gsap.fromTo(
    '.s4-track > *, #s4-disclaimer',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.055, ease: 'power3.out', delay: 0.3 }
  );
}

export function revealPortrait(): void {
  const paths = drawPortrait();

  if (prefersReducedMotion) {
    gsap.set(paths, { strokeDashoffset: 0 });
    buildText();
    gsap.set('.s4w', { y: 0, skewY: 0 });
    revealTracks();
    return;
  }

  gsap
    .timeline({ delay: 0.2 })
    .to(paths, { strokeDashoffset: 0, duration: 0.5, stagger: 0.00125, ease: 'none' })
    .add(() => {
      buildText();
      gsap.to('.s4w', { y: 0, skewY: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out' });
      revealTracks();
    });
}

/**
 * Undoes the portrait completely: the ink is pulled back off the paths, the
 * tracks are sent back under the face, and the overlay heading is restored to
 * its original single text node so the next entry can split it again.
 */
export function unrollPortrait(): void {
  document.querySelectorAll<SVGPathElement>(`${PORTRAIT_SELECTOR} path`).forEach((p) => {
    try {
      p.style.strokeDashoffset = String(p.getTotalLength());
    } catch {
      /* see drawPortrait */
    }
  });
  gsap.set(`#${TEXT_ID}`, { opacity: 0 });
  gsap.set('#s4-tracks', { opacity: 0, y: 26 });
  gsap.set('.s4-track > *, #s4-disclaimer', { opacity: 0, y: 16 });
  split = false;
  const textEl = document.getElementById(TEXT_ID);
  if (textEl) textEl.innerHTML = PORTRAIT_TEXT_PLAIN;
}
