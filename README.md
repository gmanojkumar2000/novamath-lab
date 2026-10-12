# NovaMath Lab

NovaMath Lab is an offline-first math and science practice app for an advanced sixth-grade learner. It combines adaptive practice with short science missions that apply mathematics to real situations.

The project is currently in the planning stage. See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the product scope, architecture, milestones, and acceptance criteria. The complete achievement system is defined in [docs/BADGES.md](docs/BADGES.md).

The first complete visual asset pack is available under [`assets/badges/`](assets/badges/README.md): four themed master sheets and 100 transparent, app-ready badge icons featuring dinosaurs, sports cars, science, construction bricks, and mathematics.

## Product principles

- Reward reasoning, curiosity, and persistence—not just speed.
- Strengthen sixth-grade foundations while introducing seventh-grade concepts gradually.
- Keep the learner experience calm, age-appropriate, and free of ads or accounts.
- Store learner data locally and give the parent clear control over it.
- Offer 100 collectible badges: 25 starter, 50 intermediate, and 25 advanced.

## Current status — Milestone 1 Practice Engine Complete

- [x] **Milestone 0 Foundation**:
  - React 18 + TypeScript + Vite project foundation
  - Calm, science-journal visual design system with design tokens (`src/styles/`)
  - Accessible shell and navigation across all 5 core views
  - Full curriculum model (8 strands, 18 skills with prerequisite graph)
  - Complete 100-badge catalog and visual cabinet display
  - Three science mission definitions and stage progression models
  - Versioned local persistence (v1) with corrupt-data recovery
  - Parent data controls (export, import, safe reset)
  - GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [x] **Milestone 1 Practice Engine**:
  - 10 deterministic question generators with seeded Mulberry32 PRNG and exact `Fraction` arithmetic
  - Invariant safety verified across 1,000 randomized iterations per generator (10,000 total assertions)
  - One-step hints that guide without revealing answers
  - Complete worked explanations shown after attempt
  - Flexible answer evaluation (text, numbers, currency `$`, units, and equivalent fractions)
  - Daily challenge (8–10 questions) and skill-specific topic practice sessions (5 questions)
  - Question card component (`QuestionCard.tsx`) with immediate feedback and step indicator
  - Session summary card (`SessionSummaryCard.tsx`) displaying accuracy, hints used, and growth highlights
  - Responsive layouts and touch-friendly controls verified for Chrome on Android-sized viewports
  - Automated test suite with 75 tests across 7 test suites

## Getting started

```bash
# Install the locked dependency versions
npm ci

# Run automated tests
npm test

# Run TypeScript type check
npm run typecheck

# Start the local development server
npm run dev

# Create production build
npm run build
```

