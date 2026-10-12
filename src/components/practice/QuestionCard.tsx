import React, { useState, useEffect } from 'react';
import type { Question } from '../../domain/types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onSubmitAnswer: (answer: string | number, hintUsed: boolean) => void;
  onNextQuestion: () => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onSubmitAnswer,
  onNextQuestion,
  isAnswerSubmitted,
  isCorrect,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hasUsedHint, setHasUsedHint] = useState<boolean>(false);

  // Reset local state on new question
  useEffect(() => {
    setSelectedAnswer('');
    setShowHint(false);
    setHasUsedHint(false);
  }, [question.id]);

  const handleToggleHint = () => {
    setShowHint(true);
    setHasUsedHint(true);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedAnswer.trim() || isAnswerSubmitted) return;
    onSubmitAnswer(selectedAnswer.trim(), hasUsedHint);
  };

  return (
    <article className="question-card" aria-labelledby="question-prompt-text">
      {/* Question Header */}
      <header className="question-header">
        <div className="progress-indicator">
          <span className="question-step">Question {questionIndex + 1} of {totalQuestions}</span>
          <div className="progress-bar-track" aria-hidden="true">
            <div
              className="progress-bar-fill"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-meta-pills">
          <span className="skill-pill">Level {question.difficulty}</span>
          <span className="version-pill">v{question.generatorVersion}</span>
        </div>
      </header>

      {/* Question Prompt */}
      <div className="question-body">
        <h2 id="question-prompt-text" className="prompt-text">
          {question.prompt}
        </h2>

        {/* Choice Buttons or Numeric Input */}
        {question.responseType === 'multiple_choice' && question.choices ? (
          <div className="choices-grid" role="radiogroup" aria-label="Answer options">
            {question.choices.map((choice, index) => {
              const isSelected = selectedAnswer === choice;
              let choiceClass = 'choice-btn';
              if (isSelected) choiceClass += ' choice-btn-selected';
              if (isAnswerSubmitted) {
                if (choice === String(question.expectedAnswer)) {
                  choiceClass += ' choice-btn-correct';
                } else if (isSelected && !isCorrect) {
                  choiceClass += ' choice-btn-incorrect';
                }
              }

              return (
                <button
                  key={index}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isAnswerSubmitted}
                  className={choiceClass}
                  onClick={() => setSelectedAnswer(choice)}
                >
                  <span className="choice-key" aria-hidden="true">{['A', 'B', 'C', 'D'][index] || index + 1}</span>
                  <span className="choice-label">{choice}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="numeric-input-form">
            <label htmlFor="free-response-input" className="sr-only">Your Answer</label>
            <input
              id="free-response-input"
              type="text"
              disabled={isAnswerSubmitted}
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="answer-text-input"
              autoFocus
            />
          </form>
        )}

        {/* One-Step Hint Section */}
        {!isAnswerSubmitted && (
          <div className="hint-container">
            {!showHint ? (
              <button
                type="button"
                className="btn-request-hint"
                onClick={handleToggleHint}
              >
                💡 Need a thinking hint? (No score penalty)
              </button>
            ) : (
              <div className="hint-box" role="note" aria-live="polite">
                <strong>Next-Step Hint:</strong>
                <p>{question.hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Answer Feedback & Explanation */}
        {isAnswerSubmitted && (
          <div
            className={`feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}
            role="status"
            aria-live="polite"
          >
            <div className="feedback-header">
              <span className="feedback-icon" aria-hidden="true">
                {isCorrect ? '✓' : 'ℹ'}
              </span>
              <div>
                <h3>{isCorrect ? 'Correct! Strong mathematical reasoning.' : 'Not quite this time. Here is the worked explanation:'}</h3>
                <p className="explanation-text">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <footer className="question-footer">
        {!isAnswerSubmitted ? (
          <button
            type="button"
            className="btn-submit-answer"
            disabled={!selectedAnswer.trim()}
            onClick={() => handleSubmit()}
          >
            Submit Answer
          </button>
        ) : (
          <button
            type="button"
            className="btn-next-question"
            onClick={onNextQuestion}
            autoFocus
          >
            {questionIndex + 1 < totalQuestions ? 'Next Question ➔' : 'Complete Session ➔'}
          </button>
        )}
      </footer>
    </article>
  );
};
