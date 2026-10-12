import { describe, it, expect } from 'vitest';
import { ALL_GENERATORS } from '../src/engine/generators';
import { createRng } from '../src/engine/random';
import { validateQuestionInvariants } from '../src/engine/types';

describe('Question Generators — Fixed Validation', () => {
  it('contains exactly 10 initial question generators', () => {
    expect(ALL_GENERATORS.length).toBe(10);
  });

  ALL_GENERATORS.forEach((generator) => {
    describe(`Generator: ${generator.name} (${generator.id})`, () => {
      it('satisfies basic metadata and versioning', () => {
        expect(generator.id).toMatch(/^gen_/);
        expect(generator.name.length).toBeGreaterThan(0);
        expect(generator.skillId.length).toBeGreaterThan(0);
        expect(generator.strandId.length).toBeGreaterThan(0);
        expect(generator.version).toMatch(/^\d+\.\d+\.\d+$/);
      });

      it('generates reproducible output given a fixed seed', () => {
        const rng1 = createRng(42);
        const q1 = generator.generate({ rng: rng1, difficulty: 1 });

        const rng2 = createRng(42);
        const q2 = generator.generate({ rng: rng2, difficulty: 1 });

        expect(q1.prompt).toBe(q2.prompt);
        expect(q1.expectedAnswer).toBe(q2.expectedAnswer);
        expect(q1.choices).toEqual(q2.choices);
        expect(q1.hint).toBe(q2.hint);
        expect(q1.explanation).toBe(q2.explanation);
      });

      it('generates valid questions across all difficulty levels (1, 2, 3)', () => {
        const rng = createRng(12345);
        for (const diff of [1, 2, 3] as const) {
          const q = generator.generate({ rng, difficulty: diff });
          const inv = validateQuestionInvariants(q);
          expect(inv.valid, `Failed on diff ${diff}: ${inv.errors.join('; ')}`).toBe(true);
        }
      });
    });
  });
});
