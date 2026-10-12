/**
 * NovaMath Lab — Versioned Local Persistence
 * Implements safe, offline-first local storage with corrupt-data recovery and schema versioning.
 * Ref: PROJECT_PLAN.md Section 8 and Section 12.
 */

import type {
  AppState,
  SkillState,
  MissionProgress,
  BadgeProgress,
  MissionId,
  QuestionResponse,
  Session,
  SessionType,
} from '../domain/types';
import { ALL_SKILLS } from '../domain/curriculum';
import { ALL_BADGES } from '../domain/badges';
import { SCIENCE_MISSIONS } from '../domain/missions';

export const CURRENT_SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'novamath_lab_data_v1';
export const BACKUP_PREFIX = 'novamath_lab_backup_';

/**
 * Creates an empty, pristine default application state.
 */
export function createDefaultState(): AppState {
  const now = new Date().toISOString();

  const skills: Record<string, SkillState> = {};
  for (const skill of ALL_SKILLS) {
    skills[skill.id] = {
      skillId: skill.id,
      level: 1,
      attempts: 0,
      correctCount: 0,
      currentStreak: 0,
      hintUsedCount: 0,
      lastPracticedAt: null,
      reviewDueDate: null,
    };
  }

  const missions: Record<MissionId, MissionProgress> = {
    mars_rover: {
      missionId: 'mars_rover',
      title: 'Mars Rover Route',
      currentStage: 1,
      totalStages: 3,
      attempts: 0,
      status: 'available',
      completedAt: null,
    },
    ecosystem_rescue: {
      missionId: 'ecosystem_rescue',
      title: 'Ecosystem Rescue',
      currentStage: 1,
      totalStages: 3,
      attempts: 0,
      status: 'available',
      completedAt: null,
    },
    orbit_lab: {
      missionId: 'orbit_lab',
      title: 'Orbit Lab',
      currentStage: 1,
      totalStages: 3,
      attempts: 0,
      status: 'available',
      completedAt: null,
    },
  };

  const badges: Record<string, BadgeProgress> = {};
  for (const badge of ALL_BADGES) {
    badges[badge.id] = {
      badgeId: badge.id,
      currentValue: 0,
      targetValue: 1,
      unlocked: false,
      earnedAt: null,
    };
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: {
      displayName: 'Explorer',
      preferredSessionMinutes: 15,
      createdAt: now,
      soundEnabled: true,
      reducedMotion: false,
    },
    skills,
    sessions: [],
    missions,
    badges,
    diagnosticCompleted: false,
    lastActiveDate: now.split('T')[0],
    updatedAt: now,
  };
}

export interface LoadResult {
  state: AppState;
  recoveredFromError: boolean;
  warning?: string;
}

function nonNegativeInteger(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function sanitizeSessions(value: unknown): Session[] {
  if (!Array.isArray(value)) return [];

  const validTypes: SessionType[] = ['diagnostic', 'daily', 'topic_practice'];
  const sessions: Session[] = [];

  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object') continue;

    const item = candidate as Partial<Session>;
    if (
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      !item.type ||
      !validTypes.includes(item.type) ||
      typeof item.completedAt !== 'string'
    ) {
      continue;
    }

    const responses: QuestionResponse[] = Array.isArray(item.responses)
      ? item.responses.flatMap((response) => {
          if (!response || typeof response !== 'object') return [];
          const entry = response as Partial<QuestionResponse>;
          if (
            typeof entry.questionId !== 'string' ||
            !entry.questionId ||
            typeof entry.skillId !== 'string' ||
            !entry.skillId ||
            (typeof entry.learnerAnswer !== 'string' &&
              !(typeof entry.learnerAnswer === 'number' && Number.isFinite(entry.learnerAnswer))) ||
            typeof entry.isCorrect !== 'boolean' ||
            typeof entry.hintUsed !== 'boolean'
          ) {
            return [];
          }

          return [{
            questionId: entry.questionId,
            skillId: entry.skillId,
            learnerAnswer: entry.learnerAnswer,
            isCorrect: entry.isCorrect,
            hintUsed: entry.hintUsed,
            timeSpentSeconds: nonNegativeInteger(entry.timeSpentSeconds),
          }];
        })
      : [];

    sessions.push({
      id: item.id,
      type: item.type,
      completedAt: item.completedAt,
      durationSeconds: responses.reduce((total, response) => total + response.timeSpentSeconds, 0),
      questionsCount: Math.max(nonNegativeInteger(item.questionsCount), responses.length),
      correctCount: responses.filter((response) => response.isCorrect).length,
      hintsUsedCount: responses.filter((response) => response.hintUsed).length,
      responses,
    });
  }

  return sessions;
}

/**
 * Safely loads state from localStorage, gracefully recovering from missing,
 * malformed, or out-of-schema data.
 */
