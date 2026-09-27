import { isMobile, prefersReducedMotion } from './env';
import { scrollVelocity } from './scrollVelocity';
import {
  curtainTransition,
  isTransitionLocked,
  staticTransition,
  transition,
  transitionEl,
  transitionReverse,
} from './transitions';
import { drawPrisoners, hidePrisonersQuote, rewindPrisoners, showPrisonersQuote } from './scenes/prisoners';
import { clearBulletinHeadline, revealBulletin } from './scenes/bulletin';
import { revealPortrait, unrollPortrait } from './scenes/portrait';
import {
  initBookColumns,
  resetBookColumns,
  setBookColumnsActive,
  showThoughtcrime,
} from './scenes/bookColumns';
import { initCardStack, interrogate, resetCardStack, updateCardStack } from './scenes/cardStack';
import { setCursorLabelVisible, startClosingAnimation } from './scenes/closing';
import type { BookScene } from './three/bookScene';
import type { GrainOverlay } from './grain';

const el = (id: string) => document.getElementById(id)!;

/**
 * Scroll geometry. Every scene occupies an exact slice of the scroll runway, so
 * the story is a fixed set of chapters rather than a free-running animation.
 * Phones compress the early chapters because their text is taller per line.
 */
const BOUNDARY_HERO_TO_PRISONERS = 0.11;
const BOUNDARY_PRISONERS_TO_BULLETIN = isMobile ? 0.19 : 0.27;
const BOUNDARY_BULLETIN_TO_PORTRAIT = isMobile ? 0.3 : 0.33;
const BOUNDARY_PORTRAIT_TO_BOOK = isMobile ? 0.4 : 0.44;
const BOUNDARY_BOOK_TO_STACK = isMobile ? 0.8 : 0.7;
const BOUNDARY_STACK_TO_CLOSING = 0.98;
const BOUNDARY_CLOSING_RETURN = 0.93;

/** How far back a chapter must be re-crossed to count as "left behind". */
const REWIND_SLACK = 0.05;

const VELOCITY_NORMALISER = 20;
const VELOCITY_CEILING = 3;

const MOUSE_TILT_X = 0.45;
const MOUSE_TILT_Z = 0.25;

export interface Director {
  dispose(): void;
}

/**
 * Owns the chapter-by-chapter scroll state machine and every listener that
 * feeds it. All sections are permanently mounted and fixed to the viewport;
 * this module is the only thing that decides which one is on screen.
 */
