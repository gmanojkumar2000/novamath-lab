import React, { useState } from 'react';
import type { AppState, Badge } from '../../domain/types';
import { ALL_BADGES } from '../../domain/badges';
import './BadgesView.css';

interface BadgesViewProps {
  state: AppState;
}

type FilterOption = 'all' | 'starter' | 'intermediate' | 'advanced' | 'earned' | 'locked';

export const BadgesView: React.FC<BadgesViewProps> = ({ state }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedMap = state.badges;
  const earnedCount = Object.values(earnedMap).filter((b) => b.unlocked).length;

  const filteredBadges = ALL_BADGES.filter((badge) => {
    const isUnlocked = Boolean(earnedMap[badge.id]?.unlocked);
    if (activeFilter === 'all') return true;
    if (activeFilter === 'earned') return isUnlocked;
    if (activeFilter === 'locked') return !isUnlocked;
    return badge.tier === activeFilter;
  });

  return (
    <div className="badges-view" id="tabpanel-badges" role="tabpanel" aria-labelledby="tab-badges">
      <div className="view-intro">
        <div className="intro-header-row">
          <div>
            <h2>100 Badge Cabinet</h2>
            <p>
              Collectible enamel pins celebrating mathematical curiosity, persistence, and applied science missions.
            </p>
          </div>
          <div className="cabinet-summary-pill">
            <span className="summary-number">{earnedCount}</span>
            <span className="summary-total">/ 100 Earned</span>
          </div>
        </div>

        {/* Tier Distribution Indicators */}
        <div className="tier-breakdown-bar">
          <div className="tier-info-chip starter-chip">
            <span className="chip-dot starter-dot" aria-hidden="true" />
            <span>25 Starter (Copper-Orange)</span>
          </div>
          <div className="tier-info-chip intermediate-chip">
            <span className="chip-dot intermediate-dot" aria-hidden="true" />
            <span>50 Intermediate (Silver-Cobalt)</span>
          </div>
          <div className="tier-info-chip advanced-chip">
            <span className="chip-dot advanced-dot" aria-hidden="true" />
            <span>25 Advanced (Platinum-Gold)</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="badge-filter-bar" role="toolbar" aria-label="Filter badges">
          <button
            className={`filter-pill ${activeFilter === 'all' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All (100)
          </button>
          <button
            className={`filter-pill ${activeFilter === 'starter' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('starter')}
          >
            Starter (25)
          </button>
          <button
            className={`filter-pill ${activeFilter === 'intermediate' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('intermediate')}
          >
            Intermediate (50)
          </button>
          <button
            className={`filter-pill ${activeFilter === 'advanced' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('advanced')}
          >
            Advanced (25)
          </button>
          <button
            className={`filter-pill ${activeFilter === 'earned' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('earned')}
          >
            Earned ({earnedCount})
          </button>
          <button
            className={`filter-pill ${activeFilter === 'locked' ? 'filter-pill-active' : ''}`}
            onClick={() => setActiveFilter('locked')}
          >
            Locked ({100 - earnedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="badges-grid">
        {filteredBadges.map((badge) => {
          const progress = earnedMap[badge.id];
          const isUnlocked = Boolean(progress?.unlocked);

          return (
            <div
              key={badge.id}
              className={`badge-cell tier-${badge.tier} ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
              onClick={() => setSelectedBadge(badge)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedBadge(badge);
                }
              }}
              aria-label={`${badge.id}: ${badge.name}, Tier: ${badge.tier}. ${isUnlocked ? 'Earned' : 'Locked'}. ${badge.unlockCondition}`}
            >
              <div className="badge-icon-wrapper">
                <img
                  src={`/${badge.assetPath}`}
                  alt=""
                  className={`badge-icon-img ${!isUnlocked ? 'badge-silhouette' : ''}`}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if asset path is unavailable
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {!isUnlocked && (
                  <span className="locked-padlock" aria-hidden="true">🔒</span>
                )}
              </div>

              <div className="badge-cell-info">
                <div className="badge-id-tier">
                  <span className="badge-id">{badge.id}</span>
                  <span className={`badge-tier-tag tier-tag-${badge.tier}`}>{badge.tier}</span>
                </div>
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-criteria-short">{badge.unlockCondition}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="badge-modal-title">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <span className={`badge-tier-tag tier-tag-${selectedBadge.tier}`}>
                  {selectedBadge.tier.toUpperCase()} TIER
                </span>
                <h3 id="badge-modal-title">{selectedBadge.id} — {selectedBadge.name}</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setSelectedBadge(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body badge-modal-body">
              <div className="modal-badge-visual">
                <img
                  src={`/${selectedBadge.assetPath}`}
                  alt={selectedBadge.name}
                  className="modal-badge-img"
                />
              </div>

              <div className="modal-badge-text">
                <div className="criteria-box">
                  <strong>Unlock Condition:</strong>
                  <p>{selectedBadge.unlockCondition}</p>
                </div>

                <div className="status-box">
                  <strong>Current Status:</strong>
                  <p>
                    {earnedMap[selectedBadge.id]?.unlocked
                      ? `Earned on ${new Date(earnedMap[selectedBadge.id]?.earnedAt || '').toLocaleDateString()}`
                      : 'Locked. Keep exploring and practicing to unlock!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setSelectedBadge(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
