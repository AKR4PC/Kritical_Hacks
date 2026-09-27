import { gsap, getLenis } from './gsap';
import { isMobile, prefersReducedMotion } from './env';

const preventTouch = (e: TouchEvent) => e.preventDefault();

/**
 * Guard for the scroll director: while a transition owns the screen, further
 * scene swaps are ignored. The blackout transition deliberately does *not* take
 * this lock — it is slow enough that its own state flags keep it unique.
 */
let transitionLocked = false;
export const isTransitionLocked = () => transitionLocked;

function lockScroll(): void {
  transitionLocked = true;
  if (getLenis()) getLenis()!.stop();
  document.addEventListener('touchmove', preventTouch, { passive: false });
}

function releaseLock(): void {
  transitionLocked = false;
  document.removeEventListener('touchmove', preventTouch);
  if (getLenis()) getLenis()!.start();
  window.dispatchEvent(new Event('scroll'));
}

function run(midpoint: () => void): void {
  try {
    midpoint();
  } catch {
    /* a failing callback must never strand the scroll lock */
  }
}

/** Hero → scene: RGB-tear skew of the live WebGL canvas. */
function glitchTransition(onMidpoint: () => void): void {
  lockScroll();
  const canvas = document.getElementById('hero-canvas')!;
  const tl = gsap.timeline({ onComplete: releaseLock });
  tl.to(canvas, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(canvas, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => run(onMidpoint))
    .to(canvas, { skewX: -5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 3, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
}

/** The inverse: tear the red scene out, bring the hero back. */
function glitchTransitionReverse(onMidpoint: () => void): void {
  lockScroll();
  const canvas = document.getElementById('hero-canvas')!;
  const s2 = document.getElementById('section-2')!;
  canvas.style.visibility = 'visible';
  gsap.set(canvas, { opacity: 0, skewX: 0 });
  const tl = gsap.timeline({ onComplete: releaseLock });
  tl.to(s2, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(s2, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(s2, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => run(onMidpoint))
    .to(canvas, { skewX: -5, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 3, duration: 0.05, ease: 'none' })
    .to(canvas, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
}

/** Tear an arbitrary outgoing layer out while an incoming one is assembled. */
function glitchTransitionEl(
  outEl: HTMLElement,
  inEl: HTMLElement,
  onMidpoint: () => void
): void {
  lockScroll();
  gsap.set(inEl, { opacity: 0 });
  const tl = gsap.timeline({ onComplete: releaseLock });
  tl.to(outEl, { skewX: 10, duration: 0.05, ease: 'none' })
    .to(outEl, { skewX: -8, duration: 0.05, ease: 'none' })
    .to(outEl, { skewX: 5, duration: 0.05, ease: 'none' })
    .to(outEl, { skewX: 0, duration: 0.05, ease: 'none' })
    .to(outEl, { opacity: 0, duration: 0.1, ease: 'none' })
    .add(() => run(onMidpoint))
    .to(inEl, { skewX: -5, duration: 0.05, ease: 'none' })
    .to(inEl, { skewX: 3, duration: 0.05, ease: 'none' })
    .to(inEl, { skewX: 0, opacity: 1, duration: 0.1, ease: 'none' });
}

/** Cut to television static: 16 frames of noise with a mid-point hand-off. */
export function staticTransition(onMidpoint: () => void): void {
  if (prefersReducedMotion) {
    run(onMidpoint);
    return;
  }
  lockScroll();
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:500;pointer-events:none;image-rendering:pixelated;';
  canvas.width = Math.max(1, Math.floor(window.innerWidth / 4));
  canvas.height = Math.max(1, Math.floor(window.innerHeight / 4));
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  let frame = 0;
  let midpointCalled = false;

  const drawStatic = () => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    frame++;
    if (frame === 8 && !midpointCalled) {
      midpointCalled = true;
      run(onMidpoint);
    }
    if (frame < 16) {
      requestAnimationFrame(drawStatic);
    } else {
      if (canvas.parentNode) document.body.removeChild(canvas);
      releaseLock();
    }
  };
  drawStatic();
}

/** Long blackout used for the heaviest cuts (4 → 6 → 7, 7 → 8). */
export function curtainTransition(onMidpoint: () => void): void {
  if (prefersReducedMotion) {
    run(onMidpoint);
    return;
  }
  if (getLenis()) getLenis()!.stop();
  document.addEventListener('touchmove', preventTouch, { passive: false });

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: #000000;
    z-index: 9999;
    pointer-events: all;
    opacity: 0;
  `;
  document.body.appendChild(overlay);

  let midpointCalled = false;
  document.body.style.pointerEvents = 'none';

  gsap
    .timeline({
      onComplete: () => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        document.body.style.pointerEvents = '';
        document.removeEventListener('touchmove', preventTouch);
        if (getLenis()) getLenis()!.start();
      },
    })
    .to(overlay, {
      opacity: 1,
      duration: 2.5,
      ease: 'power1.inOut',
      onComplete: () => {
        if (!midpointCalled) {
          midpointCalled = true;
          onMidpoint();
        }
      },
    })
    .to(overlay, { opacity: 0, duration: 3, ease: 'power1.inOut' }, '+=0.5');
}

/** Touch devices get a quick dip to black instead of canvas tearing. */
function mobileTransition(onMidpoint: () => void): void {
  transitionLocked = true;
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;' +
    'z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.25s linear;';
  document.body.appendChild(overlay);
  void overlay.offsetHeight; // force reflow so the initial opacity:0 is painted
  overlay.style.opacity = '1';
  setTimeout(() => {
    run(onMidpoint);
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (overlay.parentNode) document.body.removeChild(overlay);
      transitionLocked = false;
      window.dispatchEvent(new Event('scroll'));
    }, 270);
  }, 270);
}

/** Platform-agnostic scene swap. */
export function transition(onMidpoint: () => void): void {
  if (prefersReducedMotion) {
    run(onMidpoint);
    return;
  }
  if (isMobile) mobileTransition(onMidpoint);
  else glitchTransition(onMidpoint);
}

/** Platform-agnostic layer swap. */
export function transitionEl(
  outEl: HTMLElement,
  inEl: HTMLElement,
  onMidpoint: () => void
): void {
  if (prefersReducedMotion) {
    outEl.style.opacity = '0';
    inEl.style.opacity = '1';
    run(onMidpoint);
    return;
  }
  if (isMobile) {
    mobileTransition(() => {
      outEl.style.opacity = '0';
      inEl.style.opacity = '1';
      onMidpoint();
    });
  } else {
    glitchTransitionEl(outEl, inEl, onMidpoint);
  }
}

/** Platform-agnostic return to the hero. */
export function transitionReverse(onMidpoint: () => void): void {
  if (prefersReducedMotion) {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
      canvas.style.visibility = 'visible';
      canvas.style.opacity = '1';
    }
    run(onMidpoint);
    return;
  }
  if (isMobile) mobileTransition(onMidpoint);
  else glitchTransitionReverse(onMidpoint);
}