export function startScrollDirector(options: {
  grain: GrainOverlay;
  book: BookScene;
  hero: { resize(grain: GrainOverlay): void };
}): Director {
  const { grain, book, hero } = options;

  // The page is nothing but scroll runway: the scenes themselves are fixed.
  document.body.style.height = isMobile ? '900vh' : '1200vh';

  let prisonersShown = false;
  let bulletinShown = false;
  let portraitShown = false;
  let bookShown = false;
  let stackShown = false;
  let closingShown = false;
  let heroShown = true;

  let bookActive = false;
  let lastScrollY = 0;

  /* ── Chapter transitions ─────────────────────────────────────── */

  function enterPrisoners(): void {
    prisonersShown = true;
    heroShown = false;
    transition(() => {
      if (!isMobile) el('hero-canvas').style.visibility = 'hidden';
      el('section-2').style.opacity = '1';
      el('section-2').style.pointerEvents = 'auto';
      grain.setOpacity(0.12);
      drawPrisoners();
      showPrisonersQuote();
    });
  }

  function enterBulletin(): void {
    bulletinShown = true;
    const s2 = el('section-2');
    const s3 = el('section-3');
    transitionEl(s2, s3, () => {
      s2.style.pointerEvents = 'none';
      hidePrisonersQuote();
      s3.style.pointerEvents = 'auto';
      revealBulletin();
    });
  }

  function leaveBulletin(): void {
    bulletinShown = false;
    const s2 = el('section-2');
    const s3 = el('section-3');
    transitionEl(s3, s2, () => {
      s3.style.pointerEvents = 'none';
      clearBulletinHeadline();
      s2.style.pointerEvents = 'auto';
      showPrisonersQuote();
    });
  }

  function enterPortrait(): void {
    portraitShown = true;
    const s3 = el('section-3');
    const s4 = el('section-4');
    transitionEl(s3, s4, () => {
      s3.style.pointerEvents = 'none';
      s4.style.pointerEvents = 'auto';
      revealPortrait();
    });
  }

  function leavePortrait(): void {
    portraitShown = false;
    const s4 = el('section-4');
    const s3 = el('section-3');
    transitionEl(s4, s3, () => {
      s4.style.pointerEvents = 'none';
      s3.style.pointerEvents = 'auto';
      unrollPortrait();
    });
  }

  function enterBook(): void {
    bookShown = true;
    staticTransition(() => {
      const s4 = el('section-4');
      s4.style.opacity = '0';
      s4.style.pointerEvents = 'none';
      el('section-6').style.opacity = '1';
      el('section-6').style.pointerEvents = 'auto';
      bookActive = true;
      book.setActive(true);
      initBookColumns();
      setBookColumnsActive(true);
      showThoughtcrime();
    });
  }

  function leaveBook(): void {
    bookShown = false;
    bookActive = false;
    book.setActive(false);
    setBookColumnsActive(false);
    const s6 = el('section-6');
    const s4 = el('section-4');
    transitionEl(s6, s4, () => {
      s6.style.pointerEvents = 'none';
      s4.style.pointerEvents = 'auto';
      resetBookColumns();
    });
  }

  function enterStack(): void {
    stackShown = true;
    bookActive = false;
    book.setActive(false);
    setBookColumnsActive(false);
    staticTransition(() => {
      const s6 = el('section-6');
      const s7 = el('section-7');
      s6.style.opacity = '0';
      s6.style.pointerEvents = 'none';
      s7.style.opacity = '1';
      s7.style.pointerEvents = 'auto';
      initCardStack();
    });
  }

  function leaveStack(): void {
    stackShown = false;
    const s7 = el('section-7');
    const s6 = el('section-6');
    transitionEl(s7, s6, () => {
      s7.style.pointerEvents = 'none';
      s6.style.opacity = '1';
      s6.style.pointerEvents = 'auto';
      bookActive = true;
      book.setActive(true);
      setBookColumnsActive(true);
      resetCardStack();
    });
  }

  function enterClosing(): void {
    closingShown = true;
    curtainTransition(() => {
      document.querySelectorAll('section').forEach((s) => {
        s.style.opacity = '0';
        s.style.pointerEvents = 'none';
      });
      if (!isMobile) el('hero-canvas').style.visibility = 'hidden';
      el('section-8').style.opacity = '1';
      el('section-8').style.pointerEvents = 'auto';
      setCursorLabelVisible(false);
      startClosingAnimation();
    });
  }

  function leaveClosing(): void {
    closingShown = false;
    curtainTransition(() => {
      el('section-8').style.opacity = '0';
      el('section-8').style.pointerEvents = 'none';
      const s7 = el('section-7');
      s7.style.opacity = '1';
      s7.style.pointerEvents = 'auto';
      setCursorLabelVisible(true);
    });
  }

  function returnToHero(): void {
    heroShown = true;
    prisonersShown = false;
    transitionReverse(() => {
      el('section-2').style.opacity = '0';
      el('section-2').style.pointerEvents = 'none';
      grain.setOpacity(0);
      hidePrisonersQuote();
      rewindPrisoners();
    });
  }

  /* ── The director ────────────────────────────────────────────── */

  function onScroll(): void {
    if (bookActive) {
      const delta = Math.abs(window.scrollY - lastScrollY) / VELOCITY_NORMALISER;
      scrollVelocity.set(Math.min(delta, VELOCITY_CEILING));
    }
    lastScrollY = window.scrollY;

    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    // Read live, not cached: starting a transition locks the screen, and the
    // checks below must see that lock immediately.
    const free = () => !isTransitionLocked();

    // Each chapter claims the screen once its slice of scroll is crossed, and
    // gives it back when the visitor re-crosses the boundary by the slack.
    if (progress > BOUNDARY_HERO_TO_PRISONERS && !prisonersShown && free()) {
      enterPrisoners();
    }

    if (progress > BOUNDARY_PRISONERS_TO_BULLETIN && prisonersShown && !bulletinShown && !portraitShown && free()) {
      enterBulletin();
    }

    if (progress < BOUNDARY_PRISONERS_TO_BULLETIN - REWIND_SLACK && bulletinShown && free()) {
      leaveBulletin();
    }

    if (progress > BOUNDARY_BULLETIN_TO_PORTRAIT && bulletinShown && !portraitShown && free()) {
      enterPortrait();
    }

    if (progress < BOUNDARY_BULLETIN_TO_PORTRAIT - REWIND_SLACK && portraitShown && free()) {
      leavePortrait();
    }

    if (progress > BOUNDARY_PORTRAIT_TO_BOOK && portraitShown && !bookShown && free()) {
      enterBook();
    }

    if (progress < BOUNDARY_PORTRAIT_TO_BOOK - REWIND_SLACK && bookShown && !stackShown && free()) {
      leaveBook();
    }

    if (progress > BOUNDARY_BOOK_TO_STACK && bookShown && !stackShown && free()) {
      enterStack();
    }

    if (progress < BOUNDARY_BOOK_TO_STACK - REWIND_SLACK && stackShown && free()) {
      leaveStack();
    }

    // In-chapter progress: the card stack assembles as you travel through it.
    if (stackShown) {
      const p = Math.max(0, Math.min(1, (progress - BOUNDARY_BOOK_TO_STACK) / (1 - BOUNDARY_BOOK_TO_STACK)));
      updateCardStack(p);
    }

    // The blackout deliberately takes no transition lock — it is slow enough
    // that its own flag keeps it unique — so it is guarded by that flag alone.
    if (progress > BOUNDARY_STACK_TO_CLOSING && !closingShown) {
      enterClosing();
    }

    if (progress < BOUNDARY_CLOSING_RETURN && closingShown) {
      leaveClosing();
    }

    if (progress < BOUNDARY_HERO_TO_PRISONERS - REWIND_SLACK && !heroShown && free()) {
      returnToHero();
    }
  }

  /* ── Book leans toward the cursor ─────────────────────────────── */

  function onBookPointerMove(e: MouseEvent): void {
    if (!bookActive || prefersReducedMotion) return;
    const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    book.setTilt(ny * MOUSE_TILT_X, -nx * MOUSE_TILT_Z);
  }

  function onBookPointerLeave(): void {
    book.setTilt(0, 0);
  }

  /* ── Card stack interrogation ─────────────────────────────────── */

  function onStackPointer(x: number, y: number): void {
    const nx = (x - window.innerWidth / 2) / (window.innerWidth / 2);
    const ny = (y - window.innerHeight / 2) / (window.innerHeight / 2);
    interrogate(nx, ny, x, y);
  }

  const onStackMouseMove = (e: MouseEvent) => onStackPointer(e.clientX, e.clientY);
  const onStackTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) onStackPointer(t.clientX, t.clientY);
  };

  /* ── Book render loop ─────────────────────────────────────────── */

  function renderBook(): void {
    requestAnimationFrame(renderBook);
    book.tick(scrollVelocity.get());
  }

  /* ── Viewport changes ─────────────────────────────────────────── */

  function onResize(): void {
    hero.resize(grain);
    book.resize();
  }

  /* ── Wire up ──────────────────────────────────────────────────── */

  const s6 = el('section-6');
  s6.addEventListener('mousemove', onBookPointerMove);
  s6.addEventListener('mouseleave', onBookPointerLeave);

  const s7 = el('section-7');
  s7.addEventListener('mousemove', onStackMouseMove);
  s7.addEventListener('touchmove', onStackTouchMove, { passive: true });

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
  requestAnimationFrame(renderBook);

  return {
    dispose() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      s6.removeEventListener('mousemove', onBookPointerMove);
      s6.removeEventListener('mouseleave', onBookPointerLeave);
      s7.removeEventListener('mousemove', onStackMouseMove);
      s7.removeEventListener('touchmove', onStackTouchMove);
    },
  };
}
