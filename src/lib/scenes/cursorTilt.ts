import { gsap } from '../gsap';
import { prefersReducedMotion } from '../env';

/**
 * Shared behaviour for the two cursor-reactive portraits (section 2's prisoners
 * and section 4's face): the figure leans toward the pointer while a pool of
 * darkness follows it, then settles back when the pointer leaves.
 */
export interface CursorTiltOptions {
  /** ID of the section that owns the listener. */
  section: string;
  /** Selector of the element that leans. */
  target: string;
  /** ID of the element the darkness is painted into. */
  vignette: string;
  /** Degrees of lean at the extreme horizontal edge of the viewport. */
  maxY: number;
  /** Degrees of lean at the extreme vertical edge of the viewport. */
  maxX: number;
  /** Radius of the darkness that trails the pointer. */
  radius: number;
  /** Opacity of the darkness at the edge of that radius. */
  strength: number;
}

export function attachCursorTilt(options: CursorTiltOptions): void {
  const section = document.getElementById(options.section);
  if (!section) return;

  section.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    // The figure leans *toward* the visitor — Big Brother is watching.
    gsap.to(options.target, {
      rotateY: nx * options.maxY,
      rotateX: -ny * options.maxX,
      duration: 1.1,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    const vignette = document.getElementById(options.vignette);
    if (vignette) {
      vignette.style.background =
        `radial-gradient(circle ${options.radius}px at ${e.clientX}px ${e.clientY}px,` +
        ` rgba(0,0,0,0) 0%, rgba(0,0,0,${options.strength}) 100%)`;
    }
  });

  section.addEventListener('mouseleave', () => {
    gsap.to(options.target, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    const vignette = document.getElementById(options.vignette);
    if (vignette) vignette.style.background = 'none';
  });
}
