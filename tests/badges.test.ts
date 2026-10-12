import { describe, it, expect } from 'vitest';
import { ALL_BADGES, BADGE_BY_ID, BADGE_UNLOCK_CONDITIONS } from '../src/domain/badges';

describe('100 Badge Catalog & Integrity', () => {
  it('contains exactly 100 badges in the catalog', () => {
    expect(ALL_BADGES.length).toBe(100);
  });

  it('contains exactly 25 starter, 50 intermediate, and 25 advanced badges', () => {
    const starter = ALL_BADGES.filter((b) => b.tier === 'starter');
    const intermediate = ALL_BADGES.filter((b) => b.tier === 'intermediate');
    const advanced = ALL_BADGES.filter((b) => b.tier === 'advanced');

    expect(starter.length).toBe(25);
    expect(intermediate.length).toBe(50);
    expect(advanced.length).toBe(25);
  });

  it('guarantees unique badge IDs matching expected ranges (E01-E25, M01-M50, H01-H25)', () => {
    const ids = ALL_BADGES.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);

    // Starter E01-E25
    for (let i = 1; i <= 25; i++) {
      const id = `E${String(i).padStart(2, '0')}`;
      expect(BADGE_BY_ID[id], `Missing badge ${id}`).toBeDefined();
      expect(BADGE_BY_ID[id].tier).toBe('starter');
    }

    // Intermediate M01-M50
    for (let i = 1; i <= 50; i++) {
      const id = `M${String(i).padStart(2, '0')}`;
      expect(BADGE_BY_ID[id], `Missing badge ${id}`).toBeDefined();
      expect(BADGE_BY_ID[id].tier).toBe('intermediate');
    }

    // Advanced H01-H25
    for (let i = 1; i <= 25; i++) {
      const id = `H${String(i).padStart(2, '0')}`;
      expect(BADGE_BY_ID[id], `Missing badge ${id}`).toBeDefined();
      expect(BADGE_BY_ID[id].tier).toBe('advanced');
    }
  });

  it('ensures every badge has a defined unlock condition and asset path', () => {
    for (const badge of ALL_BADGES) {
      expect(badge.name.trim().length).toBeGreaterThan(0);
      expect(badge.unlockCondition.trim().length).toBeGreaterThan(0);
      expect(badge.assetPath).toMatch(/^assets\/badges\/icons\/[emh]\d{2}\.png$/);
      expect(BADGE_UNLOCK_CONDITIONS[badge.id]).toBeDefined();
    }
  });
});
