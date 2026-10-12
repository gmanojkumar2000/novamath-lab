import React from 'react';
import type { AppTab } from '../domain/types';
import './Navigation.css';

interface NavigationProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unlockedBadgeCount: number;
}

interface NavItem {
  id: AppTab;
  label: string;
  icon: string;
  badgeCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  unlockedBadgeCount,
}) => {
  const items: NavItem[] = [
    { id: 'home', label: 'Daily Lab', icon: '🧭' },
    { id: 'practice', label: 'Topics', icon: '📚' },
    { id: 'missions', label: 'Missions', icon: '🛰️' },
    { id: 'badges', label: 'Badges', icon: '🏅', badgeCount: unlockedBadgeCount },
    { id: 'parent', label: 'Parent View', icon: '⚙️' },
  ];

  return (
    <nav className="app-nav" aria-label="Main Navigation">
      <div className="nav-tabs" role="tablist">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`nav-tab ${isActive ? 'nav-tab-active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <span className="tab-icon" aria-hidden="true">{item.icon}</span>
              <span className="tab-label">{item.label}</span>
              {typeof item.badgeCount === 'number' && (
                <span className="tab-counter" aria-label={`${item.badgeCount} of 100 badges earned`}>
                  {item.badgeCount}/100
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
