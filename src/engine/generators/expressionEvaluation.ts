import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const expressionEvaluationGenerator: QuestionGenerator = {
  id: 'gen_expression_evaluation',
  name: 'Algebraic Expression Evaluation',
  skillId: 'algebraic_expressions',
  strandId: 'expressions_equations',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    let prompt: string;
    let expectedAnswer: number;
    let hint: string;
    let explanation: string;

    if (difficulty === 1) {
      const a = rng.nextInt(2, 6);
      const b = rng.nextInt(3, 15);
      const x = rng.nextInt(2, 8);
      expectedAnswer = a * x + b;

      prompt = `Evaluate the expression ${a}x + ${b} when x = ${x}.`;
      hint = `Substitute ${x} in place of x: calculate (${a} × ${x}) + ${b}.`;
      explanation = `${a}(${x}) + ${b} = ${a * x} + ${b} = ${expectedAnswer}.`;
    } else if (difficulty === 2) {
      const k = rng.nextInt(2, 5);
      const m = rng.nextInt(2, 4);
      const n = rng.nextInt(1, 5);
      const y = rng.nextInt(3, 8);
      expectedAnswer = k * (m * y - n);

      prompt = `Evaluate the expression ${k}(${m}y − ${n}) when y = ${y}.`;
      hint = `Follow order of operations: first evaluate inside the parentheses (${m} × ${y} − ${n}), then multiply by ${k}.`;
      explanation = `Inside parentheses: ${m}(${y}) − ${n} = ${m * y} − ${n} = ${m * y - n}. Multiply by ${k}: ${k} × ${m * y - n} = ${expectedAnswer}.`;
    } else {
      const x = rng.nextInt(2, 5);
      const y = rng.nextInt(1, 6);
      const a = rng.pick([2, 3]);
      const b = rng.nextInt(2, 5);
      expectedAnswer = a * (x * x) + b * y;

      prompt = `Evaluate the expression ${a}x² + ${b}y when x = ${x} and y = ${y}.`;
      hint = `Compute the exponent first: x² = ${x} × ${x} = ${x * x}. Then perform the multiplications and add.`;
      explanation = `${a}(${x})² + ${b}(${y}) = ${a}(${x * x}) + ${b * y} = ${a * x * x} + ${b * y} = ${expectedAnswer}.`;
    }

    const expectedStr = `${expectedAnswer}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      expectedAnswer + 2,
      expectedAnswer - 2,
      expectedAnswer + 10,
      expectedAnswer - 5,
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
      offset += 4;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_expr_${rng.nextInt(100000, 999999)}`,
      skillId: expressionEvaluationGenerator.skillId,
      strandId: expressionEvaluationGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: expressionEvaluationGenerator.version,
    };
  },
};
