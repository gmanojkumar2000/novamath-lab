import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const statisticsMeanGenerator: QuestionGenerator = {
  id: 'gen_statistics_mean',
  name: 'Measures of Center (Mean & Median)',
  skillId: 'measures_of_center',
  strandId: 'statistics',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const isMissingValue = difficulty === 3 && rng.next() > 0.5;

    let prompt: string;
    let expectedVal: number;
    let hint: string;
    let explanation: string;

    if (isMissingValue) {
      const targetMean = rng.nextInt(75, 92);
      const s1 = targetMean + rng.nextInt(-8, 8);
      const s2 = targetMean + rng.nextInt(-8, 8);
      const s3 = targetMean + rng.nextInt(-8, 8);
      const totalNeeded = targetMean * 4;
      expectedVal = totalNeeded - (s1 + s2 + s3);

      prompt = `An environmental science student records daily water quality scores: ${s1}, ${s2}, and ${s3}. What score must be obtained on Day 4 to have an overall mean score of ${targetMean}?`;
      hint = `To average ${targetMean} over 4 days, the 4 scores must total 4 × ${targetMean} = ${totalNeeded}. Subtract the sum of the first 3 scores from ${totalNeeded}.`;
      explanation = `Sum of first 3 scores = ${s1 + s2 + s3}. Target total for 4 scores = 4 × ${targetMean} = ${totalNeeded}. Day 4 score = ${totalNeeded} − ${s1 + s2 + s3} = ${expectedVal}.`;
    } else {
      const count = difficulty === 1 ? 4 : 5;
      const targetMean = rng.nextInt(12, 35);
      const offsets: number[] = [];

      for (let i = 0; i < count - 1; i++) {
        offsets.push(rng.nextInt(-6, 6));
      }
      const sumOfOffsets = offsets.reduce((a, b) => a + b, 0);
      offsets.push(-sumOfOffsets);

      const dataset = rng.shuffle(offsets.map((o) => targetMean + o));
      expectedVal = targetMean;

      prompt = `A field researcher records the following ${count} temperature measurements in degrees Celsius: ${dataset.join(', ')}. What is the mean (average) temperature?`;
      hint = `Add all ${count} values together to find their sum, then divide by ${count}.`;
      explanation = `Sum = ${dataset.join(' + ')} = ${dataset.reduce((a, b) => a + b, 0)}. Mean = ${dataset.reduce((a, b) => a + b, 0)} ÷ ${count} = ${expectedVal}°C.`;
    }

    const expectedStr = `${expectedVal}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      expectedVal + 1,
      expectedVal - 1,
      expectedVal + 3,
      expectedVal - 3,
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
      const str = `${expectedVal + offset}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
      offset += 3;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_stat_${rng.nextInt(100000, 999999)}`,
      skillId: statisticsMeanGenerator.skillId,
      strandId: statisticsMeanGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: statisticsMeanGenerator.version,
    };
  },
};
