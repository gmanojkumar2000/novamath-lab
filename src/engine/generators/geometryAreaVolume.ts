import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const geometryAreaVolumeGenerator: QuestionGenerator = {
  id: 'gen_geometry_area_volume',
  name: 'Geometric Area and Volume',
  skillId: 'area_composite_shapes',
  strandId: 'geometry',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const isVolume = difficulty >= 2 && rng.next() > 0.5;

    let prompt: string;
    let expectedVal: number;
    let unit: string;
    let hint: string;
    let explanation: string;

    if (isVolume) {
      // Rectangular prism volume
      const l = rng.nextInt(3, 10);
      const w = rng.nextInt(2, 6);
      const h = rng.nextInt(2, 8);
      expectedVal = l * w * h;
      unit = 'cm³';

      prompt = `A rectangular geological sample box has a length of ${l} cm, width of ${w} cm, and height of ${h} cm. What is its volume?`;
      hint = `Volume of a rectangular prism = Length × Width × Height (V = l × w × h).`;
      explanation = `V = ${l} × ${w} × ${h} = ${expectedVal} cm³.`;
    } else {
      // Triangle or Parallelogram area
      const isTriangle = rng.next() > 0.4;
      if (isTriangle) {
        // Make either base or height even so area is integer
        const b = rng.pick([4, 6, 8, 10, 12, 14]);
        const h = rng.nextInt(3, 15);
        expectedVal = (b * h) / 2;
        unit = 'm²';

        prompt = `A triangular solar panel mount has a base of ${b} meters and a perpendicular height of ${h} meters. What is its area?`;
        hint = `Area of a triangle = (1/2) × base × height (A = 1/2 × b × h).`;
        explanation = `A = (1/2) × ${b} × ${h} = ${b / 2} × ${h} = ${expectedVal} m².`;
      } else {
        const b = rng.nextInt(4, 15);
        const h = rng.nextInt(3, 12);
        expectedVal = b * h;
        unit = 'cm²';

        prompt = `A robotic sensor aperture is shaped like a parallelogram with a base of ${b} cm and a height of ${h} cm. What is its area?`;
        hint = `Area of a parallelogram = base × height (A = b × h).`;
        explanation = `A = ${b} × ${h} = ${expectedVal} cm².`;
      }
    }

    const expectedStr = `${expectedVal} ${unit}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      `${expectedVal * 2} ${unit}`, // Forgot 1/2 for triangle
      `${Math.max(1, Math.round(expectedVal / 2))} ${unit}`,
      `${expectedVal + 4} ${unit}`,
      `${expectedVal - 4} ${unit}`,
      `${expectedVal + 10} ${unit}`,
    ];

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      if (!candidateSet.has(d)) {
        candidateSet.add(d);
      }
    }

    let offset = 6;
    while (candidateSet.size < 4) {
      const d = `${expectedVal + offset} ${unit}`;
      if (!candidateSet.has(d)) {
        candidateSet.add(d);
      }
      offset += 5;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_geom_${rng.nextInt(100000, 999999)}`,
      skillId: geometryAreaVolumeGenerator.skillId,
      strandId: geometryAreaVolumeGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: geometryAreaVolumeGenerator.version,
    };
  },
};

