/**
 * NovaMath Lab — Core Domain Types
 * Based on specifications in PROJECT_PLAN.md and docs/BADGES.md.
 */

export type AppTab = 'home' | 'practice' | 'missions' | 'badges' | 'parent';

export interface LearnerProfile {
  displayName: string;
  preferredSessionMinutes: 10 | 15 | 20;
  createdAt: string;
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export type SkillLevel = 1 | 2 | 3;

export interface SkillState {
  skillId: string;
  level: SkillLevel;
  attempts: number;
  correctCount: number;
  currentStreak: number;
  hintUsedCount: number;
  lastPracticedAt: string | null;
  reviewDueDate: string | null;
}

export type QuestionType = 'multiple_choice' | 'numeric' | 'expression' | 'comparison';

export interface Question {
  id: string;
  skillId: string;
  strandId: string;
  difficulty: SkillLevel;
  prompt: string;
  responseType: QuestionType;
  choices?: string[];
  expectedAnswer: string | number;
  hint: string;
  explanation: string;
  generatorVersion: string;
}

export type SessionType = 'diagnostic' | 'daily' | 'topic_practice';

export interface QuestionResponse {
  questionId: string;
  skillId: string;
  learnerAnswer: string | number;
  isCorrect: boolean;
  hintUsed: boolean;
  timeSpentSeconds: number;
}

export interface Session {
  id: string;
  type: SessionType;
  completedAt: string;
  durationSeconds: number;
  questionsCount: number;
  correctCount: number;
  hintsUsedCount: number;
  responses: QuestionResponse[];
}

export type MissionId = 'mars_rover' | 'ecosystem_rescue' | 'orbit_lab';
export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface MissionProgress {
  missionId: MissionId;
  title: string;
  currentStage: number;
  totalStages: number;
  attempts: number;
  status: MissionStatus;
  completedAt: string | null;
}

export type BadgeTier = 'starter' | 'intermediate' | 'advanced';

export interface BadgeProgress {
  badgeId: string;
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
  earnedAt: string | null;
}

export interface Badge {
  id: string;
  name: string;
  tier: BadgeTier;
  unlockCondition: string;
  assetPath: string;
  sourceSheet: string;
}

export interface AppState {
  schemaVersion: number;
  profile: LearnerProfile;
  skills: Record<string, SkillState>;
  sessions: Session[];
  missions: Record<MissionId, MissionProgress>;
  badges: Record<string, BadgeProgress>;
  diagnosticCompleted: boolean;
  lastActiveDate: string;
  updatedAt: string;
}
