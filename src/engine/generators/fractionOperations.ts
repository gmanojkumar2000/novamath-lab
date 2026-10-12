import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';
import { Fraction } from '../fraction';

export const fractionOperationsGenerator: QuestionGenerator = {
  id: 'gen_fraction_operations',
  name: 'Fraction Operations',
  skillId: 'fraction_operations',
  strandId: 'fractions_decimals',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const op = difficulty === 1
      ? rng.pick(['+', '-'])
      : rng.pick(['+', '-', '*', '/']);

    let d1: number, d2: number, n1: number, n2: number;

    if (difficulty === 1) {
      // Like denominators or simple halves/fourths/sixths/eighths
      const commonDen = rng.pick([4, 5, 6, 8, 10, 12]);
      d1 = commonDen;
      d2 = commonDen;
      n1 = rng.nextInt(1, commonDen - 1);
      n2 = rng.nextInt(1, commonDen - 1);
      if (op === '-' && n1 < n2) {
        const t = n1; n1 = n2; n2 = t;
      }
      if (op === '-' && n1 === n2) {
        n1 = Math.min(commonDen - 1, n2 + 1);
        if (n1 === n2) {
          n2 = Math.max(1, n1 - 1);
          if (n1 === n2) {
            n1 = 2;
            n2 = 1;
          }
        }
      }
    } else if (difficulty === 2) {
      d1 = rng.pick([2, 3, 4, 5, 6]);
      d2 = rng.pick([2, 3, 4, 5, 6, 8]);
      n1 = rng.nextInt(1, d1 * 2);
      n2 = rng.nextInt(1, d2 * 2);
      if (op === '-') {
        if (n1 * d2 === n2 * d1) {
          n1 += 1;
        } else if (n1 * d2 < n2 * d1) {
          const tn = n1; const td = d1;
          n1 = n2; d1 = d2;
          n2 = tn; d2 = td;
        }
      }
    } else {
      // Level 3: varied denominators up to 12
      d1 = rng.nextInt(3, 10);
      d2 = rng.nextInt(3, 12);
      n1 = rng.nextInt(2, d1 * 2 + 1);
      n2 = rng.nextInt(2, d2 * 2 + 1);
      if (op === '-') {
        if (n1 * d2 === n2 * d1) {
          n1 += 1;
        } else if (n1 * d2 < n2 * d1) {
          const tn = n1; const td = d1;
          n1 = n2; d1 = d2;
          n2 = tn; d2 = td;
        }
      }
    }

    const f1 = new Fraction(n1, d1);
    const f2 = new Fraction(n2, d2);

    let result: Fraction;
    let opSymbol: string;
    let hint: string;
    let explanation: string;

    if (op === '+') {
      result = f1.add(f2);
      opSymbol = '+';
      hint = f1.den === f2.den
        ? 'Since the denominators are already the same, add the numerators together.'
        : `Find a common denominator for ${f1.den} and ${f2.den} before adding.`;
      explanation = f1.den === f2.den
        ? `${f1} + ${f2} = (${f1.num} + ${f2.num})/${f1.den} = ${result}.`
        : `Convert to a common denominator: ${f1} + ${f2} = ${result}. Always simplify to simplest form.`;
    } else if (op === '-') {
      result = f1.sub(f2);
      opSymbol = '−';
      hint = f1.den === f2.den
        ? 'Since the denominators match, subtract the second numerator from the first.'
        : `Find a common denominator for ${f1.den} and ${f2.den} before subtracting.`;
      explanation = `${f1} − ${f2} = ${result} in simplest form.`;
    } else if (op === '*') {
      result = f1.mul(f2);
      opSymbol = '×';
      hint = 'Multiply the numerators together, then multiply the denominators together.';
      explanation = `(${f1.num} × ${f2.num}) / (${f1.den} × ${f2.den}) = ${result} in simplest form.`;
    } else {
      result = f1.div(f2);
      opSymbol = '÷';
      hint = 'Remember: dividing by a fraction is the same as multiplying by its reciprocal (flip the second fraction).';
      const reciprocal = new Fraction(f2.den, f2.num);
      explanation = `${f1} ÷ ${f2} = ${f1} × ${reciprocal} = ${result} in simplest form.`;
    }

    const expectedStr = result.toString();

    // Generate 3 realistic distractors
    const candidateSet = new Set<string>([expectedStr]);
    const distractors: Fraction[] = [
      result.add(new Fraction(1, result.den)),
      result.sub(new Fraction(1, result.den)),
      new Fraction(f1.num + f2.num, f1.den + f2.den), // common mistake: adding numerators & denominators
      new Fraction(result.num + 1, result.den),
      new Fraction(Math.max(1, result.num - 1), result.den + 1),
    ];

    // Zero is a valid subtraction result, but it cannot be inverted.
    if (result.num !== 0) {
      distractors.push(new Fraction(result.den, result.num));
    }

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      const str = d.toString();
      if (str !== expectedStr && !candidateSet.has(str)) {
        candidateSet.add(str);
      }
    }

    // Fallback if needed
    let counter = 1;
    while (candidateSet.size < 4) {
      const fallback = new Fraction(result.num + counter, result.den).toString();
      if (!candidateSet.has(fallback)) {
        candidateSet.add(fallback);
      }
      counter++;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_frac_${rng.nextInt(100000, 999999)}`,
      skillId: fractionOperationsGenerator.skillId,
      strandId: fractionOperationsGenerator.strandId,
      difficulty,
      prompt: `Calculate: ${f1} ${opSymbol} ${f2}`,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: fractionOperationsGenerator.version,
    };
  },
};
