import React, { useState } from 'react';
import type { AppState, SkillState } from '../../domain/types';
import { CURRICULUM_STRANDS, type SkillDefinition } from '../../domain/curriculum';
import './PracticeView.css';

interface PracticeViewProps {
  state: AppState;
  onUpdateSkillLevel?: (skillId: string, level: 1 | 2 | 3) => void;
  onStartTopicPractice?: (skillId: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  state,
  onStartTopicPractice,
}) => {
  const [selectedStrand, setSelectedStrand] = useState<string>('all');
  const [activePracticeSkill, setActivePracticeSkill] = useState<SkillDefinition | null>(null);

  const filteredStrands = selectedStrand === 'all'
    ? CURRICULUM_STRANDS
    : CURRICULUM_STRANDS.filter((s) => s.id === selectedStrand);

  const getSkillState = (id: string): SkillState => {
    return state.skills[id] || {
      skillId: id,
      level: 1,
      attempts: 0,
      correctCount: 0,
      currentStreak: 0,
      hintUsedCount: 0,
      lastPracticedAt: null,
      reviewDueDate: null,
    };
  };

  return (
    <div className="practice-view" id="tabpanel-practice" role="tabpanel" aria-labelledby="tab-practice">
      <div className="view-intro">
        <h2>Mathematical Strands & Skills</h2>
        <p>
          Master foundations in grade 6 and bridge to grade 7 concepts. Level advances after 3 consecutive correct solutions without hints.
        </p>

        {/* Filter Pills */}
        <div className="strand-filter-bar" role="toolbar" aria-label="Filter Strands">
          <button
            className={`filter-pill ${selectedStrand === 'all' ? 'filter-pill-active' : ''}`}
            onClick={() => setSelectedStrand('all')}
          >
            All Strands ({CURRICULUM_STRANDS.length})
          </button>
          {CURRICULUM_STRANDS.map((strand) => (
            <button
              key={strand.id}
              className={`filter-pill ${selectedStrand === strand.id ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedStrand(strand.id)}
            >
              <span aria-hidden="true">{strand.icon}</span> {strand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Strands List */}
      <div className="strands-container">
        {filteredStrands.map((strand) => (
          <section key={strand.id} className="strand-card" aria-labelledby={`strand-title-${strand.id}`}>
            <div className="strand-header">
              <div className="strand-title-group">
                <span className="strand-icon-large" aria-hidden="true">{strand.icon}</span>
                <div>
                  <h3 id={`strand-title-${strand.id}`}>{strand.name}</h3>
                  <p className="strand-desc">{strand.description}</p>
                </div>
              </div>
            </div>

            <div className="skills-grid">
              {strand.skills.map((skill) => {
                const skillState = getSkillState(skill.id);
                return (
                  <div key={skill.id} className="skill-card">
                    <div className="skill-top">
                      <span className="grade-badge">Grade {skill.gradeLevel}</span>
                      <span className={`level-pill level-${skillState.level}`}>
                        Level {skillState.level}
                      </span>
                    </div>

                    <h4 className="skill-name">{skill.name}</h4>
                    <p className="skill-summary">{skill.description}</p>

                    <div className="skill-meta-row">
                      <span className="metric-text">
                        {skillState.correctCount} / {skillState.attempts} correct
                      </span>
                      {skillState.currentStreak > 0 && (
                        <span className="streak-tag">Streak: {skillState.currentStreak}★</span>
                      )}
                    </div>

                    <div className="skill-actions">
                      <button
                        className="btn-practice-skill"
                        onClick={() => {
                          if (onStartTopicPractice) {
                            onStartTopicPractice(skill.id);
                          } else {
                            setActivePracticeSkill(skill);
                          }
                        }}
                        aria-label={`Start practice for ${skill.name}`}
                      >
                        Practice Skill ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Practice Details & Launch Modal */}
      {activePracticeSkill && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="grade-badge">Grade {activePracticeSkill.gradeLevel}</span>
                <h3 id="modal-title">{activePracticeSkill.name}</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setActivePracticeSkill(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-skill-desc">{activePracticeSkill.description}</p>

              <div className="preview-lab-notice">
                <div className="notice-icon" aria-hidden="true">💡</div>
                <div>
                  <strong>Focused Topic Practice</strong>
                  <p>
                    Interactive 5-question workout with generated values, single-step thinking hints, and step-by-step explanations.
                  </p>
                </div>
              </div>

              <div className="prereq-info">
                <strong>Prerequisites:</strong>{' '}
                {activePracticeSkill.prerequisites.length > 0
                  ? activePracticeSkill.prerequisites.join(', ')
                  : 'Foundational entry point (none required)'}
              </div>
            </div>

            <div className="modal-footer">
              {onStartTopicPractice && (
                <button
                  className="btn-accent"
                  onClick={() => {
                    const id = activePracticeSkill.id;
                    setActivePracticeSkill(null);
                    onStartTopicPractice(id);
                  }}
                >
                  Start 5-Question Workout ➔
                </button>
              )}
              <button className="btn-ghost" onClick={() => setActivePracticeSkill(null)}>
                Back to Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
