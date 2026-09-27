import { gsap } from '../gsap';
import { prefersReducedMotion } from '../env';
import { typeWriter } from '../typewriter';
import { MASTHEAD } from '../../content/copy';

const HEADLINE_TYPING_SPEED = 80;

/**
 * The bulletin slams into frame as a sheet of newsprint, unrolling 720° into
 * place, while the headline is typed out by an invisible linotype operator.
 */
export function revealBulletin(): void {
  const inner = document.getElementById('section-3-inner')!;
  const headline = document.getElementById('s3-headline')!;

  if (prefersReducedMotion) {
    gsap.set(inner, { scale: 1, rotation: 0, opacity: 1 });
    gsap.set(headline, { rotation: 0, y: 0 });
  } else {
    gsap.fromTo(
      inner,
      { scale: 0.1, rotation: 720, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.8, ease: 'power4.out' }
    );
    gsap.from(headline, { rotation: -1, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.5 });
  }

  typeWriter(headline, MASTHEAD.headline, HEADLINE_TYPING_SPEED);
}

/** Clears the headline so the sheet can be re-rolled on the way back. */
export function clearBulletinHeadline(): void {
  document.getElementById('s3-headline')!.textContent = '';
}
