import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { makeDracoLoader } from './draco';
import { isMobile, prefersReducedMotion, viewportHeight, viewportWidth } from '../env';

const BOOK_URL = `${import.meta.env.BASE_URL}the-book.glb`;

/**
 * The forbidden book, floating in the middle of section 6. It only spins while
 * the section is live, and it leans toward the visitor's cursor.
 */
export interface BookScene {
  /**
   * Advances the idle spin and renders, but only while the section is live.
   * `velocity` is the director's smoothed scroll speed, so fast scrolling
   * visibly winds the book up.
   */
  tick(velocity: number): void;
  setActive(active: boolean): void;
  /** Cursor-relative lean, in radians. */
  setTilt(x: number, z: number): void;
  resize(): void;
  dispose(): void;
}

export function createBookScene(canvas: HTMLCanvasElement): BookScene {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    canvas,
    powerPreference: 'high-performance',
  });
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const keyLight = new THREE.SpotLight(0xffffff, 100);
  keyLight.position.set(0, 8, 5);
  keyLight.angle = 0.4;
  keyLight.penumbra = 0.8;
  scene.add(keyLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.1));

  let book: THREE.Object3D | null = null;
  let active = false;
  let tiltX = 0;
  let tiltZ = 0;

  const loader = new GLTFLoader();
  loader.setDRACOLoader(makeDracoLoader());
  loader.load(BOOK_URL, (gltf) => {
    book = gltf.scene;
    book.scale.setScalar(isMobile ? 1.1 : 2);
    book.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: 0x111111,
          roughness: 0.9,
          metalness: 0.1,
        });
      }
    });
    scene.add(book);
  });

  return {
    tick(velocity) {
      if (!active) return;
      if (book && !prefersReducedMotion) {
        book.rotation.y += 0.005 + velocity * 0.08;
        book.rotation.x += (tiltX - book.rotation.x) * 0.04;
        book.rotation.z += (tiltZ - book.rotation.z) * 0.04;
      }
      renderer.render(scene, camera);
    },
    setActive(next) {
      active = next;
    },
    setTilt(x, z) {
      tiltX = x;
      tiltZ = z;
    },
    resize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    },
    dispose() {
      renderer.dispose();
    },
  };
}
