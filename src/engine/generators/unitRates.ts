import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const unitRatesGenerator: QuestionGenerator = {
  id: 'gen_unit_rates',
  name: 'Unit Rates',
  skillId: 'unit_rates',
  strandId: 'ratios_rates',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const scenario = rng.pick(['speed', 'price', 'sampling']);

    let prompt: string;
    let rate: number;
    let unit: string;
    let hint: string;
    let explanation: string;

    if (scenario === 'speed') {
      const hours = difficulty === 1 ? rng.pick([2, 3, 4, 5]) : rng.nextInt(3, 8);
      rate = difficulty === 1 ? rng.nextInt(15, 60) : rng.nextInt(45, 120);
      const totalDist = rate * hours;
      unit = 'km/h';

      prompt = `A solar-powered research vehicle travels ${totalDist} kilometers in ${hours} hours at a constant speed. What is its speed in kilometers per hour?`;
      hint = `Divide the total distance (${totalDist} km) by the total time (${hours} hours).`;
      explanation = `Unit rate = Total Distance ÷ Total Time = ${totalDist} ÷ ${hours} = ${rate} ${unit}.`;
    } else if (scenario === 'price') {
      const count = rng.pick([4, 5, 8, 10]);
      rate = rng.pick([2, 3, 4, 5, 6, 8]);
      const totalCost = count * rate;
      unit = 'per pack';

      prompt = `A science department buys a bundle of ${count} identical specimen containers for $${totalCost}. What is the cost per container?`;
      hint = `Divide the total cost ($${totalCost}) by the number of containers (${count}).`;
      explanation = `Cost per container = $${totalCost} ÷ ${count} = $${rate}.`;
    } else {
      const minutes = rng.pick([3, 4, 5, 6]);
      rate = rng.nextInt(12, 35);
      const totalSamples = rate * minutes;
      unit = 'samples/min';

      prompt = `An automated sensor centrifuge processes ${totalSamples} biological samples in ${minutes} minutes. At this constant rate, how many samples does it process per minute?`;
      hint = `Find the rate per 1 minute by dividing ${totalSamples} by ${minutes}.`;
      explanation = `Rate = ${totalSamples} ÷ ${minutes} = ${rate} samples per minute.`;
    }

    const expectedStr = scenario === 'price' ? `$${rate}` : `${rate} ${unit}`;

    const candidateSet = new Set<string>([expectedStr]);
    const offsetCandidates = [rate + 1, rate - 1, rate + 5, rate * 2, Math.max(1, Math.round(rate / 2))];

    for (const val of offsetCandidates) {
      if (candidateSet.size >= 4) break;
      const str = scenario === 'price' ? `$${val}` : `${val} ${unit}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
    }

    let offset = 2;
    while (candidateSet.size < 4) {
      const str = scenario === 'price' ? `$${rate + offset}` : `${rate + offset} ${unit}`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
      offset += 3;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_rate_${rng.nextInt(100000, 999999)}`,
      skillId: unitRatesGenerator.skillId,
      strandId: unitRatesGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: unitRatesGenerator.version,
    };
  },
};