export function loadState(storage: Storage = window.localStorage): LoadResult {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch (err) {
    return {
      state: createDefaultState(),
      recoveredFromError: true,
      warning: 'Storage access denied or unavailable. Running in-memory.',
    };
  }

  if (!raw) {
    return {
      state: createDefaultState(),
      recoveredFromError: false,
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (syntaxError) {
    // Malformed JSON: back up the corrupt string and reset safely
    try {
      storage.setItem(`${BACKUP_PREFIX}corrupt_${Date.now()}`, raw);
    } catch {
      // Ignore backup storage errors
    }
    return {
      state: createDefaultState(),
      recoveredFromError: true,
      warning: 'Corrupt storage format recovered. Default state restored with backup retained.',
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      state: createDefaultState(),
      recoveredFromError: true,
      warning: 'Invalid root state object. Default state restored.',
    };
  }

  // Schema validation & migration
  const sanitized = sanitizeState(parsed);
  return {
    state: sanitized,
    recoveredFromError: sanitized.schemaVersion !== parsed.schemaVersion || !parsed.profile,
  };
}

/**
 * Saves state to localStorage.
 */
export function saveState(state: AppState, storage: Storage = window.localStorage): boolean {
  try {
    const toSave: AppState = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (err) {
    console.error('Failed to save NovaMath Lab state:', err);
    return false;
  }
}

/**
 * Sanitizes and repairs a partial or migrated state object to match AppState.
 */
export function sanitizeState(candidate: any): AppState {
  const defaults = createDefaultState();

  const profile = candidate.profile && typeof candidate.profile === 'object'
    ? {
        displayName: typeof candidate.profile.displayName === 'string' && candidate.profile.displayName.trim()
          ? candidate.profile.displayName.trim().slice(0, 30)
          : defaults.profile.displayName,
        preferredSessionMinutes: [10, 15, 20].includes(candidate.profile.preferredSessionMinutes)
          ? candidate.profile.preferredSessionMinutes
          : 15,
        createdAt: typeof candidate.profile.createdAt === 'string'
          ? candidate.profile.createdAt
          : defaults.profile.createdAt,
        soundEnabled: typeof candidate.profile.soundEnabled === 'boolean'
          ? candidate.profile.soundEnabled
          : defaults.profile.soundEnabled,
        reducedMotion: typeof candidate.profile.reducedMotion === 'boolean'
          ? candidate.profile.reducedMotion
          : defaults.profile.reducedMotion,
      }
    : defaults.profile;

  const skills: Record<string, SkillState> = { ...defaults.skills };
  if (candidate.skills && typeof candidate.skills === 'object') {
    for (const [key, value] of Object.entries(candidate.skills)) {
      if (skills[key] && typeof value === 'object' && value !== null) {
        const v = value as Partial<SkillState>;
        skills[key] = {
          ...skills[key],
          level: (v.level === 1 || v.level === 2 || v.level === 3 ? v.level : 1),
          attempts: nonNegativeInteger(v.attempts),
          correctCount: Math.min(nonNegativeInteger(v.correctCount), nonNegativeInteger(v.attempts)),
          currentStreak: nonNegativeInteger(v.currentStreak),
          hintUsedCount: nonNegativeInteger(v.hintUsedCount),
          lastPracticedAt: typeof v.lastPracticedAt === 'string' ? v.lastPracticedAt : null,
          reviewDueDate: typeof v.reviewDueDate === 'string' ? v.reviewDueDate : null,
        };
      }
    }
  }

  const missions: Record<MissionId, MissionProgress> = { ...defaults.missions };
  if (candidate.missions && typeof candidate.missions === 'object') {
    for (const missionDef of SCIENCE_MISSIONS) {
      const existing = candidate.missions[missionDef.id];
      if (existing && typeof existing === 'object') {
        missions[missionDef.id] = {
          ...missions[missionDef.id],
          currentStage: Math.min(
            missions[missionDef.id].totalStages,
            Math.max(1, nonNegativeInteger(existing.currentStage, 1))
          ),
          attempts: nonNegativeInteger(existing.attempts),
          status: ['locked', 'available', 'in_progress', 'completed'].includes(existing.status)
            ? existing.status
            : 'available',
          completedAt: typeof existing.completedAt === 'string' ? existing.completedAt : null,
        };
      }
    }
  }

  const badges: Record<string, BadgeProgress> = { ...defaults.badges };
  if (candidate.badges && typeof candidate.badges === 'object') {
    for (const [key, val] of Object.entries(candidate.badges)) {
      if (badges[key] && typeof val === 'object' && val !== null) {
        const b = val as Partial<BadgeProgress>;
        badges[key] = {
          ...badges[key],
          currentValue: nonNegativeInteger(b.currentValue),
          targetValue: Math.max(1, nonNegativeInteger(b.targetValue, 1)),
          unlocked: Boolean(b.unlocked),
          earnedAt: typeof b.earnedAt === 'string' ? b.earnedAt : null,
        };
      }
    }
  }

  const sessions = sanitizeSessions(candidate.sessions);

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile,
    skills,
    sessions,
    missions,
    badges,
    diagnosticCompleted: Boolean(candidate.diagnosticCompleted),
    lastActiveDate: candidate.lastActiveDate || defaults.lastActiveDate,
    updatedAt: candidate.updatedAt || new Date().toISOString(),
  };
}

/**
 * Serializes state to an exported JSON string.
 */
export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Validates and imports a JSON string into AppState.
 */
export function importStateJson(jsonString: string): { success: boolean; state?: AppState; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'Import data must be a valid JSON object.' };
    }
    if (!Number.isInteger(parsed.schemaVersion) || parsed.schemaVersion < 1) {
      return { success: false, error: 'Import data is missing a supported schema version.' };
    }
    if (parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
      return {
        success: false,
        error: `This backup uses newer schema version ${parsed.schemaVersion}. Update NovaMath Lab before importing it.`,
      };
    }
    const sanitized = sanitizeState(parsed);
    return { success: true, state: sanitized };
  } catch (err: any) {
    return { success: false, error: `Invalid JSON format: ${err?.message || 'Parse error'}` };
  }
}

/**
 * Resets local storage and returns clean default state.
 */
export function resetStorage(storage: Storage = window.localStorage): AppState {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return createDefaultState();
}
