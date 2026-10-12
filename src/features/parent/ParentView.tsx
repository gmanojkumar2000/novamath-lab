import React, { useState } from 'react';
import type { AppState, LearnerProfile } from '../../domain/types';
import { exportStateJson, importStateJson, resetStorage } from '../../storage/persistence';
import './ParentView.css';

interface ParentViewProps {
  state: AppState;
  onUpdateProfile: (profile: LearnerProfile) => void;
  onReloadState: (newState: AppState) => void;
  onShowMessage: (msg: string) => void;
}

export const ParentView: React.FC<ParentViewProps> = ({
  state,
  onUpdateProfile,
  onReloadState,
  onShowMessage,
}) => {
  const [displayName, setDisplayName] = useState(state.profile.displayName);
  const [sessionMinutes, setSessionMinutes] = useState<10 | 15 | 20>(state.profile.preferredSessionMinutes);
  const [soundEnabled, setSoundEnabled] = useState(state.profile.soundEnabled);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const totalAttempts = Object.values(state.skills).reduce((acc, s) => acc + s.attempts, 0);
  const totalCorrect = Object.values(state.skills).reduce((acc, s) => acc + s.correctCount, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const sessionsCount = state.sessions.length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...state.profile,
      displayName: displayName.trim() || 'Explorer',
      preferredSessionMinutes: sessionMinutes,
      soundEnabled,
    });
    onShowMessage('Preferences updated successfully.');
  };

  const handleExport = () => {
    const jsonStr = exportStateJson(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `novamath_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowMessage('Progress data exported to file.');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = importStateJson(importJsonText);
    if (res.success && res.state) {
      onReloadState(res.state);
      setShowImportBox(false);
      setImportJsonText('');
      onShowMessage('Progress data restored successfully.');
    } else {
      alert(`Import failed: ${res.error || 'Unknown format'}`);
    }
  };

  const handleConfirmReset = () => {
    if (resetInput !== 'RESET') {
      alert('Type RESET in capital letters to confirm.');
      return;
    }
    const fresh = resetStorage();
    onReloadState(fresh);
    setShowResetConfirm(false);
    setResetInput('');
    onShowMessage('All local learner data has been reset.');
  };

  return (
    <div className="parent-view" id="tabpanel-parent" role="tabpanel" aria-labelledby="tab-parent">
      <div className="view-intro">
        <h2>Parent Dashboard & Local Data</h2>
        <p>
          NovaMath Lab is private by default. All data remains on this device with zero analytics, accounts, or tracking.
        </p>
      </div>

      <div className="parent-layout">
        {/* Left Column: Progress Insights & Preferences */}
        <div className="parent-column">
          {/* Calm Summary Box */}
          <section className="parent-card" aria-labelledby="overview-heading">
            <h3 id="overview-heading">Learner Progress Overview</h3>
            <div className="parent-stats-grid">
              <div className="parent-stat-box">
                <span className="p-stat-number">{sessionsCount}</span>
                <span className="p-stat-label">Sessions Completed</span>
              </div>
              <div className="parent-stat-box">
                <span className="p-stat-number">{totalCorrect}</span>
                <span className="p-stat-label">Problems Solved</span>
              </div>
              <div className="parent-stat-box">
                <span className="p-stat-number">{accuracy}%</span>
                <span className="p-stat-label">Overall Accuracy</span>
              </div>
            </div>

            <div className="celebration-box">
              <span className="celebration-icon" aria-hidden="true">🌟</span>
              <div>
                <strong>Strength to celebrate:</strong>
                <p>
                  Demonstrates consistent reasoning and persistence when working through multi-step fraction and coordinate challenges!
                </p>
              </div>
            </div>

            <div className="suggested-activity-box">
              <span className="activity-icon" aria-hidden="true">💡</span>
              <div>
                <strong>Off-screen conversation prompt:</strong>
                <p>
                  "How would you figure out a 15% restaurant tip or discount using 10% and half of that?"
                </p>
              </div>
            </div>
          </section>

          {/* Preferences Form */}
          <section className="parent-card" aria-labelledby="pref-heading">
            <h3 id="pref-heading">Learner Settings</h3>
            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="form-group">
                <label htmlFor="learner-name-input">Learner Display Name:</label>
                <input
                  id="learner-name-input"
                  type="text"
                  maxLength={30}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="session-minutes-select">Target Daily Session Length:</label>
                <select
                  id="session-minutes-select"
                  value={sessionMinutes}
                  onChange={(e) => setSessionMinutes(Number(e.target.value) as 10 | 15 | 20)}
                  className="select-input"
                >
                  <option value={10}>10 minutes (Quick workout: 6–8 questions)</option>
                  <option value={15}>15 minutes (Standard recommendation: 8–10 questions)</option>
                  <option value={20}>20 minutes (Deep expedition: 12–15 questions)</option>
                </select>
              </div>

              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span>Enable gentle feedback sound effects</span>
                </label>
              </div>

              <button type="submit" className="btn-primary">
                Save Settings
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Local Data Controls */}
        <div className="parent-column">
          <section className="parent-card" aria-labelledby="data-ctrl-heading">
            <h3 id="data-ctrl-heading">Data Control & Privacy</h3>
            <p className="data-explainer">
              Because NovaMath Lab uses browser storage, clearing browser website cookies/storage can wipe data. Export backups periodically to preserve progress across devices.
            </p>

            <div className="data-actions-stack">
              <div className="data-action-item">
                <div>
                  <strong>Export Backup File</strong>
                  <p className="action-desc">Download all progress, skill levels, and earned badges as JSON.</p>
                </div>
                <button className="btn-secondary" onClick={handleExport}>
                  Export JSON Backup ⭳
                </button>
              </div>

              <div className="data-action-item">
                <div>
                  <strong>Restore / Import Data</strong>
                  <p className="action-desc">Restore previously exported progress onto this device.</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setShowImportBox(!showImportBox)}
                >
                  {showImportBox ? 'Cancel Import' : 'Import JSON...'}
                </button>
              </div>

              {showImportBox && (
                <div className="import-box">
                  <label htmlFor="import-textarea">Paste backup JSON content here:</label>
                  <textarea
                    id="import-textarea"
                    rows={5}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"schemaVersion": 1, ...}'
                    className="textarea-input"
                  />
                  <button className="btn-primary" onClick={handleImport}>
                    Verify & Apply Backup
                  </button>
                </div>
              )}

              <div className="data-action-item danger-zone">
                <div>
                  <strong className="text-danger">Reset All Progress</strong>
                  <p className="action-desc">Permanently erase all local progress, sessions, and badges.</p>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset Data
                </button>
              </div>

              {showResetConfirm && (
                <div className="reset-confirm-box">
                  <p>
                    <strong>Are you sure?</strong> This will erase all learner history on this device.
                  </p>
                  <label htmlFor="confirm-reset-input">Type <code>RESET</code> to confirm:</label>
                  <input
                    id="confirm-reset-input"
                    type="text"
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    className="text-input"
                    placeholder="RESET"
                  />
                  <div className="confirm-buttons-row">
                    <button className="btn-danger" onClick={handleConfirmReset}>
                      Permanently Erase
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        setShowResetConfirm(false);
                        setResetInput('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
