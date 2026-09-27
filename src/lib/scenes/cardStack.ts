import { gsap } from '../gsap';
import { prefersReducedMotion, viewportHeight, viewportWidth } from '../env';
import { CARD_STACK } from '../../content/copy';

const COUNT = CARD_STACK.count;

/** Each card flies in from off-screen; the directions alternate deliberately. */
const STARTS: { x: number; y: number }[] = [
  { x: -viewportWidth * 1.9, y: -viewportHeight * 1.6 },
  { x: viewportWidth * 1.9, y: viewportHeight * 1.6 },
  { x: viewportWidth * 1.9, y: -viewportHeight * 1.6 },
  { x: -viewportWidth * 1.9, y: viewportHeight * 1.6 },
  { x: -viewportWidth * 2.0, y: 0 },
  { x: viewportWidth * 2.0, y: 0 },
  { x: 0, y: -viewportHeight * 2.0 },
  { x: 0, y: viewportHeight * 2.0 },
  { x: -viewportWidth * 1.9, y: -viewportHeight * 0.8 },
];

/** The angle each card keeps once it has landed. */
const ROTATIONS = [-6, 5, -8, 4, -3, 7, -5, 3, 0];

/** Where each card comes to rest, in pixels, once the stack has landed. */
const OFFSETS: { x: number; y: number }[] = [
  { x: 8, y: -12 },
  { x: -10, y: 8 },
  { x: 6, y: -8 },
  { x: -8, y: 12 },
  { x: 12, y: -6 },
  { x: -6, y: 8 },
  { x: 4, y: -4 },
  { x: -4, y: 4 },
  { x: 0, y: 0 },
];

/** The top three behave like a real pan/tilt camera; the rest are dead footage. */
const PAN_TILT_INDICES = [6, 7, 8];
const DEAD_FOOTAGE_INDICES = [0, 1, 2, 3, 4, 5];

let triggered: boolean[] = new Array(COUNT).fill(false);
let climaxDone = false;
let ready = false;
let mathFlashing = false;
let shownTag: HTMLElement | null = null;

const section = () => document.getElementById('section-7')!;
const math = () => document.getElementById('s7-math')!;
const wrapper = () => document.getElementById('s7-cards-wrapper')!;
const cardAt = (i: number) => document.getElementById(`s7-card-${i + 1}`);
const heading = () => document.getElementById('s7-heading');
const tagIn = (card: HTMLElement) => card.querySelector<HTMLElement>('.s7-tag');

/** The chapter heading resolves out of the red as the stack begins to assemble. */
function revealHeading(): void {
  const el = heading();
  if (!el) return;
  if (prefersReducedMotion) {
    gsap.set(el, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: -18 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 }
  );
}

/**
 * A card's tag prints itself onto the foot of the card as the card lands, and
 * the previous one is struck. The stack settles within ~24px of itself, so nine
 * tags held at once would stack into an illegible yellow smear — showing one at
 * a time keeps the roster readable and never lets two tags collide.
 */
function revealTag(card: HTMLElement): void {
  const tag = tagIn(card);
  if (!tag) return;
  const previous = shownTag;
  shownTag = tag;

  if (prefersReducedMotion) {
    if (previous && previous !== tag) previous.style.opacity = '0';
    tag.style.opacity = '1';
    tag.style.transform = 'none';
    return;
  }

  // `overwrite` matters: a card's own reveal is still pending when the next
  // card lands, so without it the strike would be undone by that tween.
  if (previous && previous !== tag) {
    gsap.to(previous, { opacity: 0, duration: 0.22, ease: 'power2.in', overwrite: true });
  }
  gsap.fromTo(
    tag,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out', delay: 0.3, overwrite: true }
  );
}

/** The last card to land sets off the climax. */
function landCard(i: number): void {
  const card = cardAt(i);
  const settle = () => {
    if (card) revealTag(card);
    if (i === COUNT - 1) {
      ready = true;
      climax();
    }
  };

  if (prefersReducedMotion) {
    gsap.set(card, { x: OFFSETS[i].x, y: OFFSETS[i].y, rotation: ROTATIONS[i] });
    settle();
    return;
  }

  gsap.to(card, {
    x: OFFSETS[i].x,
    y: OFFSETS[i].y,
    rotation: ROTATIONS[i],
    duration: 0.9,
    ease: 'back.out(1.15)',
    onComplete: settle,
  });
}

/**
 * The climax: the whole frame inverts and over-saturates three times in 200 ms,
 * then "2 + 2 = 5" resolves out of the blast and starts breathing.
 */
