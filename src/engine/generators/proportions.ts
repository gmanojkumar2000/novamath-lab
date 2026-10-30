import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const proportionsGenerator: QuestionGenerator = {
  id: 'gen_proportions',
  name: 'Proportions and Equivalent Ratios',
  skillId: 'ratio_reasoning',
  strandId: 'ratios_rates',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const r1 = rng.pick([2, 3, 4, 5]);
    const r2 = rng.pick([3, 5, 7, 8, 9]);

    const multiplier = difficulty === 1
      ? rng.pick([2, 3, 4, 5])
      : rng.nextInt(3, 8);

    const givenPart1 = r1 * multiplier;
    const expectedAnswer = r2 * multiplier;

    const items = rng.pick([
      { a: 'liters of nitrogen', b: 'liters of hydrogen', context: 'ammonia synthesis' },
      { a: 'grams of copper', b: 'grams of zinc', context: 'brass alloy' },
      { a: 'drops of reagent', b: 'milliliters of buffer', context: 'DNA extraction' },
      { a: 'solar panels', b: 'battery cells', context: 'satellite power grid' },
    ]);

    const prompt = `In a ${items.context} protocol, the ratio of ${items.a} to ${items.b} is strictly ${r1} : ${r2}. If the lab uses ${givenPart1} ${items.a}, how many ${items.b} are required?`;
    const hint = `Find the scale factor: ${givenPart1} ÷ ${r1} = ${multiplier}. Then multiply ${r2} by ${multiplier}.`;
    const explanation = `The ratio is ${r1} : ${r2}. Multiplying both parts by ${multiplier} gives ${givenPart1} : ${expectedAnswer}. Therefore, ${expectedAnswer} ${items.b} are needed.`;

    const expectedStr = `${expectedAnswer}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      expectedAnswer + r2,
      expectedAnswer - r2,
      givenPart1 + r2,
      r2 * (multiplier + 1),
      Math.max(1, expectedAnswer - multiplier),
    ];

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      const str = `${d}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
    }

    let offset = 2;
    while (candidateSet.size < 4) {
      const str = `${expectedAnswer + offset}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
      offset += 4;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_prop_${rng.nextInt(100000, 999999)}`,
      skillId: proportionsGenerator.skillId,
      strandId: proportionsGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: proportionsGenerator.version,
    };
  },
};

