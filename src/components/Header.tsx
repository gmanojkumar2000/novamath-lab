import React from 'react';
import type { LearnerProfile } from '../domain/types';
import './Header.css';

interface HeaderProps {
  profile: LearnerProfile;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon" aria-hidden="true">✦</div>
        <div>
          <h1 className="brand-title">NovaMath Lab</h1>
          <p className="brand-tagline">Explore ideas. Solve boldly.</p>
        </div>
      </div>

      <div className="header-meta">
        <div className="offline-pill" title="Learner progress stays on this device">
          <span className="offline-dot" aria-hidden="true" />
          <span>Local-first</span>
        </div>
        <div className="learner-pill">
          <span className="learner-name">{profile.displayName}</span>
          <span className="session-target">{profile.preferredSessionMinutes}m daily target</span>
        </div>
      </div>
    </header>
  );
};
