/**
 * Smoothed scroll speed, shared by everything that reacts to how fast the
 * visitor is scrolling: the two prose columns in section 6 blur and speed up
 * with it, and the book winds up. The scroll director writes the raw value; the
 * section 6 animation loop decays it once per frame.
 */
let value = 0;

export const scrollVelocity = {
  get: (): number => value,
  set(next: number): void {
    value = next;
  },
  decay(): number {
    value *= 0.9;
    return value;
  },
};
