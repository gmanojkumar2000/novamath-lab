import { describe, it, expect } from 'vitest';
import { CURRICULUM_STRANDS, ALL_SKILLS } from '../src/domain/curriculum';

describe('Curriculum Model & Metadata', () => {
  it('contains all 8 curriculum strands (6 foundation + 1 stats/prob + 1 bridge)', () => {
    expect(CURRICULUM_STRANDS.length).toBe(8);
    const strandIds = CURRICULUM_STRANDS.map((s) => s.id);
    expect(strandIds).toContain('number_sense');
    expect(strandIds).toContain('fractions_decimals');
    expect(strandIds).toContain('ratios_rates');
    expect(strandIds).toContain('integers');
    expect(strandIds).toContain('expressions_equations');
    expect(strandIds).toContain('geometry');
    expect(strandIds).toContain('statistics');
    expect(strandIds).toContain('seventh_bridge');
  });

  it('guarantees unique strand IDs', () => {
    const ids = CURRICULUM_STRANDS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('guarantees unique skill IDs across the entire curriculum', () => {
    const skillIds = ALL_SKILLS.map((s) => s.id);
    const uniqueSkillIds = new Set(skillIds);
    expect(uniqueSkillIds.size).toBe(skillIds.length);
  });

  it('verifies that all prerequisites reference valid defined skill IDs', () => {
    const skillIdSet = new Set(ALL_SKILLS.map((s) => s.id));
    for (const skill of ALL_SKILLS) {
      for (const prereq of skill.prerequisites) {
        expect(
          skillIdSet.has(prereq),
          `Skill "${skill.id}" specifies unknown prerequisite "${prereq}"`
        ).toBe(true);
      }
    }
  });

  it('ensures every skill is assigned to grade 6 or 7', () => {
    for (const skill of ALL_SKILLS) {
      expect([6, 7]).toContain(skill.gradeLevel);
      expect(skill.name.trim().length).toBeGreaterThan(0);
      expect(skill.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('includes a dedicated probability skill for probability practice', () => {
    expect(ALL_SKILLS.map((skill) => skill.id)).toContain('probability_models');
  });
});
