import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDefaultState,
  loadState,
  saveState,
  sanitizeState,
  exportStateJson,
  importStateJson,
  resetStorage,
  STORAGE_KEY,
  BACKUP_PREFIX,
} from '../src/storage/persistence';

// In-memory mock storage implementing the Storage interface
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('Versioned Local Persistence', () => {
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  it('creates a valid default application state', () => {
    const state = createDefaultState();
    expect(state.schemaVersion).toBe(1);
    expect(state.profile.displayName).toBe('Explorer');
    expect(state.profile.preferredSessionMinutes).toBe(15);
    expect(Object.keys(state.skills).length).toBeGreaterThanOrEqual(15);
    expect(Object.keys(state.badges).length).toBe(100);
    expect(Object.keys(state.missions).length).toBe(3);
    expect(state.sessions).toEqual([]);
    expect(state.diagnosticCompleted).toBe(false);
  });

  it('saves and loads state cleanly via storage', () => {
    const initial = createDefaultState();
    initial.profile.displayName = 'Aria';
    initial.skills['fraction_operations'].attempts = 5;
    initial.skills['fraction_operations'].correctCount = 5;

    const saved = saveState(initial, storage);
    expect(saved).toBe(true);

    const { state: loaded, recoveredFromError } = loadState(storage);
    expect(recoveredFromError).toBe(false);
    expect(loaded.profile.displayName).toBe('Aria');
    expect(loaded.skills['fraction_operations'].correctCount).toBe(5);
  });

  it('returns default state without error when storage is empty', () => {
    const { state, recoveredFromError } = loadState(storage);
    expect(recoveredFromError).toBe(false);
    expect(state.profile.displayName).toBe('Explorer');
    expect(state.schemaVersion).toBe(1);
  });

  it('safely recovers from malformed JSON and retains backup', () => {
    storage.setItem(STORAGE_KEY, '{malformed json! not valid');

    const { state, recoveredFromError, warning } = loadState(storage);
    expect(recoveredFromError).toBe(true);
    expect(warning).toContain('Corrupt storage format recovered');
    expect(state.profile.displayName).toBe('Explorer');

    // Verify backup was stored
    const keys = Object.keys((storage as any).store);
    const backupKey = keys.find((k) => k.startsWith(BACKUP_PREFIX));
    expect(backupKey).toBeDefined();
    expect(storage.getItem(backupKey!)).toBe('{malformed json! not valid');
  });

  it('safely recovers from non-object JSON payloads', () => {
    storage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
    const arrayResult = loadState(storage);
    expect(arrayResult.recoveredFromError).toBe(true);

    storage.setItem(STORAGE_KEY, JSON.stringify('some plain string'));
    const stringResult = loadState(storage);
    expect(stringResult.recoveredFromError).toBe(true);

    storage.setItem(STORAGE_KEY, JSON.stringify(42));
    const numberResult = loadState(storage);
    expect(numberResult.recoveredFromError).toBe(true);
  });

  it('sanitizes and repairs incomplete or damaged objects', () => {
    const incomplete = {
      schemaVersion: 1,
      profile: { displayName: 'Toby' },
      // missing skills, badges, missions, sessions
    };

    const sanitized = sanitizeState(incomplete);
    expect(sanitized.profile.displayName).toBe('Toby');
    expect(sanitized.profile.preferredSessionMinutes).toBe(15);
    expect(Object.keys(sanitized.skills).length).toBeGreaterThan(0);
    expect(Object.keys(sanitized.badges).length).toBe(100);
    expect(sanitized.sessions).toEqual([]);
  });

  it('exports and imports valid state JSON round-trip', () => {
    const state = createDefaultState();
    state.profile.displayName = 'Cosmo';
    state.badges['E01'].unlocked = true;
    state.badges['E01'].earnedAt = new Date().toISOString();

    const json = exportStateJson(state);
    const importRes = importStateJson(json);

    expect(importRes.success).toBe(true);
    expect(importRes.state?.profile.displayName).toBe('Cosmo');
    expect(importRes.state?.badges['E01'].unlocked).toBe(true);
  });

  it('rejects invalid JSON string during import', () => {
    const importRes = importStateJson('not a json string');
    expect(importRes.success).toBe(false);
    expect(importRes.error).toBeDefined();
  });

  it('rejects unsupported import shapes and future schema versions', () => {
    expect(importStateJson('[]').success).toBe(false);
    expect(importStateJson('{}').success).toBe(false);
    expect(importStateJson(JSON.stringify({ schemaVersion: 999 })).success).toBe(false);
  });

  it('sanitizes imported session counters from valid response records', () => {
    const state = createDefaultState();
    state.sessions = [{
      id: 'session-1',
      type: 'daily',
      completedAt: new Date().toISOString(),
      durationSeconds: 999,
      questionsCount: 1,
      correctCount: 999,
      hintsUsedCount: 999,
      responses: [{
        questionId: 'question-1',
        skillId: 'fraction_operations',
        learnerAnswer: '1/2',
        isCorrect: true,
        hintUsed: false,
        timeSpentSeconds: 12,
      }],
    }];

    const result = importStateJson(exportStateJson(state));

    expect(result.success).toBe(true);
    expect(result.state?.sessions[0].durationSeconds).toBe(12);
    expect(result.state?.sessions[0].correctCount).toBe(1);
    expect(result.state?.sessions[0].hintsUsedCount).toBe(0);
  });

  it('clears storage and returns clean default state on reset', () => {
    const state = createDefaultState();
    state.profile.displayName = 'To Be Reset';
    saveState(state, storage);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();

    const resetState = resetStorage(storage);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(resetState.profile.displayName).toBe('Explorer');
  });
});
