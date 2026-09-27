import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createBigBrotherEye } from './bigBrotherEye';
import { makeDracoLoader } from './draco';
import { gsap, getLenis } from '../gsap';
import { isMobile, isTabletOrTouch, prefersReducedMotion, viewportHeight, viewportWidth } from '../env';
import type { GrainOverlay } from '../grain';

/** Slight pincushion lens so the propaganda wall feels shot, not rendered. */
const BarrelDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    strength: { value: 0.15 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float strength;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = dot(uv, uv);
      uv *= 1.0 + strength * dist;
      uv += 0.5;
      vec2 edge = smoothstep(0.0, 0.02, uv) * smoothstep(1.0, 0.98, uv);
      float edgeFactor = edge.x * edge.y;
      vec4 color = texture2D(tDiffuse, clamp(uv, 0.0, 1.0));
      gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), color, edgeFactor);
    }
  `,
};

/** Six eyes: two close and dominant, two mid-distance, two deep in the dark. */
const EYE_POSITIONS: [number, number, number][] = [
  [-7, 4, -6],
  [6, 3, -7],
  [-3, -2, -9],
  [5, -1, -11],
  [-9, 1, -13],
  [1, 6, -15],
];

// Larger near, smaller far — reinforces depth.
const EYE_SCALES = [0.5, 0.46, 0.36, 0.34, 0.26, 0.22];

/** The four digits that fall away from the hand: 2 0 2 6. */
const YEAR_DIGITS = ['2', '0', '2', '6'];

/** Attachment points for the strings each digit hangs from. */
const ROPE_OFFSETS = [
  new THREE.Vector3(-0.15, -0.9, 0.09),
  new THREE.Vector3(0.05, -0.95, 0.19),
  new THREE.Vector3(0.2, -0.9, 0.09),
  new THREE.Vector3(0.4, -0.65, 0.05),
];

const HAND_URL = `${import.meta.env.BASE_URL}models/hand.glb`;
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export interface HeroScene {
  /** Resolves when the hand is in the scene and the loader may retire. */
  readonly ready: Promise<void>;
  /** Called the instant the loader clears, to drop the hand into frame. */
  dropHandIntoFrame(): void;
  resize(grain: GrainOverlay): void;
  dispose(): void;
}

/** Camera framing, hand scale and letterboxing all follow one aspect rule. */
function framingFor(aspect: number) {
  if (aspect < 0.75) return { cameraZ: 12, handScale: 3.0 };
  if (aspect < 1.1) return { cameraZ: 9, handScale: 3.8 };
  return { cameraZ: 7, handScale: 4.5 };
}

export function createHeroScene(canvas: HTMLCanvasElement): HeroScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcc0000);

  const camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 0.1, 100);
  camera.position.set(0, 0, isMobile ? 11 : 7);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    canvas,
    powerPreference: 'high-performance',
  });
  renderer.setSize(viewportWidth, viewportHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  // Let touch gestures fall through to the scroll system.
  if (isTabletOrTouch) controls.enabled = false;

  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  const mainSpot = new THREE.SpotLight(0xffffff, 400);
  mainSpot.position.set(0, 12, 2);
  mainSpot.angle = 0.3;
  mainSpot.penumbra = 0.8;
  mainSpot.decay = 1.5;
  scene.add(mainSpot);

  const fillLight = new THREE.PointLight(0xffffff, 40);
  fillLight.position.set(0, -4, 4);
  scene.add(fillLight);

  const eyeLight = new THREE.PointLight(0xffffff, 80);
  eyeLight.position.set(0, 0, 5);
  scene.add(eyeLight);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  if (!isMobile) {
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(viewportWidth, viewportHeight), 0.4, 0.1, 0.8));
    // FilmPass(intensity, grayscale). The source also passes (1024, false);
    // three r161 reads only these two arguments, and the 0.3 it puts in
    // `grayscale` is coerced to false by WebGL — so the look is identical.
    composer.addPass(new FilmPass(0.7, false));
    composer.addPass(new ShaderPass(BarrelDistortionShader));
  }

  const eyes: THREE.Group[] = [];
  if (!isMobile) {
    EYE_POSITIONS.forEach((position, i) => {
      const eye = createBigBrotherEye();
      eye.scale.setScalar(EYE_SCALES[i]);
      eye.position.set(...position);
      scene.add(eye);
      eyes.push(eye);
    });
  }

  const digits: THREE.Mesh[] = [];
  new FontLoader().load(FONT_URL, (font) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.1,
      roughness: 0.9,
    });
    YEAR_DIGITS.forEach((digit) => {
      const geometry = new TextGeometry(digit, {
        font,
        size: 0.8,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      digits.push(mesh);
    });
  });

  const ropeLines: THREE.Line[] = [];
  let hand: THREE.Object3D | undefined;

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(makeDracoLoader());

  const ready = new Promise<void>((resolve) => {
    gltfLoader.load(HAND_URL, (gltf) => {
      hand = gltf.scene;
      hand.scale.setScalar(isMobile ? 3.2 : 4.5);
      hand.rotation.set(Math.PI, Math.PI, Math.PI);
      hand.position.y = 10;
      scene.add(hand);

      ROPE_OFFSETS.forEach(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, -1.2, 0),
        ]);
        const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
        scene.add(line);
        ropeLines.push(line);
      });

      resolve();
    });
  });

  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / viewportWidth) * 2 - 1;
    mouse.y = -(e.clientY / viewportHeight) * 2 + 1;
  });

  const mouse3D = new THREE.Vector3();

  let frame = 0;
  function animate(time: number): void {
    frame = requestAnimationFrame(animate);
    getLenis()?.raf(time);
    controls.update();

    if (hand) {
      if (!prefersReducedMotion) {
        hand.rotation.y += (mouse.x * 0.3 + Math.PI - hand.rotation.y) * 0.05;
        hand.rotation.x += (-mouse.y * 0.15 + Math.PI - hand.rotation.x) * 0.05;
      }

      ROPE_OFFSETS.forEach((offset, i) => {
        const worldPos = offset.clone().applyMatrix4(hand!.matrixWorld);
        const endPos = worldPos.clone();
        endPos.y -= 1.2;
        const positions = ropeLines[i].geometry.attributes.position;
        positions.setXYZ(0, worldPos.x, worldPos.y, worldPos.z);
        positions.setXYZ(1, endPos.x, endPos.y, endPos.z);
        positions.needsUpdate = true;
        if (digits[i]) digits[i].position.set(endPos.x, endPos.y - 0.4, endPos.z);
      });
    }

    if (!prefersReducedMotion) {
      mouse3D.set(mouse.x * 10, mouse.y * 10, 0);
      eyes.forEach((eye) => eye.lookAt(mouse3D));
    }

    if (isMobile) renderer.render(scene, camera);
    else composer.render();
  }
  requestAnimationFrame(animate);

  return {
    ready,
    resize(grain) {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const aspect = nw / nh;
      const { cameraZ, handScale } = framingFor(aspect);

      camera.aspect = aspect;
      // Pull the camera back on portrait so the hand stays in frame.
      camera.position.z = cameraZ;
      camera.updateProjectionMatrix();

      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
      grain.resize();
      if (hand) hand.scale.setScalar(handScale);
    },
    /** Wired by the loader; drops the hand from above into frame. */
    dropHandIntoFrame() {
      if (!hand) return;
      if (prefersReducedMotion) hand.position.y = 2.5;
      else gsap.to(hand.position, { y: 2.5, duration: 3, ease: 'power4.out' });
    },
    dispose() {
      cancelAnimationFrame(frame);
      controls.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
