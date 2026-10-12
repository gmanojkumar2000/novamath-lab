import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';
import { Fraction } from '../fraction';

export const probabilitySimpleGenerator: QuestionGenerator = {
  id: 'gen_probability_simple',
  name: 'Simple Theoretical Probability',
  skillId: 'probability_models',
  strandId: 'statistics',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const targetCount = rng.pick([2, 3, 4, 5, 6]);
    const other1 = rng.nextInt(2, 6);
    const other2 = difficulty >= 2 ? rng.nextInt(1, 4) : 0;
    const total = targetCount + other1 + other2;

    const probFraction = new Fraction(targetCount, total);

    const items = rng.pick([
      { target: 'lunar core drill bits', other1: 'titanium bolts', other2: 'sensor chips', container: 'an equipment pouch' },
      { target: 'blue quartz specimens', other1: 'red garnet crystals', other2: 'green jade fragments', container: 'a geology collection tray' },
      { target: 'labeled amber test vials', other1: 'clear saline vials', other2: 'refrigerated tubes', container: 'a biosafety storage box' },
      { target: 'micro-rover spare wheels', other1: 'antenna relays', other2: 'solar connectors', container: 'a parts bin' },
    ]);

    const otherDesc = other2 > 0
      ? `${other1} ${items.other1}, and ${other2} ${items.other2}`
      : `${other1} ${items.other1}`;

    const prompt = `A lab assistant has ${containerDesc(items.container, targetCount, items.target, otherDesc)}. If one item is selected at random, what is the probability of picking one of the ${items.target}? Give your answer as a fraction in simplest form.`;

    const hint = `Probability = (Number of favorable outcomes) / (Total number of possible outcomes) = ${targetCount} / ${total}. Reduce the fraction if possible.`;

    const explanation = `Total items = ${targetCount} + ${other1}${other2 > 0 ? ` + ${other2}` : ''} = ${total}. Probability = ${targetCount}/${total} = ${probFraction} in simplest form.`;

    const expectedStr = probFraction.toString();

    // Distractor set
    const candidateSet = new Set<string>([expectedStr]);
    const distractors: Fraction[] = [
      new Fraction(other1, total),
      new Fraction(total - targetCount, total), // Complementary probability
      new Fraction(targetCount, total + 1),
      probFraction.add(new Fraction(1, probFraction.den)),
      probFraction.sub(new Fraction(1, probFraction.den)),
    ];

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      if (d.num > 0 && d.den > 0 && d.num < d.den) {
        const str = d.toString();
        if (!candidateSet.has(str)) {
          candidateSet.add(str);
        }
      }
    }

    let den = probFraction.den === 2 ? 3 : probFraction.den;
    let num = 1;
    while (candidateSet.size < 4) {
      const fallback = new Fraction(num, den).toString();
      if (!candidateSet.has(fallback)) {
        candidateSet.add(fallback);
      }
      num++;
      if (num >= den) {
        den++;
        num = 1;
      }
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_prob_${rng.nextInt(100000, 999999)}`,
      skillId: probabilitySimpleGenerator.skillId,
      strandId: probabilitySimpleGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: probabilitySimpleGenerator.version,
    };
  },
};

function containerDesc(container: string, targetCount: number, target: string, otherDesc: string): string {
  return `${container} with ${targetCount} ${target}, ${otherDesc}`;
}
