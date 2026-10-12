import React, { useState, useEffect } from 'react';
import type { AppState, AppTab, LearnerProfile, Question, Session } from '../domain/types';
import { loadState, saveState } from '../storage/persistence';
import {
  createDailySession,
  createTopicSession,
  recordQuestionResponse,
  completeSession,
  type SessionSummary,
} from '../engine/sessionManager';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { QuestionCard } from '../components/practice/QuestionCard';
import { SessionSummaryCard } from '../components/practice/SessionSummaryCard';
import { HomeView } from '../features/home/HomeView';
import { PracticeView } from '../features/practice/PracticeView';
import { MissionsView } from '../features/missions/MissionsView';
import { BadgesView } from '../features/badges/BadgesView';
import { ParentView } from '../features/parent/ParentView';
import './App.css';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const { state: initial, recoveredFromError, warning } = loadState();
    if (recoveredFromError && warning) {
      console.warn('NovaMath Lab storage note:', warning);
    }
    return initial;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState<boolean>(false);

  // Active Practice Session State
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  // Auto-save on state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateProfile = (newProfile: LearnerProfile) => {
    setState((prev) => ({
      ...prev,
      profile: newProfile,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleReloadState = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  const handleDismissDiagnosticPreview = () => {
    setState((prev) => ({
      ...prev,
      diagnosticCompleted: true,
      updatedAt: new Date().toISOString(),
    }));
    setShowDiagnosticModal(false);
    showToast('Diagnostic preview dismissed. You can start practicing anytime.');
  };

  // Session Handlers
  const handleStartDailySession = () => {
    const { session, questions } = createDailySession(state);
    setActiveSession(session);
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setSessionSummary(null);
    setQuestionStartTime(Date.now());
  };

  const handleStartTopicPractice = (skillId: string) => {
    const { session, questions } = createTopicSession(skillId, state, 5);
    setActiveSession(session);
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setSessionSummary(null);
    setQuestionStartTime(Date.now());
  };

  const handleSubmitAnswer = (answer: string | number, hintUsed: boolean) => {
    if (!activeSession || !activeQuestions[currentQuestionIndex]) return;

    const currentQ = activeQuestions[currentQuestionIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    const { updatedSession, isCorrect } = recordQuestionResponse(
      activeSession,
      currentQ,
      answer,
      hintUsed,
      timeSpent
    );

    setActiveSession(updatedSession);
    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(isCorrect);
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;

    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(null);
      setQuestionStartTime(Date.now());
    } else {
      // Conclude session
      const { updatedState, summary } = completeSession(activeSession, state);
      setState(updatedState);
      saveState(updatedState);
      setSessionSummary(summary);
      showToast('Practice session completed and saved to device!');
    }
  };

  const handleFinishSession = () => {
    setActiveSession(null);
    setActiveQuestions([]);
    setSessionSummary(null);
    setActiveTab('home');
  };

  const handleExitSession = () => {
    if (window.confirm('Do you want to exit this practice session? Unfinished questions will not be saved.')) {
      setActiveSession(null);
      setActiveQuestions([]);
      setSessionSummary(null);
    }
  };

  const unlockedBadgeCount = Object.values(state.badges).filter((b) => b.unlocked).length;

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner" role="status" aria-live="polite">
          <span>{toastMessage}</span>
          <button className="toast-close" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      <div className="app-container">
        <Header profile={state.profile} />

        {/* If in an active practice session, show practice view header bar */}
        {activeSession ? (
          <div className="active-session-topbar">
            <button className="btn-exit-session" onClick={handleExitSession}>
              ← Exit Practice
            </button>
            <span className="session-type-label">
              {activeSession.type === 'daily' ? "Today's Daily Reasoning Lab" : 'Focused Skill Workout'}
            </span>
          </div>
        ) : (
          <Navigation
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            unlockedBadgeCount={unlockedBadgeCount}
          />
        )}

        <main className="main-content" id="main-content">
          {activeSession ? (
            sessionSummary ? (
              <SessionSummaryCard
                summary={sessionSummary}
                onFinish={handleFinishSession}
                onPracticeMore={() => {
                  handleFinishSession();
                  setActiveTab('practice');
                }}
              />
            ) : (
              activeQuestions[currentQuestionIndex] && (
                <QuestionCard
                  question={activeQuestions[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={activeQuestions.length}
                  onSubmitAnswer={handleSubmitAnswer}
                  onNextQuestion={handleNextQuestion}
                  isAnswerSubmitted={isAnswerSubmitted}
                  isCorrect={isAnswerCorrect}
                />
              )
            )
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  state={state}
                  onNavigate={setActiveTab}
                  onStartDiagnostic={() => setShowDiagnosticModal(true)}
                  onStartDailySession={handleStartDailySession}
                />
              )}

              {activeTab === 'practice' && (
                <PracticeView
                  state={state}
                  onStartTopicPractice={handleStartTopicPractice}
                />
              )}

              {activeTab === 'missions' && (
                <MissionsView state={state} />
              )}

              {activeTab === 'badges' && (
                <BadgesView state={state} />
              )}

              {activeTab === 'parent' && (
                <ParentView
                  state={state}
                  onUpdateProfile={handleUpdateProfile}
                  onReloadState={handleReloadState}
                  onShowMessage={showToast}
                />
              )}
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>
            NovaMath Lab — Educational math & science prototype. Private and local-first. No accounts or telemetry.
          </p>
          <div className="footer-links">
            <span>Schema v{state.schemaVersion}</span>
            {!activeSession && (
              <>
                <span>•</span>
                <button className="footer-link-btn" onClick={() => setActiveTab('parent')}>
                  Parent Controls
                </button>
              </>
            )}
          </div>
        </footer>
      </div>

      {/* Diagnostic roadmap preview */}
      {showDiagnosticModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="diag-title">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="grade-badge">Roadmap Preview</span>
                <h3 id="diag-title">Personalized Diagnostic</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowDiagnosticModal(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>
                A future launch check will use five adaptive items covering factors, fraction arithmetic, ratio balance, negative numbers, and basic equations.
              </p>

              <div className="preview-lab-notice">
                <div className="notice-icon" aria-hidden="true">🎯</div>
                <div>
                  <strong>Planned for Milestone 2</strong>
                  <p>
                    Initial skill-level calibration is not active yet. Daily and topic practice are ready to use now.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={handleDismissDiagnosticPreview}>
                Hide This Preview
              </button>
              <button className="btn-ghost" onClick={() => setShowDiagnosticModal(false)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
