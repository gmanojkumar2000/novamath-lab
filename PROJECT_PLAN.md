# NovaMath Lab — Project Plan

## 1. Product summary

NovaMath Lab is a small, standalone learning app for a mathematically advanced sixth-grade student who also enjoys science. It will provide focused daily practice, adapt to the learner's performance, and connect mathematics to science through short problem-solving missions.

The first release will be an installable, offline-first web app. It will run in a modern browser on a laptop or tablet, require no account, make no network requests during normal use, and keep progress on the device.

### Working tagline

**Explore ideas. Solve boldly.**

### Primary outcome

Help the learner master sixth-grade mathematics and become comfortable with selected seventh-grade topics without turning practice into repetitive worksheets.

## 2. Product principles

1. **Reasoning before speed:** Ask learners to compare methods, find mistakes, estimate, and explain—not merely calculate faster.
2. **Challenge without frustration:** Increase complexity after demonstrated success and provide a useful next-step hint after difficulty.
3. **Science as context:** Use space, engineering, ecology, weather, and data investigations to make mathematics meaningful.
4. **Calm motivation:** Prefer mastery maps, discoveries, and meaningful missions over noisy rewards or manipulative streaks.
5. **Private by default:** No advertising, analytics, child account, or cloud data is required for the MVP.
6. **Correctness is a feature:** Every generated problem must have a deterministic answer, tested constraints, and a clear explanation.

## 3. Target users

### Learner

- Sixth-grade student working at or slightly above grade level
- Enjoys math, science, puzzles, and discovering how things work
- Uses the app independently for approximately 15 minutes per session

### Parent

- Wants a simple view of effort, topic mastery, and areas needing attention
- Needs control over difficulty and locally stored data
- Does not need classroom-management or grading features

## 4. MVP scope

### Learner experience

- First-run introduction and five-question diagnostic
- Daily challenge containing 8–10 questions and taking about 12–15 minutes
- Topic-focused practice sessions
- Multiple-choice and numeric-answer questions
- One-step hints that do not reveal the answer
- Worked explanations after each attempt
- Session summary showing accuracy, topics practiced, and growth
- Mastery map for all supported topics
- A collection of 100 badges: 25 starter, 50 intermediate, and 25 advanced
- A badge cabinet showing earned badges, locked silhouettes, progress, and the next three reachable goals
- Three science missions, each combining multiple math skills
- Keyboard, touch, and mouse support
- Responsive tablet and desktop layouts

### Adaptive learning

- Maintain a level from 1–3 for each skill
- Advance after three consecutive correct answers without hints
- After two misses in the same skill within four attempts, show a worked example followed by an easier parallel problem
- Include one review question for a mastered skill approximately every 4–5 questions
- Record hint use separately from correctness
- Never reduce visible rewards or punish a learner for skipping an optional challenge

### Parent experience

- Overall accuracy, completed sessions, time practiced, and science missions completed
- Topic-by-topic mastery and current working level
- A plain-language strength to celebrate
- One suggested topic or real-world activity to try next
- Learner name and preferred session length
- Export, import, and reset local progress

## 5. Curriculum map

### Sixth-grade foundations

| Strand | Initial skills |
| --- | --- |
| Number sense | Factors, multiples, primes, GCF, LCM, order of operations |
| Fractions and decimals | All four operations, conversions, estimation, multi-step applications |
| Ratios and rates | Equivalent ratios, unit rate, percent, proportional tables |
| Integers | Number-line reasoning and operations with positive and negative numbers |
| Expressions and equations | Substitution, distributive property, equivalent expressions, one-step equations |
| Geometry | Area, surface area, volume, coordinates, composite shapes |
| Statistics | Mean, median, range, distributions, interpreting tables and plots |

### Seventh-grade bridge

- Rational-number operations
- Proportional relationships and graphs
- Percent increase and decrease
- Two-step equations and inequalities
- Scale drawings and scale factor
- Circumference and area of circles
- Random sampling and probability models
- Unit rates involving fractions

Advanced material will unlock only after prerequisite performance is strong. Difficulty should come from deeper reasoning and multiple steps, not only from larger numbers.

## 6. Science missions

### Mission 1: Mars Rover Route

Navigate a rover to a sample site using signed coordinates, scale, distance, and proportional fuel use. The final decision compares two routes and asks the learner to justify which is safer.

### Mission 2: Ecosystem Rescue

Use ratios, percentages, mean, median, and field observations to rebalance a simulated pond ecosystem. The learner distinguishes measured evidence from a prediction.

### Mission 3: Orbit Lab

Plan a satellite communication window using unit rates, angle reasoning, scale, and equations. The final mission report requires a calculated recommendation.

## 7. Key user stories

### Learner

