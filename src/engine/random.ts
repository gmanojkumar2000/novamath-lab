/**
 * NovaMath Lab — Deterministic Seeded PRNG
 * Mulberry32 implementation for reproducible question generation and testing.
 */

export interface Rng {
  seed: number;
  next(): number; // [0, 1)
  nextInt(min: number, max: number): number; // [min, max] inclusive
  pick<T>(items: T[]): T;
  shuffle<T>(items: T[]): T[];
}

export function createRng(initialSeed: number = Math.floor(Math.random() * 2147483647)): Rng {
  let s = initialSeed >>> 0;

  function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from empty array');
    }
    const idx = nextInt(0, items.length - 1);
    return items[idx];
  }

  function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  return {
    seed: initialSeed,
    next,
    nextInt,
    pick,
    shuffle,
  };
}
