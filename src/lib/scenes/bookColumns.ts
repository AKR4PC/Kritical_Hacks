import { gsap } from '../gsap';
import { prefersReducedMotion } from '../env';
import { scrollVelocity } from '../scrollVelocity';

const LEFT_ID = 's6-left-text';
const RIGHT_ID = 's6-right-text';

let initialized = false;
let leftY = 0;
let rightY = 0;
let leftLoopH = 0;
let rightLoopH = 0;
let active = false;

/**
 * Both columns of Goldstein's prose are tripled so they can loop seamlessly.
 * The right column is pre-positioned one full loop up so it reads downward
 * from the correct copy while the left column climbs.
 */
export function initBookColumns(): void {
  if (initialized) return;
  initialized = true;

  const left = document.getElementById(LEFT_ID);
  const right = document.getElementById(RIGHT_ID);
  if (!left || !right) return;

  const originalLeft = left.innerHTML;
  const originalRight = right.innerHTML;
  left.innerHTML = originalLeft + originalLeft + originalLeft;
  right.innerHTML = originalRight + originalRight + originalRight;

  requestAnimationFrame(() => {
    leftLoopH = left.scrollHeight / 3;
    rightLoopH = right.scrollHeight / 3;
    right.style.transform = `translateY(${-2 * rightLoopH}px)`;
  });
}

export function resetBookColumns(): void {
  leftY = 0;
  rightY = 0;
  const left = document.getElementById(LEFT_ID);
  const right = document.getElementById(RIGHT_ID);
  if (left) left.style.transform = 'translateY(0)';
  if (right && rightLoopH > 0) right.style.transform = `translateY(${-2 * rightLoopH}px)`;
}

/**
 * The two columns scroll at different rates and in opposite directions, and
 * blur in proportion to how fast the visitor is scrolling. Runs on its own rAF
 * loop for as long as the section is live.
 */
function step(): void {
  requestAnimationFrame(step);
  if (!active || prefersReducedMotion) return;

  const speed = 1.2 + scrollVelocity.get() * 4;
  scrollVelocity.decay();

  leftY += speed;
  if (leftLoopH > 0 && leftY >= leftLoopH) leftY -= leftLoopH;

  rightY += speed * 0.6;
  if (rightLoopH > 0 && rightY >= rightLoopH) rightY -= rightLoopH;

  const blur = Math.min(scrollVelocity.get() * 1.8, 3.5);
  const left = document.getElementById(LEFT_ID);
  const right = document.getElementById(RIGHT_ID);

  if (left) {
    left.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
    left.style.transform = `translateY(-${leftY}px)`;
  }
  if (right && rightLoopH > 0) {
    right.style.filter = blur > 0.1 ? `blur(${blur}px)` : '';
    // Starts two loops up and travels toward the reader: the text moves down.
    right.style.transform = `translateY(${-2 * rightLoopH + rightY}px)`;
  }
}

export function startBookColumnLoop(): void {
  step();
}

export function setBookColumnsActive(next: boolean): void {
  active = next;
}

const THOUGHTCRIME_DELAY = 8000;
const THOUGHTCRIME_HOLD = 3000;

/** The Ministry interrupts, says its piece, and gives up. */
export function showThoughtcrime(): void {
  if (prefersReducedMotion) return;
  setTimeout(() => {
    gsap.to('#s6-thoughtcrime', {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        setTimeout(() => {
          gsap.to('#s6-thoughtcrime', { opacity: 0, duration: 0.5 });
        }, THOUGHTCRIME_HOLD);
      },
    });
  }, THOUGHTCRIME_DELAY);
}
