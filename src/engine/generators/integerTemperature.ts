import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const integerTemperatureGenerator: QuestionGenerator = {
  id: 'gen_integer_temperature',
  name: 'Integer Temperature & Signed Numbers',
  skillId: 'integer_concepts',
  strandId: 'integers',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const isDifference = rng.next() > 0.5;

    let prompt: string;
    let expectedAnswer: number;
    let hint: string;
    let explanation: string;

    if (isDifference) {
      const low = difficulty === 1 ? rng.nextInt(-10, -1) : rng.nextInt(-25, -2);
      const high = difficulty === 1 ? rng.nextInt(2, 12) : rng.nextInt(5, 25);
      expectedAnswer = high - low;

      prompt = `A weather station recorded an overnight low of ${low}°C and an afternoon high of ${high}°C. What was the total change in temperature?`;
      hint = `Think of a number line: from ${low}°C up to 0°C is ${Math.abs(low)} degrees, plus another ${high} degrees to reach ${high}°C.`;
      explanation = `Total change = High − Low = ${high} − (${low}) = ${high} + ${Math.abs(low)} = ${expectedAnswer}°C.`;
    } else {
      const start = difficulty === 1 ? rng.nextInt(-10, 5) : rng.nextInt(-20, 10);
      const isDrop = start > 0 ? rng.next() > 0.4 : false;
      const change = rng.nextInt(3, 18);

      if (isDrop) {
        expectedAnswer = start - change;
        prompt = `At 4:00 PM the temperature was ${start}°C. During a cold front, it dropped by ${change}°C. What was the new temperature?`;
        hint = `Start at ${start} on the number line and move left by ${change} units.`;
        explanation = `${start} − ${change} = ${expectedAnswer}°C.`;
      } else {
        expectedAnswer = start + change;
        prompt = `At sunrise the temperature was ${start}°C. By early afternoon, it rose by ${change}°C. What was the afternoon temperature?`;
        hint = `Start at ${start} on the number line and move right by ${change} units.`;
        explanation = `${start} + ${change} = ${expectedAnswer}°C.`;
      }
    }

    const expectedStr = `${expectedAnswer}°C`;

    // Distractor set
    const candidateSet = new Set<string>([expectedStr]);
    const numericDistractors = [
      -expectedAnswer,
      expectedAnswer + 2,
      expectedAnswer - 2,
      expectedAnswer + 10,
      expectedAnswer - 10,
    ];

    for (const d of numericDistractors) {
      if (candidateSet.size >= 4) break;
      const str = `${d}°C`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
    }

    let offset = 1;
    while (candidateSet.size < 4) {
      const str = `${expectedAnswer + offset}°C`;
      if (!candidateSet.has(str)) {
        candidateSet.add(str);
      }
      offset += 3;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_int_${rng.nextInt(100000, 999999)}`,
      skillId: integerTemperatureGenerator.skillId,
      strandId: integerTemperatureGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: integerTemperatureGenerator.version,
    };
  },
};
