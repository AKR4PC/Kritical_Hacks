import { isMobile, prefersReducedMotion } from './env';

/**
 * Full-viewport film grain. Rendered at a low internal resolution and scaled up
 * with `image-rendering: pixelated` so it reads as coarse analogue noise rather
 * than a smooth haze. It stays transparent until the story leaves the hero.
 */
export interface GrainOverlay {
  setOpacity(value: number): void;
  resize(): void;
  dispose(): void;
}

export function createGrainOverlay(): GrainOverlay {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;' +
    'z-index:999;opacity:0;image-rendering:pixelated;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const res = isMobile ? 4 : 1;

  const sizeToViewport = () => {
    canvas.width = Math.ceil(window.innerWidth / res);
    canvas.height = Math.ceil(window.innerHeight / res);
  };
  sizeToViewport();

  let frame = 0;
  if (!isMobile && !prefersReducedMotion) {
    const draw = () => {
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  }

  return {
    setOpacity: (value) => {
      canvas.style.opacity = String(value);
    },
    resize: sizeToViewport,
    dispose() {
      cancelAnimationFrame(frame);
      if (canvas.parentNode) document.body.removeChild(canvas);
    },
  };
}
