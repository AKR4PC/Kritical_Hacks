import * as THREE from 'three';

/**
 * A single surveillance eye: institutional grey sclera, near-black limbal ring
 * and iris, void pupil, one off-centre fluorescent glint, and a barely-there
 * glassy cornea. Deliberately cold and unblinking.
 */
export function createBigBrotherEye(): THREE.Group {
  const eyeGroup = new THREE.Group();

  const eyeBall = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xb0aca0, roughness: 0.95, metalness: 0.0 })
  );
  eyeGroup.add(eyeBall);

  const limbus = new THREE.Mesh(
    new THREE.CircleGeometry(2.08, 64),
    new THREE.MeshStandardMaterial({ color: 0x070705, side: THREE.DoubleSide })
  );
  limbus.position.z = 3.83;
  eyeBall.add(limbus);

  const iris = new THREE.Mesh(
    new THREE.CircleGeometry(1.72, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0e0e0b,
      roughness: 0.22,
      metalness: 0.04,
      side: THREE.DoubleSide,
    })
  );
  iris.position.z = 3.87;
  eyeBall.add(iris);

  const pupil = new THREE.Mesh(
    new THREE.CircleGeometry(0.52, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  pupil.position.z = 3.92;
  eyeBall.add(pupil);

  // Cold fluorescent lamp reflection, off-centre.
  const glint = new THREE.Mesh(
    new THREE.CircleGeometry(0.16, 16),
    new THREE.MeshBasicMaterial({ color: 0xd8e4f0, transparent: true, opacity: 0.6 })
  );
  glint.position.set(0.3, 0.3, 3.93);
  eyeBall.add(glint);

  const cornea = new THREE.Mesh(
    new THREE.SphereGeometry(4.05, 32, 32),
    new THREE.MeshPhongMaterial({
      color: 0xc8d4e8,
      transparent: true,
      opacity: 0.06,
      shininess: 160,
      specular: 0xddeeff,
    })
  );
  eyeGroup.add(cornea);

  return eyeGroup;
}