function climax(): void {
  if (climaxDone) return;
  climaxDone = true;
  const el = section();

  if (prefersReducedMotion) {
    el.style.filter = 'none';
    gsap.set('#s7-math', { opacity: 1, scale: 1 });
    wrapper().classList.add('s7-alive');
    math().classList.add('s7-alive');
    return;
  }

  gsap
    .timeline()
    .to(el, { filter: 'hue-rotate(180deg) saturate(4) brightness(2)', duration: 0.05 })
    .to(el, { filter: 'hue-rotate(-90deg) saturate(5) brightness(0.2)', duration: 0.05 })
    .to(el, { filter: 'hue-rotate(60deg) saturate(2) brightness(1.8)', duration: 0.05 })
    .to(el, { filter: 'none', duration: 0.07 })
    .to('#s7-math', { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', delay: 0.05 })
    .add(() => {
      wrapper().classList.add('s7-alive');
      math().classList.add('s7-alive');
    });
}

/** Arms the stack: everything flies back off-screen, the equation is erased. */
export function initCardStack(): void {
  triggered = new Array(COUNT).fill(false);
  climaxDone = false;
  ready = false;
  mathFlashing = false;
  gsap.set('#s7-math', { opacity: 0, scale: 3, x: 0, y: 0 });
  gsap.set('#s7-heading', { opacity: 0, y: -18 });
  gsap.set('.s7-tag', { opacity: 0, y: 12 });
  shownTag = null;
  section().style.background = '#cc0000';
  for (let i = 0; i < COUNT; i++) {
    const card = cardAt(i);
    if (!card) continue;
    card.style.filter = '';
    gsap.set(card, {
      x: STARTS[i].x,
      y: STARTS[i].y,
      rotation: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: i + 1,
    });
  }
  revealHeading();
}

export function resetCardStack(): void {
  wrapper().classList.remove('s7-alive');
  math().classList.remove('s7-alive');
  initCardStack();
}

/**
 * Scroll progress inside section 7 fades the backdrop from propaganda red to
 * black and releases the cards one at a time.
 */
export function updateCardStack(p: number): void {
  const bgT = Math.min(1, p / 0.3);
  const r = Math.round(204 * (1 - bgT));
  section().style.background = `rgb(${r},0,0)`;

  for (let i = 0; i < COUNT; i++) {
    const threshold = i / (COUNT + 1);
    if (!triggered[i] && p > threshold) {
      triggered[i] = true;
      landCard(i);
    }
  }
}

/**
 * Once the stack has landed, the visitor is under interrogation: a cold lamp
 * follows the pointer, the top three cards track it, and hovering the exact
 * centre briefly gives the truth away.
 */
export function interrogate(nx: number, ny: number, clientX?: number, clientY?: number): void {
  if (!ready || prefersReducedMotion) return;
  const dist = Math.sqrt(nx * nx + ny * ny);
  const glow = Math.max(0, 1 - dist * 0.8);

  // Cold interrogation lamp — clinical, harsh, no warmth.
  if (clientX !== undefined && clientY !== undefined) {
    const spotlight = document.getElementById('s7-spotlight');
    if (spotlight) {
      spotlight.style.background =
        `radial-gradient(circle 190px at ${clientX}px ${clientY}px, ` +
        `rgba(255,252,220,0.30) 0%, rgba(255,240,200,0.09) 50%, transparent 72%)`;
    }
  }

  // Top 3 cards — mechanical surveillance-camera pan, slower.
  PAN_TILT_INDICES.forEach((idx, i) => {
    const card = cardAt(idx);
    if (!card) return;
    const d = (i + 1) / 3;
    gsap.to(card, {
      rotateX: -ny * 14 * d,
      rotateY: nx * 14 * d,
      x: OFFSETS[idx].x - nx * 30 * d,
      y: OFFSETS[idx].y - ny * 30 * d,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    card.style.filter = `brightness(${0.78 + glow * 0.38 * d}) contrast(1.25) saturate(0.82)`;
  });

  // Lower cards — dull surveillance footage, very slow drift.
  DEAD_FOOTAGE_INDICES.forEach((idx) => {
    const card = cardAt(idx);
    if (!card) return;
    gsap.to(card, {
      x: OFFSETS[idx].x + nx * 6,
      y: OFFSETS[idx].y + ny * 6,
      duration: 1.9,
      ease: 'power1.out',
      overwrite: 'auto',
    });
    card.style.filter = 'brightness(0.70) contrast(1.22) saturate(0.65)';
  });

  // Equation — cold white inner glow, red propaganda halo, sluggish.
  const eq = math();
  gsap.to(eq, { x: nx * 13, y: ny * 13, duration: 1.0, ease: 'power1.out', overwrite: 'auto' });
  eq.style.textShadow =
    `0 0 ${6 + glow * 16}px rgba(255,255,255,${0.5 + glow * 0.5}),` +
    `0 0 ${38 + glow * 75}px rgba(204,0,0,${0.55 + glow * 0.45}),` +
    `0 0 ${110 + glow * 130}px rgba(204,0,0,${0.08 + glow * 0.22})`;

  // Reality correction — the exact centre briefly admits 2 + 2 = 4.
  if (dist < 0.22 && !mathFlashing) {
    mathFlashing = true;
    const original = eq.textContent;
    eq.textContent = CARD_STACK.corrected;
    setTimeout(() => {
      eq.textContent = original;
      setTimeout(() => {
        mathFlashing = false;
      }, 2200);
    }, 130);
  }
}
