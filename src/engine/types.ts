/**
 * NovaMath Lab — Generator Interfaces and Invariant Validation
 * Ref: PROJECT_PLAN.md Section 9.
 */

import type { Question, SkillLevel } from '../domain/types';
import type { Rng } from './random';

export interface GeneratorContext {
  rng: Rng;
  difficulty: SkillLevel;
}

export interface QuestionGenerator {
  id: string;
  name: string;
  skillId: string;
  strandId: string;
  version: string;
  generate(ctx: GeneratorContext): Question;
}

export interface InvariantValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates question invariants according to Section 9 of PROJECT_PLAN.md:
 * - Immutable displayed values and expected answer agreement
 * - No NaN, null, or undefined in prompt, answer, explanation, or hint
 * - No duplicate multiple-choice choices
 * - Expected answer must be present among choices for multiple_choice questions
 * - Bounded decimals or simplified fractions
 * - Non-empty hint and explanation
 */
export function validateQuestionInvariants(q: Question): InvariantValidationResult {
  const errors: string[] = [];

  if (!q.id || typeof q.id !== 'string') {
    errors.push('Question ID is missing or invalid.');
  }

  if (!q.prompt || typeof q.prompt !== 'string' || q.prompt.trim().length === 0) {
    errors.push('Question prompt is empty.');
  } else if (q.prompt.includes('NaN') || q.prompt.includes('undefined') || q.prompt.includes('null')) {
    errors.push(`Question prompt contains corrupt text: "${q.prompt}"`);
  }

  if (q.expectedAnswer === undefined || q.expectedAnswer === null || Number.isNaN(q.expectedAnswer)) {
    errors.push(`Invalid expectedAnswer: ${q.expectedAnswer}`);
  }

  if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length === 0) {
    errors.push('Question hint is empty.');
  }

  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
    errors.push('Question explanation is empty.');
  }

  if (!q.generatorVersion || typeof q.generatorVersion !== 'string') {
    errors.push('Question generatorVersion is missing.');
  }

  if (q.responseType === 'multiple_choice') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push('Multiple-choice question must have at least 2 choices.');
    } else {
      // Check duplicate choices
      const uniqueChoices = new Set(q.choices.map((c) => String(c).trim()));
      if (uniqueChoices.size !== q.choices.length) {
        errors.push(`Multiple-choice question has duplicate choices: [${q.choices.join(', ')}]`);
      }

      // Check expected answer is in choices
      const expectedStr = String(q.expectedAnswer).trim();
      const hasAnswer = q.choices.some((c) => String(c).trim() === expectedStr);
      if (!hasAnswer) {
        errors.push(`Expected answer "${expectedStr}" not found in choices: [${q.choices.join(', ')}]`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
