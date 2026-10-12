import { describe, it, expect } from 'vitest';
import { ALL_GENERATORS } from '../src/engine/generators';
import { createRng } from '../src/engine/random';
import { validateQuestionInvariants } from '../src/engine/types';

describe('Question Generators — 1,000+ Invariant Stress Tests', () => {
  const ITERATIONS_PER_GENERATOR = 1000;

  ALL_GENERATORS.forEach((generator) => {
    it(`guarantees invariants over ${ITERATIONS_PER_GENERATOR} randomized runs for ${generator.name}`, () => {
      const rng = createRng(987654321);

      for (let i = 0; i < ITERATIONS_PER_GENERATOR; i++) {
        const difficulty = ((i % 3) + 1) as 1 | 2 | 3;
        const q = generator.generate({ rng, difficulty });

        const validation = validateQuestionInvariants(q);
        expect(
          validation.valid,
          `Invariant violation on iteration ${i} (${generator.id}): ${validation.errors.join(', ')} | Prompt: "${q.prompt}"`
        ).toBe(true);

        // Multiple choice invariants
        if (q.responseType === 'multiple_choice' && q.choices) {
          expect(q.choices.length).toBe(4);
          const unique = new Set(q.choices);
          expect(unique.size).toBe(4);
          expect(q.choices).toContain(String(q.expectedAnswer));
        }

        // Integrity against missing / malformed text
        expect(q.prompt).not.toContain('NaN');
        expect(q.prompt).not.toContain('undefined');
        expect(q.explanation).not.toContain('NaN');
        expect(q.hint).not.toContain('NaN');
      }
    });
  });
});
