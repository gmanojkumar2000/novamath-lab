/**
 * NovaMath Lab — Complete 100 Badge Catalog
 * Matches assets/badges/manifest.json and docs/BADGES.md.
 */

import type { Badge, BadgeTier } from './types';
import badgeManifest from '../../assets/badges/manifest.json';

export const BADGE_UNLOCK_CONDITIONS: Record<string, string> = {
  // Starter Badges (25)
  E01: 'Answer the first question correctly.',
  E02: 'Complete the five-question launch check.',
  E03: 'Complete the first practice session.',
  E04: 'Accumulate 5 correct answers.',
  E05: 'Accumulate 10 correct answers.',
  E06: 'Use a hint and then answer that question correctly.',
  E07: 'Answer correctly immediately after an incorrect attempt in the same skill.',
  E08: 'Answer 2 questions correctly in a row.',
  E09: 'Answer 3 questions correctly in a row.',
  E10: 'Answer the first fractions-and-decimals question correctly.',
  E11: 'Answer the first ratios-and-percent question correctly.',
  E12: 'Answer the first integers question correctly.',
  E13: 'Answer the first expressions-and-equations question correctly.',
  E14: 'Answer the first geometry question correctly.',
  E15: 'Answer the first statistics-or-probability question correctly.',
  E16: 'Attempt at least one question in all 6 topic strands.',
  E17: 'Get 3 questions correct without using hints.',
  E18: 'Finish one session with at least 60% correct.',
  E19: 'Finish one session with at least 75% correct.',
  E20: 'Complete sessions on 2 distinct days.',
  E21: 'Complete the first stage of any science mission.',
  E22: 'Complete the first stage of Mars Rover Route.',
  E23: 'Open the progress view after completing a session.',
  E24: 'Correctly answer the first find-the-mistake or method-comparison question.',
  E25: 'Accumulate 25 correct answers.',

  // Intermediate Badges (50)
  M01: 'Accumulate 50 correct answers.',
  M02: 'Accumulate 100 correct answers.',
  M03: 'Accumulate 150 correct answers.',
  M04: 'Accumulate 250 correct answers.',
  M05: 'Accumulate 400 correct answers.',
  M06: 'Complete 5 practice sessions.',
  M07: 'Complete 10 practice sessions.',
  M08: 'Complete 20 practice sessions.',
  M09: 'Complete 30 practice sessions.',
  M10: 'Complete sessions on 5 distinct days.',
  M11: 'Complete sessions on 10 distinct days.',
  M12: 'Complete sessions in 4 distinct calendar weeks.',
  M13: 'Reach skill level 2 in fractions and decimals.',
  M14: 'Reach skill level 3 in fractions and decimals.',
  M15: 'Reach skill level 2 in ratios and percent.',
  M16: 'Reach skill level 3 in ratios and percent.',
  M17: 'Reach skill level 2 in integers.',
  M18: 'Reach skill level 3 in integers.',
  M19: 'Reach skill level 2 in expressions and equations.',
  M20: 'Reach skill level 3 in expressions and equations.',
  M21: 'Reach skill level 2 in geometry.',
  M22: 'Reach skill level 3 in geometry.',
  M23: 'Reach skill level 2 in statistics and probability.',
  M24: 'Reach skill level 3 in statistics and probability.',
  M25: 'Get 20 fraction-and-decimal questions correct.',
  M26: 'Get 20 ratios-and-percent questions correct.',
  M27: 'Get 20 integer questions correct.',
  M28: 'Get 20 expressions-and-equations questions correct.',
  M29: 'Get 20 geometry questions correct.',
  M30: 'Get 20 statistics-or-probability questions correct.',
  M31: 'Complete the first strong session.',
  M32: 'Complete 3 strong sessions.',
  M33: 'Complete 5 strong sessions.',
  M34: 'Complete the first perfect session.',
  M35: 'Get 10 consecutive questions correct without hints, across any number of sessions.',
  M36: 'Correctly solve 5 find-the-mistake questions.',
  M37: 'Correctly solve 5 method-comparison questions.',
  M38: 'Record 10 bounce-backs: a correct answer after a miss in the same skill.',
  M39: 'Correctly answer 15 spaced-review questions.',
  M40: 'Maintain at least 70% accuracy with at least 10 attempts in each of the 6 topic strands.',
  M41: 'Complete Mars Rover Route.',
  M42: 'Complete the optional fuel-comparison challenge in Mars Rover Route.',
  M43: 'Complete Ecosystem Rescue.',
  M44: 'Correctly distinguish observation from prediction in Ecosystem Rescue.',
  M45: 'Complete Orbit Lab.',
  M46: 'Complete the optional communication-window challenge in Orbit Lab.',
  M47: 'Complete any mission twice.',
  M48: 'Complete all 3 science missions.',
  M49: 'Correctly answer 25 mission questions across any missions.',
  M50: 'Submit correct calculated evidence in 3 final mission reports.',

  // Advanced Badges (25)
  H01: 'Accumulate 500 correct answers.',
  H02: 'Accumulate 750 correct answers.',
  H03: 'Accumulate 1,000 correct answers.',
  H04: 'Complete 50 practice sessions.',
  H05: 'Complete 75 practice sessions.',
  H06: 'Complete 100 practice sessions.',
  H07: 'Maintain at least 90% mastery after 40 attempts in fractions and decimals.',
  H08: 'Maintain at least 90% mastery after 40 attempts in ratios and percent.',
  H09: 'Maintain at least 90% mastery after 40 attempts in integers.',
  H10: 'Maintain at least 90% mastery after 40 attempts in expressions and equations.',
  H11: 'Maintain at least 90% mastery after 40 attempts in geometry.',
  H12: 'Maintain at least 90% mastery after 40 attempts in statistics and probability.',
  H13: 'Reach skill level 3 in all 6 topic strands.',
  H14: 'Maintain at least 80% mastery after 25 attempts in every topic strand.',
  H15: 'Maintain at least 90% mastery after 40 attempts in every topic strand.',
  H16: 'Complete 10 perfect sessions.',
  H17: 'Maintain at least 90% correct across the most recent 100 answered questions.',
  H18: 'Correctly solve 25 method-comparison questions.',
  H19: 'Correctly solve 25 find-the-mistake questions.',
  H20: 'Get 50 level-3 questions correct without hints.',
  H21: 'Complete Mars Rover Route with every scored answer correct and no hints.',
  H22: 'Complete Ecosystem Rescue with every scored answer correct and no hints.',
  H23: 'Complete Orbit Lab with every scored answer correct and no hints.',
  H24: 'Earn the flawless badge for all 3 science missions.',
  H25: 'Demonstrate at least 80% mastery in every seventh-grade bridge skill after at least 10 attempts per skill.',
};

export const ALL_BADGES: Badge[] = (badgeManifest as Array<{
  id: string;
  name: string;
  tier: string;
  asset: string;
  sourceSheet: string;
}>).map((item) => ({
  id: item.id,
  name: item.name,
  tier: item.tier as BadgeTier,
  unlockCondition: BADGE_UNLOCK_CONDITIONS[item.id] || 'Explore and master math concepts.',
  assetPath: item.asset,
  sourceSheet: item.sourceSheet,
}));

export const BADGE_BY_ID: Record<string, Badge> = Object.fromEntries(
  ALL_BADGES.map((b) => [b.id, b])
);
