/**
 * NovaMath Lab — Practice Session Manager
 * Orchestrates session creation, question evaluation, and persistence updates.
 * Ref: PROJECT_PLAN.md Section 4 and Section 11 (Milestone 1).
 */

import type { AppState, Question, Session, QuestionResponse } from '../domain/types';
import { ALL_GENERATORS, GENERATOR_BY_SKILL } from './generators';
import { createRng } from './random';
import { Fraction } from './fraction';

export interface SessionSummary {
  session: Session;
  accuracyPercent: number;
  topicsPracticed: string[];
  growthHighlights: string[];
}

export function createDailySession(state: AppState, seed?: number): { session: Session; questions: Question[] } {
  const rng = createRng(seed);
  const questionCount = rng.pick([8, 9, 10]);

  // Pick diverse generators across strands
  const shuffledGens = rng.shuffle([...ALL_GENERATORS]);
  const chosenGens = shuffledGens.slice(0, Math.min(questionCount, shuffledGens.length));

  while (chosenGens.length < questionCount) {
    chosenGens.push(rng.pick(ALL_GENERATORS));
  }

  const questions: Question[] = [];
  for (let i = 0; i < chosenGens.length; i++) {
    const gen = chosenGens[i];
    const skillLevel = state.skills[gen.skillId]?.level || 1;
    questions.push(gen.generate({ rng, difficulty: skillLevel }));
  }

  const session: Session = {
    id: `sess_daily_${Date.now()}_${rng.nextInt(1000, 9999)}`,
    type: 'daily',
    completedAt: '',
    durationSeconds: 0,
    questionsCount: questions.length,
    correctCount: 0,
    hintsUsedCount: 0,
    responses: [],
  };

  return { session, questions };
}

export function createTopicSession(
  skillId: string,
  state: AppState,
  count: number = 5,
  seed?: number
): { session: Session; questions: Question[] } {
  const rng = createRng(seed);
  const mappedGenerator = GENERATOR_BY_SKILL[skillId];
  const generator = mappedGenerator || rng.pick(ALL_GENERATORS);
  const resolvedSkillId = mappedGenerator ? skillId : generator.skillId;
  const skillLevel = state.skills[resolvedSkillId]?.level || 1;

  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const generated = generator.generate({ rng, difficulty: skillLevel });
    questions.push({ ...generated, skillId: resolvedSkillId });
  }

  const session: Session = {
    id: `sess_topic_${resolvedSkillId}_${Date.now()}`,
    type: 'topic_practice',
    completedAt: '',
    durationSeconds: 0,
    questionsCount: questions.length,
    correctCount: 0,
    hintsUsedCount: 0,
    responses: [],
  };

  return { session, questions };
}

/**
 * Robust answer evaluation supporting text choices, integers, decimals, and equivalent fractions.
 */
export function evaluateAnswer(question: Question, learnerAnswer: string | number): boolean {
  if (learnerAnswer === undefined || learnerAnswer === null) return false;

  const rawExpected = String(question.expectedAnswer).trim();
  const rawLearner = String(learnerAnswer).trim();

  // 1. Direct text match
  if (rawExpected.toLowerCase() === rawLearner.toLowerCase()) {
    return true;
  }

  // 2. Fraction equivalence test (e.g. "3/6" vs "1/2", "1 1/2" vs "3/2")
  const fracExpected = Fraction.parse(rawExpected);
  const fracLearner = Fraction.parse(rawLearner);
  if (fracExpected && fracLearner && fracExpected.equals(fracLearner)) {
    return true;
  }

  // 3. Numeric tolerance match. A learner may omit the expected unit or
  // currency symbol, but a conflicting unit is not accepted.
  const expectedScalar = parseScalar(rawExpected);
  const learnerScalar = parseScalar(rawLearner);
  if (
    expectedScalar &&
    learnerScalar &&
    (learnerScalar.unit === '' || learnerScalar.unit === expectedScalar.unit)
  ) {
    return Math.abs(expectedScalar.value - learnerScalar.value) < 1e-4;
  }

  return false;
}

