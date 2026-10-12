import { describe, it, expect } from 'vitest';
import {
  createDailySession,
  createTopicSession,
  evaluateAnswer,
  recordQuestionResponse,
  completeSession,
} from '../src/engine/sessionManager';
import { createDefaultState } from '../src/storage/persistence';
import type { Question } from '../src/domain/types';

describe('Session Manager — Practice Workflows', () => {
  it('creates a daily session with 8 to 10 balanced questions', () => {
    const state = createDefaultState();
    const { session, questions } = createDailySession(state, 12345);

    expect(questions.length).toBeGreaterThanOrEqual(8);
    expect(questions.length).toBeLessThanOrEqual(10);
    expect(session.questionsCount).toBe(questions.length);
    expect(session.type).toBe('daily');
    expect(session.correctCount).toBe(0);
    expect(session.hintsUsedCount).toBe(0);
  });

  it('creates a topic practice session with exactly 5 questions targeted to that skill', () => {
    const state = createDefaultState();
    const { session, questions } = createTopicSession('fraction_operations', state, 5, 54321);

    expect(questions.length).toBe(5);
    expect(session.questionsCount).toBe(5);
    expect(session.type).toBe('topic_practice');
    for (const q of questions) {
      expect(q.skillId).toBe('fraction_operations');
    }
  });

  describe('evaluateAnswer', () => {
    const mockQuestion: Question = {
      id: 'q_test_1',
      skillId: 'fraction_operations',
      strandId: 'fractions_decimals',
      difficulty: 1,
      prompt: 'What is 1/4 + 1/4?',
      responseType: 'multiple_choice',
      choices: ['1/2', '1/4', '3/4', '2/2'],
      expectedAnswer: '1/2',
      hint: 'Add numerators',
      explanation: '1/4 + 1/4 = 2/4 = 1/2',
      generatorVersion: '1.0.0',
    };

    it('accepts exact string match', () => {
      expect(evaluateAnswer(mockQuestion, '1/2')).toBe(true);
    });

    it('accepts equivalent fraction forms like 2/4 or 4/8', () => {
      expect(evaluateAnswer(mockQuestion, '2/4')).toBe(true);
      expect(evaluateAnswer(mockQuestion, '4/8')).toBe(true);
    });

    it('rejects incorrect answers', () => {
      expect(evaluateAnswer(mockQuestion, '3/4')).toBe(false);
      expect(evaluateAnswer(mockQuestion, '1/4')).toBe(false);
      expect(evaluateAnswer(mockQuestion, '12')).toBe(false);
    });

    it('accepts stripped currency and unit representations', () => {
      const priceQuestion: Question = {
        ...mockQuestion,
        expectedAnswer: '$45',
      };
      expect(evaluateAnswer(priceQuestion, '$45')).toBe(true);
      expect(evaluateAnswer(priceQuestion, '45')).toBe(true);

      const speedQuestion: Question = {
        ...mockQuestion,
        expectedAnswer: '60 km/h',
      };
      expect(evaluateAnswer(speedQuestion, '60 km/h')).toBe(true);
      expect(evaluateAnswer(speedQuestion, '60')).toBe(true);
      expect(evaluateAnswer(speedQuestion, '60 mph')).toBe(false);
    });
  });

  describe('recordQuestionResponse & completeSession', () => {
    it('records responses and tracks correct count and hints accurately', () => {
      const state = createDefaultState();
      const { session, questions } = createTopicSession('fraction_operations', state, 3, 111);

      // Question 1: correct, no hint
      const res1 = recordQuestionResponse(session, questions[0], questions[0].expectedAnswer, false, 10);
      expect(res1.isCorrect).toBe(true);
      expect(res1.updatedSession.correctCount).toBe(1);
      expect(res1.updatedSession.hintsUsedCount).toBe(0);

      // Question 2: incorrect, used hint
      const res2 = recordQuestionResponse(res1.updatedSession, questions[1], 'wrong_answer', true, 15);
      expect(res2.isCorrect).toBe(false);
      expect(res2.updatedSession.correctCount).toBe(1);
      expect(res2.updatedSession.hintsUsedCount).toBe(1);

      // Question 3: correct, no hint
      const res3 = recordQuestionResponse(res2.updatedSession, questions[2], questions[2].expectedAnswer, false, 8);
      expect(res3.isCorrect).toBe(true);
      expect(res3.updatedSession.correctCount).toBe(2);

      // Complete session
      const { updatedState, summary } = completeSession(res3.updatedSession, state);
      expect(updatedState.sessions.length).toBe(1);
      expect(summary.accuracyPercent).toBe(67);
      expect(summary.session.durationSeconds).toBe(33);
      expect(updatedState.skills['fraction_operations'].attempts).toBe(3);
      expect(updatedState.skills['fraction_operations'].correctCount).toBe(2);
    });

    it('advances skill level after 3 consecutive correct answers without hints', () => {
      const state = createDefaultState();
      expect(state.skills['fraction_operations'].level).toBe(1);

      const { session, questions } = createTopicSession('fraction_operations', state, 3, 222);

      let currentSession = session;
      for (const q of questions) {
        const { updatedSession } = recordQuestionResponse(currentSession, q, q.expectedAnswer, false, 5);
        currentSession = updatedSession;
      }

      const { updatedState } = completeSession(currentSession, state);
      // Streak reached 3 without hints -> level advances from 1 to 2
      expect(updatedState.skills['fraction_operations'].level).toBe(2);
      expect(updatedState.skills['fraction_operations'].currentStreak).toBe(0);
    });

    it('does not count hinted answers toward the no-hint mastery streak', () => {
      const state = createDefaultState();
      const { session, questions } = createTopicSession('fraction_operations', state, 3, 333);

      let currentSession = session;
      questions.forEach((question, index) => {
        const result = recordQuestionResponse(
          currentSession,
          question,
          question.expectedAnswer,
          index === 1,
          5
        );
        currentSession = result.updatedSession;
      });

      const { updatedState } = completeSession(currentSession, state);
      expect(updatedState.skills['fraction_operations'].level).toBe(1);
      expect(updatedState.skills['fraction_operations'].currentStreak).toBe(1);
    });

    it('credits shared generators to the topic skill that was requested', () => {
      const state = createDefaultState();
      const { questions } = createTopicSession('two_step_equations', state, 3, 444);

      expect(questions).toHaveLength(3);
      expect(questions.every((question) => question.skillId === 'two_step_equations')).toBe(true);
    });
  });
});
