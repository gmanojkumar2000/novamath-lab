import React from 'react';
import type { SessionSummary } from '../../engine/sessionManager';
import './SessionSummaryCard.css';

interface SessionSummaryCardProps {
  summary: SessionSummary;
  onFinish: () => void;
  onPracticeMore: () => void;
}

export const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  summary,
  onFinish,
  onPracticeMore,
}) => {
  const { session, accuracyPercent, growthHighlights, topicsPracticed } = summary;

  return (
    <article className="session-summary-card" aria-labelledby="summary-title">
      <div className="summary-header">
        <div className="summary-trophy" aria-hidden="true">🌟</div>
        <div>
          <span className="summary-pretitle">Practice Complete</span>
          <h2 id="summary-title" className="summary-title">
            {accuracyPercent >= 80 ? 'Outstanding Expedition!' : 'Great Focus & Persistence!'}
          </h2>
        </div>
      </div>

      <div className="summary-metrics-row">
        <div className="summary-metric-box">
          <span className="metric-big">{session.correctCount} / {session.questionsCount}</span>
          <span className="metric-sub">Correct Solutions</span>
        </div>
        <div className="summary-metric-box">
          <span className="metric-big">{accuracyPercent}%</span>
          <span className="metric-sub">Accuracy</span>
        </div>
        <div className="summary-metric-box">
          <span className="metric-big">{session.hintsUsedCount}</span>
          <span className="metric-sub">Hints Consulted</span>
        </div>
      </div>

      {growthHighlights.length > 0 && (
        <div className="highlights-box">
          <h3>Growth Highlights</h3>
          <ul>
            {growthHighlights.map((hl, i) => (
              <li key={i}>{hl}</li>
            ))}
          </ul>
        </div>
      )}

      {topicsPracticed.length > 0 && (
        <div className="practiced-topics-box">
          <h3>Topics Explored</h3>
          <div className="topic-tags-row">
            {topicsPracticed.map((topicId, i) => (
              <span key={i} className="practiced-tag">
                {topicId.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="summary-footer">
        <button type="button" className="btn-primary" onClick={onFinish}>
          Return to Daily Lab
        </button>
        <button type="button" className="btn-secondary" onClick={onPracticeMore}>
          Browse More Topics
        </button>
      </div>
    </article>
  );
};

