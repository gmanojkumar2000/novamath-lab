import React from 'react';
import type { AppState, AppTab } from '../../domain/types';
import './HomeView.css';

interface HomeViewProps {
  state: AppState;
  onNavigate: (tab: AppTab) => void;
  onStartDiagnostic: () => void;
  onStartDailySession: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  state,
  onNavigate,
  onStartDiagnostic,
  onStartDailySession,
}) => {
  const completedSessions = state.sessions.length;
  const totalCorrect = Object.values(state.skills).reduce((acc, s) => acc + s.correctCount, 0);

  return (
    <div className="home-view" id="tabpanel-home" role="tabpanel" aria-labelledby="tab-home">
      {/* Diagnostic roadmap preview */}
      {!state.diagnosticCompleted && (
        <section className="diagnostic-banner" aria-labelledby="diagnostic-title">
          <div className="banner-badge">First-Time Setup</div>
          <div className="banner-content">
            <h2 id="diagnostic-title">Personalized Diagnostic Coming Soon</h2>
            <p>
              Milestone 2 will add a short placement check. Daily and topic practice are available now without it.
            </p>
          </div>
          <div className="banner-actions">
            <button className="btn-primary" onClick={onStartDiagnostic}>
              View Diagnostic Preview
            </button>
            <button className="btn-ghost" onClick={() => onNavigate('practice')}>
              Browse Strands Instead
            </button>
          </div>
        </section>
      )}

      {/* Hero: Daily Challenge */}
      <section className="daily-challenge-card" aria-labelledby="daily-title">
        <div className="card-header-badge">Daily Mission</div>
        <div className="daily-details">
          <h2 id="daily-title">Today's Reasoning Lab</h2>
          <p className="daily-subtitle">
            8–10 focused questions combining fractions, unit rates, and coordinates. Designed for deep thinking, not speed.
          </p>

          <div className="daily-stats-row">
            <div className="stat-pill">
              <span className="stat-label">Expected time:</span>
              <span className="stat-value">{state.profile.preferredSessionMinutes} minutes</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Format:</span>
              <span className="stat-value">Multiple-choice & numeric</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Hints:</span>
              <span className="stat-value">Available with no penalty</span>
            </div>
          </div>
        </div>

        <div className="daily-action-box">
          <button className="btn-accent" onClick={onStartDailySession}>
            Start Today's Session ➔
          </button>
          <span className="action-hint">Stored on this device • Saved automatically</span>
        </div>
      </section>

      {/* Grid: Exploration Cards */}
      <div className="home-grid">
        {/* Missions Spotlight */}
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">🚀</div>
          <h3>Applied Science Missions</h3>
          <p>
            Put mathematics to work in space exploration, ecology rebalancing, and satellite orbital mechanics.
          </p>
          <div className="feature-footer">
            <span className="badge-tag">3 Missions Available</span>
            <button className="link-button" onClick={() => onNavigate('missions')}>
              Open Missions ➔
            </button>
          </div>
        </div>

        {/* Badge Cabinet Spotlight */}
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">🏅</div>
          <h3>100 Collectible Badges</h3>
          <p>
            Celebrate curiosity, bounce-backs, and deep mastery. No points deducted for honest mistakes or missed days.
          </p>
          <div className="feature-footer">
            <span className="badge-tag">
              {Object.values(state.badges).filter((b) => b.unlocked).length} / 100 Earned
            </span>
            <button className="link-button" onClick={() => onNavigate('badges')}>
              View Cabinet ➔
            </button>
          </div>
        </div>

        {/* Growth & Effort */}
        <div className="feature-card">
          <div className="feature-icon" aria-hidden="true">🌱</div>
          <h3>Calm Mastery Progress</h3>
          <p>
            Track your working level across 6 mathematical strands and 7th-grade bridge concepts with zero pressure.
          </p>
          <div className="feature-footer">
            <span className="badge-tag">
              {completedSessions} sessions • {totalCorrect} solved
            </span>
            <button className="link-button" onClick={() => onNavigate('practice')}>
              Curriculum Map ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
