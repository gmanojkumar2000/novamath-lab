import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const equationsGenerator: QuestionGenerator = {
  id: 'gen_equations',
  name: 'One- and Two-Step Equations',
  skillId: 'one_step_equations',
  strandId: 'expressions_equations',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const variable = rng.pick(['x', 'y', 'n', 'm', 'p']);

    let prompt: string;
    let expectedAnswer: number;
    let hint: string;
    let explanation: string;

    if (difficulty === 1) {
      // One-step addition / subtraction
      expectedAnswer = rng.nextInt(4, 25);
      const isAdd = rng.next() > 0.5;
      const b = rng.nextInt(5, 30);

      if (isAdd) {
        const total = expectedAnswer + b;
        prompt = `Solve for ${variable}: ${variable} + ${b} = ${total}`;
        hint = `Subtract ${b} from both sides of the equation to isolate ${variable}.`;
        explanation = `${variable} = ${total} − ${b} = ${expectedAnswer}. Check: ${expectedAnswer} + ${b} = ${total}.`;
      } else {
        const total = expectedAnswer - b > 0 ? expectedAnswer - b : expectedAnswer;
        const sub = expectedAnswer - total;
        prompt = `Solve for ${variable}: ${variable} − ${sub} = ${total}`;
        hint = `Add ${sub} to both sides of the equation to isolate ${variable}.`;
        explanation = `${variable} = ${total} + ${sub} = ${expectedAnswer}. Check: ${expectedAnswer} − ${sub} = ${total}.`;
      }
    } else if (difficulty === 2) {
      // One-step multiplication / division
      expectedAnswer = rng.nextInt(3, 15);
      const isMult = rng.next() > 0.5;

      if (isMult) {
        const a = rng.pick([3, 4, 5, 6, 7, 8, 9]);
        const total = a * expectedAnswer;
        prompt = `Solve for ${variable}: ${a}${variable} = ${total}`;
        hint = `Divide both sides by ${a} to isolate ${variable}.`;
        explanation = `${variable} = ${total} ÷ ${a} = ${expectedAnswer}.`;
      } else {
        const d = rng.pick([3, 4, 5, 6]);
        const total = expectedAnswer;
        const product = total * d;
        prompt = `Solve for ${variable}: ${variable} / ${d} = ${total}`;
        expectedAnswer = product;
        hint = `Multiply both sides by ${d} to isolate ${variable}.`;
        explanation = `${variable} = ${total} × ${d} = ${expectedAnswer}.`;
      }
    } else {
      // Two-step equation: ax + b = c
      expectedAnswer = rng.nextInt(3, 12);
      const a = rng.pick([2, 3, 4, 5]);
      const b = rng.nextInt(2, 15);
      const isPlus = rng.next() > 0.5;

      if (isPlus) {
        const c = a * expectedAnswer + b;
        prompt = `Solve for ${variable}: ${a}${variable} + ${b} = ${c}`;
        hint = `Step 1: Subtract ${b} from both sides. Step 2: Divide by ${a}.`;
        explanation = `${a}${variable} = ${c} − ${b} = ${a * expectedAnswer}. Then ${variable} = ${a * expectedAnswer} ÷ ${a} = ${expectedAnswer}.`;
      } else {
        const c = a * expectedAnswer - b;
        prompt = `Solve for ${variable}: ${a}${variable} − ${b} = ${c}`;
        hint = `Step 1: Add ${b} to both sides. Step 2: Divide by ${a}.`;
        explanation = `${a}${variable} = ${c} + ${b} = ${a * expectedAnswer}. Then ${variable} = ${a * expectedAnswer} ÷ ${a} = ${expectedAnswer}.`;
      }
    }

    const expectedStr = `${expectedAnswer}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      expectedAnswer + 1,
      Math.max(1, expectedAnswer - 1),
      expectedAnswer + 2,
      expectedAnswer + 5,
    ];

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      const str = `${d}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
    }

    let offset = 3;
    while (candidateSet.size < 4) {
      const str = `${expectedAnswer + offset}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
      offset += 2;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_eq_${rng.nextInt(100000, 999999)}`,
      skillId: equationsGenerator.skillId,
      strandId: equationsGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: equationsGenerator.version,
    };
  },
};
