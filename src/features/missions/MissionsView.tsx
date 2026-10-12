import React, { useState } from 'react';
import type { AppState } from '../../domain/types';
import { SCIENCE_MISSIONS, type MissionDefinition } from '../../domain/missions';
import './MissionsView.css';

interface MissionsViewProps {
  state: AppState;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ state }) => {
  const [selectedMission, setSelectedMission] = useState<MissionDefinition | null>(null);

  return (
    <div className="missions-view" id="tabpanel-missions" role="tabpanel" aria-labelledby="tab-missions">
      <div className="view-intro">
        <h2>Science & Engineering Missions</h2>
        <p>
          Apply mathematics to authentic scientific challenges: Mars rover navigation, ecological pond rebalancing, and satellite telemetry orbits.
        </p>
      </div>

      <div className="missions-grid">
        {SCIENCE_MISSIONS.map((mission) => {
          const progress = state.missions[mission.id];
          const isCompleted = progress?.status === 'completed';

          return (
            <article key={mission.id} className="mission-card" aria-labelledby={`mission-title-${mission.id}`}>
              <div className="mission-card-header">
                <span className="mission-icon" aria-hidden="true">{mission.icon}</span>
                <div className="mission-header-text">
                  <span className="mission-codename">{mission.codename}</span>
                  <h3 id={`mission-title-${mission.id}`}>{mission.title}</h3>
                </div>
                <span className={`mission-status-pill ${isCompleted ? 'status-completed' : 'status-ready'}`}>
                  {isCompleted ? 'Completed ★' : 'Stage 1 Available'}
                </span>
              </div>

              <div className="mission-theme-bar">
                <strong>Field:</strong> {mission.scienceTheme}
              </div>

              <p className="mission-narrative">{mission.narrative}</p>

              <div className="math-connections-section">
                <h4>Applied Math Topics:</h4>
                <ul className="math-topic-tags">
                  {mission.mathTopics.map((topic, i) => (
                    <li key={i} className="math-topic-tag">{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="stages-progress-bar" aria-label={`Mission stage ${progress?.currentStage || 1} of 3`}>
                {[1, 2, 3].map((stageNum) => (
                  <div
                    key={stageNum}
                    className={`stage-dot ${(progress?.currentStage || 1) >= stageNum ? 'stage-dot-active' : ''}`}
                    title={`Stage ${stageNum}`}
                  >
                    <span>{stageNum}</span>
                  </div>
                ))}
              </div>

              <div className="mission-card-footer">
                <button
                  className="btn-mission-explore"
                  onClick={() => setSelectedMission(mission)}
                  aria-label={`Inspect stages for ${mission.title}`}
                >
                  Inspect Mission Stages ➔
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mission Inspection Modal */}
      {selectedMission && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="mission-modal-title">
          <div className="modal-card modal-card-large">
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="mission-icon" aria-hidden="true">{selectedMission.icon}</span>
                <div>
                  <span className="mission-codename">{selectedMission.codename}</span>
                  <h3 id="mission-modal-title">{selectedMission.title}</h3>
                </div>
              </div>
              <button
                className="btn-close"
                onClick={() => setSelectedMission(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="mission-narrative">{selectedMission.narrative}</p>

              <h4 className="stages-heading">Three-Stage Mission Architecture:</h4>
              <div className="stages-list">
                {selectedMission.stages.map((stage) => (
                  <div key={stage.stageNumber} className="stage-detail-box">
                    <div className="stage-number-badge">Stage {stage.stageNumber}</div>
                    <div className="stage-detail-content">
                      <h5>{stage.title}</h5>
                      <p>{stage.summary}</p>
                      <div className="stage-skills">
                        <strong>Key Skills:</strong> {stage.keySkills.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="preview-lab-notice">
                <div className="notice-icon" aria-hidden="true">🛰️</div>
                <div>
                  <strong>Mission Simulation Pipeline (Milestone 3 Integration)</strong>
                  <p>
                    Interactive calculations, scientific maps, and reasoning justification prompts for this mission unlock in Milestone 3.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedMission(null)}>
                Close Mission Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