- As a learner, I can start today's challenge with one action so that beginning never feels like work.
- As a learner, I receive a small hint about the next step when I am stuck.
- As a learner, I see why an answer works after I respond.
- As a learner, I can choose a topic or launch a science mission.
- As a learner, I can see which ideas I have mastered and what is coming next.

### Parent

- As a parent, I can see progress without reading every answer.
- As a parent, I can identify a skill worth discussing or practicing together.
- As a parent, I can reset, export, or restore progress without creating an account.

## 8. Technical approach

### Proposed stack

- **UI:** React with TypeScript and Vite
- **Styling:** Plain CSS with design tokens; no runtime styling dependency
- **State:** Small reducer-based application store
- **Persistence:** Versioned local storage for the MVP; IndexedDB only if content volume requires it
- **Offline support:** Web app manifest and service worker
- **Unit tests:** Vitest
- **End-to-end and accessibility checks:** Playwright with axe-core
- **Packaging:** Browser-installable PWA first; Tauri desktop packaging can be evaluated after the MVP

### Proposed structure

```text
novamath-lab/
├── public/                 # App icons and manifest assets
├── src/
│   ├── app/                # Navigation, state, and application shell
│   ├── components/         # Reusable UI components
│   ├── content/            # Missions and curriculum metadata
│   ├── engine/             # Question generation and adaptive rules
│   ├── features/           # Home, practice, progress, and parent views
│   ├── storage/            # Versioned local persistence
│   └── styles/             # Tokens and global styles
├── tests/                  # Unit and end-to-end tests
└── docs/                   # Content rules and future design notes
```

### Core data model

- `LearnerProfile`: display name, preferences, and created date
- `SkillState`: level, attempts, correct answers, current streak, hint use, and review date
- `Question`: prompt, response type, answer, explanation, hint, skill, difficulty, and generator version
- `Session`: type, questions, responses, score, duration, and completion date
- `MissionProgress`: mission identifier, stage, attempts, and completion status
- `BadgeProgress`: badge identifier, current value, target value, earned date, and optional evidence reference

All persisted data will include a schema version so future releases can migrate older progress safely.

## 9. Question-engine rules

- Generate the displayed values and expected answer from the same immutable parameters.
- Use integer or deliberately bounded decimal results unless a fraction answer is expected.
- Reduce fraction answers to simplest form.
- Reject duplicate multiple-choice options before showing a question.
- Avoid ambiguous wording, accidental negative dimensions, division by zero, and unintended rounding.
- Store generator versions with responses to make defects reproducible.
- For each generator, test fixed examples, edge cases, and at least 1,000 randomized outputs.

Initial generators will cover fraction operations, integer temperature changes, unit rates, proportions, percent discounts, expression evaluation, one- and two-step equations, rectangular area/volume, mean, and simple probability.

## 10. Design direction

- Warm, science-journal visual language: deep navy, soft cream, coral, teal, and gold
- Clear typography with strong number legibility
- Age-appropriate for a middle-school learner—not preschool-like
- Restrained motion with support for `prefers-reduced-motion`
- Progress described as exploration, mastery, and discovery rather than winning or losing
- No reward for raw answer speed in the MVP

## 11. Delivery milestones

### Milestone 0 — Foundation

- Initialize the application and quality tooling
- Add design tokens, shell, routing, and versioned storage
- Define curriculum metadata and question interfaces
- Set up automated unit, accessibility, and end-to-end test commands

**Exit:** The app launches offline with navigable placeholder views and passing checks.

### Milestone 1 — Practice engine

- Implement the first ten question generators
- Build question, hint, feedback, and summary components
- Implement topic practice and mixed daily sessions
- Add deterministic generator tests and malformed-output guards

**Exit:** A learner can finish a complete, correct practice session and reload without losing progress.

### Milestone 2 — Adaptation and diagnostic

- Add the five-question diagnostic
- Implement per-skill level changes and spaced review
- Add worked-example recovery after repeated misses
- Display learner mastery and next-topic recommendations
- Implement the first 25 starter badges and the badge cabinet

**Exit:** Simulated correct and incorrect streaks cause the documented difficulty changes within safe bounds.

### Milestone 3 — Science missions

- Build Mars Rover Route, Ecosystem Rescue, and Orbit Lab
- Add mission progress and final reasoning prompts
- Validate all mission calculations and explanations
- Add the 50 intermediate badges, including mission and cross-topic achievements

**Exit:** Each mission can be completed offline from start to finish and restored after reload.

### Milestone 4 — Parent view and polish

- Add the parent dashboard and settings
- Add export, import, and reset controls
- Complete responsive design and keyboard/screen-reader review
- Add app icons, manifest, service worker, and install guidance
- Add the 25 advanced badges and complete badge accessibility and reset testing

