import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

/** One shared decoder instance for every Draco-compressed mesh on the page. */
let shared: DRACOLoader | null = null;

export function makeDracoLoader(): DRACOLoader {
  if (!shared) {
    shared = new DRACOLoader();
    shared.setDecoderPath(DRACO_DECODER_PATH);
  }
  return shared;
}
