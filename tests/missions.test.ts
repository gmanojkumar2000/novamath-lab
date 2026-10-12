import { describe, it, expect } from 'vitest';
import { SCIENCE_MISSIONS } from '../src/domain/missions';
import { ALL_SKILLS } from '../src/domain/curriculum';

describe('Science Missions Model & Integration', () => {
  it('defines the three core science missions from PROJECT_PLAN.md', () => {
    expect(SCIENCE_MISSIONS.length).toBe(3);
    const missionIds = SCIENCE_MISSIONS.map((m) => m.id);
    expect(missionIds).toContain('mars_rover');
    expect(missionIds).toContain('ecosystem_rescue');
    expect(missionIds).toContain('orbit_lab');
  });

  it('provides exactly three progressive stages per mission', () => {
    for (const mission of SCIENCE_MISSIONS) {
      expect(mission.stages.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        expect(mission.stages[i].stageNumber).toBe(i + 1);
        expect(mission.stages[i].title.length).toBeGreaterThan(0);
        expect(mission.stages[i].summary.length).toBeGreaterThan(0);
        expect(mission.stages[i].keySkills.length).toBeGreaterThan(0);
      }
    }
  });

  it('validates that mission skills map to existing curriculum skills', () => {
    const validSkillIds = new Set(ALL_SKILLS.map((s) => s.id));
    for (const mission of SCIENCE_MISSIONS) {
      for (const stage of mission.stages) {
        for (const skillId of stage.keySkills) {
          expect(
            validSkillIds.has(skillId),
            `Mission "${mission.id}" stage ${stage.stageNumber} references unknown skill "${skillId}"`
          ).toBe(true);
        }
      }
    }
  });
});