**Exit:** The full MVP meets the acceptance criteria below on laptop and tablet sizes.

## 12. MVP acceptance criteria

### Functional

- The first launch offers a diagnostic and permits skipping it.
- A daily session contains a balanced mix of current, stretch, and review questions.
- Correctness, hints, mastery, and completed missions persist after reload.
- Every answer provides a useful explanation.
- The app works with the network disconnected after initial installation.
- Corrupt or outdated local data recovers safely without crashing.

### Content correctness

- Every question generator passes fixed-answer and randomized invariant tests.
- Displayed prompts, accepted answers, hints, and explanations agree.
- Multiple-choice questions never contain missing or duplicate choices.
- Generated values remain within the intended grade and difficulty constraints.

### Accessibility and usability

- All core tasks are possible using only a keyboard.
- Focus is visible and moves predictably after answering or changing views.
- Questions and feedback have meaningful screen-reader announcements.
- Text and controls meet WCAG AA contrast targets.
- The layout works at 320 px width, at 200% browser zoom, and in tablet portrait and landscape.
- Motion is reduced when the operating system requests it.

### Privacy

- The app makes no analytics or advertising requests.
- Learner progress remains on-device unless the parent explicitly exports it.
- Reset requires confirmation and clears all locally stored learner data.

### Badges

- The catalog contains exactly 100 unique badge identifiers: 25 starter, 50 intermediate, and 25 advanced.
- Every badge has a deterministic, testable unlock condition documented in [docs/BADGES.md](docs/BADGES.md).
- Earning the same badge twice is impossible, including after a reload or import.
- Badge progress and earned dates survive reload, export, and import.
- Unlock announcements do not interrupt answering and are available to screen readers.
- Locked badge descriptions never hide information needed to understand how to earn them.
- No badge requires fast answers, spending money, sharing data, or maintaining an unbroken daily streak.

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Generated answers or explanations are wrong | Deterministic math engine, property tests, generator versions, and content review |
| Adaptation moves too quickly | Require evidence across multiple attempts and cap level changes to one step |
| The advanced learner becomes bored | Add reasoning prompts, multiple methods, science missions, and optional challenge items |
| The learner feels punished by mistakes | Use neutral feedback, immediate explanation, and easier parallel practice without point loss |
| Local data is lost | Provide explicit JSON export/import and document browser-storage limitations |
| Scope grows into a full curriculum platform | Keep accounts, classrooms, cloud sync, AI tutoring, and authoring tools outside the MVP |

## 14. Out of scope for the MVP

- Teacher or classroom management
- Social leaderboards or public profiles
- Cloud accounts and cross-device synchronization
- Advertising, subscriptions, or in-app purchases
- Open-ended generative-AI tutoring
- Full coverage of every state or national curriculum standard
- Native mobile-store releases

## 15. First implementation backlog

1. Scaffold React, TypeScript, Vite, Vitest, and Playwright.
2. Add linting, formatting, and CI-ready test commands.
3. Build the application shell and responsive navigation.
4. Define curriculum, question, response, and progress types.
5. Implement versioned local persistence with recovery tests.
6. Build fraction, integer, ratio, equation, geometry, and statistics generators.
7. Add generator invariant tests.
8. Build the practice flow with hints, feedback, and summaries.
9. Implement the adaptive skill-state reducer.
10. Add the diagnostic, dashboard, and first Mars Rover mission.
11. Implement the badge event evaluator and persisted badge progress.
12. Add the badge cabinet and the 25 starter badges before expanding to all 100.

## 16. Decisions needed after the prototype

- Whether the preferred device is primarily a Windows laptop, Chromebook, or tablet
- Whether session duration should be parent-configurable beyond 10, 15, and 20 minutes
- Whether typed answers should accept equivalent fractions and mixed-number forms in the first release
- Whether Tauri desktop packaging adds enough value beyond the installable PWA
- Which school curriculum or state standards, if any, should be mapped explicitly

## 17. Badge system

NovaMath Lab will ship with exactly 100 badges divided by effort and learning depth:

- **25 starter badges:** normally achievable during the first few sessions
- **50 intermediate badges:** require repeated practice, growing mastery, or mission progress
- **25 advanced badges:** represent substantial long-term mastery and broad engagement

Badges celebrate practice, recovery, reasoning, breadth, and applied science. They do not reward raw speed, punish missed days, or require a perfect daily streak. The authoritative badge names and unlock conditions are maintained in [docs/BADGES.md](docs/BADGES.md).

The badge engine will consume domain events such as `question_answered`, `hint_used`, `session_completed`, `skill_level_changed`, and `mission_completed`. Unlock evaluation must be deterministic, idempotent, and separate from visual presentation.

