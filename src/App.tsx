import { useEffect, useRef } from 'react';
import { Loader } from './components/Loader';
import { CornerSlogans } from './components/CornerSlogans';
import { HeroCanvas } from './components/HeroCanvas';
import { Section2Prisoners } from './components/Section2Prisoners';
import { Section3Bulletin } from './components/Section3Bulletin';
import { Section4Portrait } from './components/Section4Portrait';
import { Section6Book } from './components/Section6Book';
import { Section7Cards } from './components/Section7Cards';
import { Section8Closing } from './components/Section8Closing';
import { startLoader } from './lib/loaderController';
import { createGrainOverlay } from './lib/grain';
import { createHeroScene } from './lib/three/heroScene';
import { createBookScene } from './lib/three/bookScene';
import { startScrollDirector } from './lib/scrollDirector';
import { attachCursorTilt } from './lib/scenes/cursorTilt';
import { startBookColumnLoop } from './lib/scenes/bookColumns';
import { attachCursorLabel } from './lib/cursorLabel';

/**
 * The whole experience. Every chapter is mounted once and stays mounted; the
 * scroll director decides which one is on screen. This component's only job is
 * to hand the DOM nodes to the imperative layers — Three.js, GSAP timelines and
 * the scroll state machine — which own the animation.
 */
export default function App() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const bookCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaderRoot = loaderRef.current;
    const heroCanvas = heroCanvasRef.current;
    const bookCanvas = bookCanvasRef.current;
    const cursor = cursorRef.current;
    if (!loaderRoot || !heroCanvas || !bookCanvas || !cursor) return;

    const loader = startLoader(loaderRoot);
    if (!loader) return;

    const hero = createHeroScene(heroCanvas);
    loader.awaitHero(hero.ready);
    loader.onHidden(hero.dropHandIntoFrame);

    const book = createBookScene(bookCanvas);
    const grain = createGrainOverlay();

    startBookColumnLoop();
    attachCursorTilt({
      section: 'section-2',
      target: '#s2-prisoners',
      vignette: 's2-vignette',
      maxY: 10,
      maxX: 6,
      radius: 420,
      strength: 0.28,
    });
    attachCursorTilt({
      section: 'section-4',
      target: '#s4-woman',
      vignette: 's4-vignette',
      maxY: 10,
      maxX: 6,
      radius: 420,
      strength: 0.28,
    });
    attachCursorLabel(cursor);

    const director = startScrollDirector({ grain, book, hero });

    return () => {
      director.dispose();
      hero.dispose();
      book.dispose();
      grain.dispose();
    };
  }, []);

  return (
    <>
      <Loader ref={loaderRef} />
      <CornerSlogans />
      <HeroCanvas ref={heroCanvasRef} />
      <Section2Prisoners />
      <Section3Bulletin />
      <Section4Portrait />
      <Section6Book ref={bookCanvasRef} />
      <Section7Cards />
      <Section8Closing />
      <div id="cursor-text" ref={cursorRef} />
    </>
  );
}
