/**
 * NovaMath Lab — Science Missions Definition
 * Detailed in Section 6 of PROJECT_PLAN.md.
 */

import type { MissionId } from './types';

export interface MissionStageInfo {
  stageNumber: number;
  title: string;
  summary: string;
  keySkills: string[];
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  codename: string;
  icon: string;
  scienceTheme: string;
  narrative: string;
  mathTopics: string[];
  stages: MissionStageInfo[];
}

export const SCIENCE_MISSIONS: MissionDefinition[] = [
  {
    id: 'mars_rover',
    title: 'Mars Rover Route',
    codename: 'Mission 1: Jezero Traverse',
    icon: '🚀',
    scienceTheme: 'Planetary Exploration & Robotics',
    narrative:
      'Navigate an autonomous rover across rugged Martian terrain to reach a scientific sample site. Calculate signed coordinates, map scale, distance, and proportional battery/fuel consumption. Conclude by comparing two candidate routes to justify the safer path.',
    mathTopics: [
      'Signed coordinates & integers',
      'Scale drawings & unit rates',
      'Proportional reasoning',
      'Distance comparison',
    ],
    stages: [
      {
        stageNumber: 1,
        title: 'Lander Coordinates & Grid Calibration',
        summary: 'Establish origin coordinates and navigate using four-quadrant coordinate planes.',
        keySkills: ['coordinate_plane', 'integer_concepts'],
      },
      {
        stageNumber: 2,
        title: 'Traverse Distance & Scale Factor',
        summary: 'Convert map grid units to meters and calculate travel distance along waypoints.',
        keySkills: ['scale_drawings', 'unit_rates'],
      },
      {
        stageNumber: 3,
        title: 'Power & Slope Trade-off Analysis',
        summary: 'Calculate proportional power draw for steep terrain and submit the final route justification.',
        keySkills: ['ratio_reasoning', 'decimal_operations'],
      },
    ],
  },
  {
    id: 'ecosystem_rescue',
    title: 'Ecosystem Rescue',
    codename: 'Mission 2: Watershed Balance',
    icon: '🌿',
    scienceTheme: 'Ecology & Environmental Biology',
    narrative:
      'Rebalance a simulated freshwater pond ecosystem experiencing an algae surge. Analyze dissolved oxygen data, organism ratios, mean/median sample counts, and percentages. Distinguish empirical observations from mathematical predictions to guide restorative action.',
    mathTopics: [
      'Ratios & proportions',
      'Percentages',
      'Mean & median statistics',
      'Data interpretation',
    ],
    stages: [
      {
        stageNumber: 1,
        title: 'Species Census & Ratio Audit',
        summary: 'Analyze predator-prey and producer-consumer population ratios in the pond sample.',
        keySkills: ['ratio_reasoning', 'measures_of_center'],
      },
      {
        stageNumber: 2,
        title: 'Dissolved Oxygen & Percent Balance',
        summary: 'Compute percentage shifts in water quality metrics following nutrient runoff.',
        keySkills: ['percent_applications', 'data_displays'],
      },
      {
        stageNumber: 3,
        title: 'Ecological Restoration Decision',
        summary: 'Distinguish measured evidence from theoretical models to deploy the biological intervention.',
        keySkills: ['measures_of_center', 'decimal_operations'],
      },
    ],
  },
  {
    id: 'orbit_lab',
    title: 'Orbit Lab',
    codename: 'Mission 3: Telemetry Window',
    icon: '🛰️',
    scienceTheme: 'Astrophysics & Orbital Mechanics',
    narrative:
      'Plan a satellite communication window for an Earth-observing satellite pass over a remote research station. Calculate angular velocity, line-of-sight window durations, and solve linear equations to optimize scientific data transmission.',
    mathTopics: [
      'Unit rates & speed',
      'Angle & geometric reasoning',
      'One-step & two-step equations',
      'Proportional rates',
    ],
    stages: [
      {
        stageNumber: 1,
        title: 'Orbital Period & Ground Track Velocity',
        summary: 'Calculate ground speed and angular traversal rate around Earth.',
        keySkills: ['unit_rates', 'one_step_equations'],
      },
      {
        stageNumber: 2,
        title: 'Elevation Angle & Line-of-Sight Window',
        summary: 'Determine duration of clear ground-station contact angles using linear models.',
        keySkills: ['algebraic_expressions', 'two_step_equations'],
      },
      {
        stageNumber: 3,
        title: 'Telemetry Downlink Recommendation',
        summary: 'Optimize transmission bandwidth rate and compile the final mission recommendation.',
        keySkills: ['unit_rates', 'fraction_operations'],
      },
    ],
  },
];
