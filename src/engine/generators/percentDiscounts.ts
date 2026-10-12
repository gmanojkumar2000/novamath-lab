import type { Question } from '../../domain/types';
import type { GeneratorContext, QuestionGenerator } from '../types';

export const percentDiscountsGenerator: QuestionGenerator = {
  id: 'gen_percent_discounts',
  name: 'Percent Discounts and Applications',
  skillId: 'percent_applications',
  strandId: 'ratios_rates',
  version: '1.0.0',

  generate({ rng, difficulty }: GeneratorContext): Question {
    const percents = difficulty === 1
      ? [10, 20, 25, 50]
      : [15, 30, 40, 75];

    const percent = rng.pick(percents);
    // Choose base price divisible by 100/gcd(percent, 100)
    const baseUnit = percent === 25 || percent === 75 ? 4 : (percent === 10 || percent === 30 ? 10 : (percent === 20 || percent === 40 ? 5 : 20));
    const baseFactor = rng.nextInt(3, 15);
    const originalPrice = baseUnit * baseFactor * 5;

    const discountAmount = Math.round((originalPrice * percent) / 100);
    const salePrice = originalPrice - discountAmount;

    const askSalePrice = rng.next() > 0.4;
    const expectedAnswer = askSalePrice ? salePrice : discountAmount;

    const prompt = askSalePrice
      ? `A digital lab balance normally costs $${originalPrice}. During an educational sale, it is discounted by ${percent}%. What is the sale price?`
      : `A field telescope is priced at $${originalPrice}. A ${percent}% educator discount is applied. How much money is saved by the discount?`;

    const hint = `First calculate ${percent}% of $${originalPrice} by converting ${percent}% to ${percent / 100} or using landmark fractions (${percent === 25 ? '1/4' : percent === 50 ? '1/2' : percent === 20 ? '1/5' : '10% multiples'}).`;

    const explanation = askSalePrice
      ? `Discount amount = ${percent}% of $${originalPrice} = $${discountAmount}. Sale price = $${originalPrice} − $${discountAmount} = $${salePrice}.`
      : `Discount amount = ${percent}% × $${originalPrice} = $${discountAmount}.`;

    const expectedStr = `$${expectedAnswer}`;

    const candidateSet = new Set<string>([expectedStr]);
    const distractors = [
      `$${askSalePrice ? discountAmount : salePrice}`,
      `$${expectedAnswer + 10}`,
      `$${Math.max(5, expectedAnswer - 10)}`,
      `$${Math.round(originalPrice - percent)}`, // Common mistake: subtracting percent directly
    ];

    for (const d of distractors) {
      if (candidateSet.size >= 4) break;
      if (!candidateSet.has(d)) {
        candidateSet.add(d);
      }
    }

    let offset = 5;
    while (candidateSet.size < 4) {
      const d = `$${expectedAnswer + offset}`;
      if (!candidateSet.has(d)) {
        candidateSet.add(d);
      }
      offset += 15;
    }

    const choices = rng.shuffle(Array.from(candidateSet));

    return {
      id: `q_pct_${rng.nextInt(100000, 999999)}`,
      skillId: percentDiscountsGenerator.skillId,
      strandId: percentDiscountsGenerator.strandId,
      difficulty,
      prompt,
      responseType: 'multiple_choice',
      choices,
      expectedAnswer: expectedStr,
      hint,
      explanation,
      generatorVersion: percentDiscountsGenerator.version,
    };
  },
};
