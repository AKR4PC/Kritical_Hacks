import { gsap, getLenis } from './gsap';
import { isMobile, prefersReducedMotion } from './env';

const TITLE = 'WHAT A NATIONAL LEVEL HACKATHON LOOKS LIKE?';
const PROGRESS_STEPS = [0, 19, 84, 100];

type HiddenListener = () => void;

export interface LoaderController {
  /** Resolves the reveal gate once the 3D hand is ready. */
  awaitHero(promise: Promise<unknown>): void;
  /** Subscribes to the moment the loader has fully cleared the screen. */
  onHidden(fn: () => void): () => void;
}

/**
 * The boot sequence: a typed title, a Ministry of Truth progress counter that
 * never reaches a clean 100 on the first pass, then a 620 ms RGB-tear reveal.
 *
 * The counter only begins its exit once the 3D hand has finished downloading,
 * so the first thing the visitor sees is already the finished scene.
 */
export function startLoader(root: HTMLElement): LoaderController | null {
  const number = root.querySelector<HTMLElement>('#loader-number');
  const title = root.querySelector<HTMLElement>('#loader-title');
  return number && title ? runBootSequence(root, number, title) : null;
}

function runBootSequence(
  root: HTMLElement,
  number: HTMLElement,
  title: HTMLElement
): LoaderController {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  let animationDone = false;
  let hiding = false;
  let handPromise: Promise<unknown> | null = null;
  const hiddenListeners = new Set<HiddenListener>();

  function onLoaderHidden(): void {
    hiddenListeners.forEach((fn) => fn());
  }

  /* ── Reveal ─────────────────────────────────────────────────── */

  function revealWithReducedMotion(): void {
    root.style.opacity = '0';
    root.style.display = 'none';
    document.body.style.overflow = '';
    if (getLenis()) getLenis()!.start();
    onLoaderHidden();
  }

  function revealWithGlitch(): void {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const glitch = document.createElement('canvas');
    glitch.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100000;pointer-events:none;';
    glitch.width = W;
    glitch.height = H;
    document.body.appendChild(glitch);
    const ctx = glitch.getContext('2d')!;

    const start = Date.now();
    const DURATION = 620;

    function frame(): void {
      const t = Math.min(1, (Date.now() - start) / DURATION);
      const ease = t * t; // quadratic — slow build, explosive finish

      ctx.clearRect(0, 0, W, H);

      // Horizontal strip displacement — the core glitch
      const bars = Math.floor(4 + ease * 20);
      for (let i = 0; i < bars; i++) {
        const y = Math.random() * H;
        const h = 1 + Math.random() * (ease * 55);
        const dx = (Math.random() - 0.5) * ease * 160;

        // Black strip — content displacement
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(0, y, W, h);

        // Red channel left — RGB split
        if (Math.random() < 0.65) {
          ctx.fillStyle = `rgba(204,0,0,${Math.random() * 0.6 * ease})`;
          ctx.fillRect(dx - 6, y, W, h);
        }
        // Cold cyan channel right — RGB split
        if (Math.random() < 0.55) {
          ctx.fillStyle = `rgba(180,230,255,${Math.random() * 0.45 * ease})`;
          ctx.fillRect(dx + 9, y, W, h);
        }
      }

      // Bright white scan lines
      if (Math.random() < ease * 0.45) {
        ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
        ctx.fillRect(0, Math.random() * H, W, Math.random() < 0.6 ? 1 : 2);
      }

      // Fade the loader itself behind the canvas in the second half
      if (t > 0.48) {
        root.style.opacity = String(Math.max(0, 1 - (t - 0.48) * 1.92));
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // Hard cut to black, then reveal
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);
        root.style.opacity = '0';
        setTimeout(() => {
          if (glitch.parentNode) glitch.parentNode.removeChild(glitch);
          root.style.display = 'none';
          document.body.style.overflow = '';
          if (getLenis()) getLenis()!.start();
          onLoaderHidden();
        }, 55);
      }
    }

    frame();
  }

  function tryReveal(): void {
    if (!animationDone || hiding) return;
    hiding = true;
    // Never let a stalled download hold the visitor on the counter.
    const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
    Promise.race([handPromise ?? Promise.resolve(), timeout]).then(() => {
      if (prefersReducedMotion) revealWithReducedMotion();
      else revealWithGlitch();
    });
  }

  /* ── Counter ────────────────────────────────────────────────── */

  const staggerIn = isMobile ? 0.08 : 0.15;
  const staggerOut = isMobile ? 0.05 : 0.1;
  const pauseBetweenSteps = isMobile ? 300 : 600;

  function showNumber(value: number, onDone: () => void): void {
    const animateIn = () => {
      number.innerHTML = String(value)
        .split('')
        .map((d) => `<span style="display:inline-block">${d}</span>`)
        .join('');
      const spans = number.querySelectorAll('span');
      gsap.set(spans, { clipPath: 'inset(100% 0 0% 0)', y: 60 });
      gsap.to(spans, {
        clipPath: 'inset(0% 0 0% 0)',
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: staggerIn,
        onComplete: onDone,
      });
    };

    const existing = number.querySelectorAll('span');
    if (existing.length > 0) {
      gsap.to(existing, {
        clipPath: 'inset(0 0 100% 0)',
        y: -40,
        duration: 0.4,
        ease: 'power3.in',
        stagger: staggerOut,
        onComplete: animateIn,
      });
    } else {
      animateIn();
    }
  }

  function runCounter(index: number): void {
    if (index >= PROGRESS_STEPS.length) return;
    const value = PROGRESS_STEPS[index];
    showNumber(value, () => {
      if (value === 100) {
        gsap.to(number, {
          color: '#cc0000',
          duration: 0.3,
          delay: 0.2,
          onComplete: () => {
            setTimeout(() => {
              animationDone = true;
              tryReveal();
            }, 300);
          },
        });
      } else {
        setTimeout(() => runCounter(index + 1), pauseBetweenSteps);
      }
    });
  }

  /* ── Typewriter ─────────────────────────────────────────────── */

  function typeTitle(onDone: () => void): void {
    const speed = isMobile ? 30 : 55;
    let i = 0;
    const interval = setInterval(() => {
      if (i < TITLE.length) {
        title.textContent += TITLE[i++];
      } else {
        clearInterval(interval);
        setTimeout(onDone, 400);
      }
    }, speed);
  }

  /* ── Boot ───────────────────────────────────────────────────── */

  number.textContent = '';

  if (prefersReducedMotion) {
    title.textContent = TITLE;
    number.textContent = '100';
    number.style.color = '#cc0000';
    animationDone = true;
    tryReveal();
  } else {
    typeTitle(() => runCounter(0));
  }

  return {
    awaitHero(promise: Promise<unknown>) {
      handPromise = promise;
      tryReveal();
    },
    onHidden(fn: () => void) {
      hiddenListeners.add(fn);
      return () => {
        hiddenListeners.delete(fn);
      };
    },
  };
}