function parseScalar(value: string): { value: number; unit: string } | null {
  const match = value.match(/^([^0-9+\-.]*)([+-]?(?:\d+(?:\.\d+)?|\.\d+))([^0-9.]*)$/);
  if (!match) return null;

  const parsed = Number(match[2]);
  if (!Number.isFinite(parsed)) return null;

  return {
    value: parsed,
    unit: `${match[1]}${match[3]}`.replace(/\s+/g, '').toLowerCase(),
  };
}

/**
 * Appends a question response to the active session.
 */
export function recordQuestionResponse(
  session: Session,
  question: Question,
  learnerAnswer: string | number,
  hintUsed: boolean,
  timeSpentSeconds: number
): { updatedSession: Session; isCorrect: boolean } {
  const isCorrect = evaluateAnswer(question, learnerAnswer);

  const response: QuestionResponse = {
    questionId: question.id,
    skillId: question.skillId,
    learnerAnswer,
    isCorrect,
    hintUsed,
    timeSpentSeconds,
  };

  const updatedSession: Session = {
    ...session,
    correctCount: isCorrect ? session.correctCount + 1 : session.correctCount,
    hintsUsedCount: hintUsed ? session.hintsUsedCount + 1 : session.hintsUsedCount,
    durationSeconds: session.durationSeconds + timeSpentSeconds,
    responses: [...session.responses, response],
  };

  return { updatedSession, isCorrect };
}

/**
 * Finalizes the session, updates AppState, and returns summary metrics.
 */
export function completeSession(session: Session, state: AppState): { updatedState: AppState; summary: SessionSummary } {
  const now = new Date().toISOString();
  const finalizedSession: Session = {
    ...session,
    completedAt: now,
  };

  // Update skills in state
  const updatedSkills = { ...state.skills };
  const practicedSkillIds = new Set<string>();

  for (const resp of finalizedSession.responses) {
    practicedSkillIds.add(resp.skillId);
    const existing = updatedSkills[resp.skillId] || {
      skillId: resp.skillId,
      level: 1,
      attempts: 0,
      correctCount: 0,
      currentStreak: 0,
      hintUsedCount: 0,
      lastPracticedAt: null,
      reviewDueDate: null,
    };

    const newAttempts = existing.attempts + 1;
    const newCorrect = resp.isCorrect ? existing.correctCount + 1 : existing.correctCount;
    let newStreak = resp.isCorrect && !resp.hintUsed ? existing.currentStreak + 1 : 0;
    const newHints = resp.hintUsed ? existing.hintUsedCount + 1 : existing.hintUsedCount;

    // Milestone 1: Level progression rule: advance after 3 consecutive correct without hints
    let newLevel = existing.level;
    const startingLevel = state.skills[resp.skillId]?.level || 1;
    const maximumLevelThisSession = Math.min(3, startingLevel + 1);
    if (newStreak >= 3 && existing.level < maximumLevelThisSession) {
      newLevel = (existing.level + 1) as 1 | 2 | 3;
      newStreak = 0;
    }

    updatedSkills[resp.skillId] = {
      ...existing,
      level: newLevel,
      attempts: newAttempts,
      correctCount: newCorrect,
      currentStreak: newStreak,
      hintUsedCount: newHints,
      lastPracticedAt: now,
    };
  }

  const updatedState: AppState = {
    ...state,
    skills: updatedSkills,
    sessions: [finalizedSession, ...state.sessions],
    lastActiveDate: now.split('T')[0],
    updatedAt: now,
  };

  const total = finalizedSession.questionsCount || 1;
  const accuracyPercent = Math.round((finalizedSession.correctCount / total) * 100);

  const growthHighlights: string[] = [];
  if (accuracyPercent >= 80) {
    growthHighlights.push('Strong understanding demonstrated across varied concepts!');
  }
  if (finalizedSession.hintsUsedCount === 0) {
    growthHighlights.push('Worked through every challenge completely independently.');
  } else {
    growthHighlights.push(`Used hints as a smart thinking tool on ${finalizedSession.hintsUsedCount} question(s).`);
  }

  return {
    updatedState,
    summary: {
      session: finalizedSession,
      accuracyPercent,
      topicsPracticed: Array.from(practicedSkillIds),
      growthHighlights,
    },
  };
}
