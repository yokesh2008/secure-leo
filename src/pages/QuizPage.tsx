import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { Award, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight, Zap, Check, X, Shield } from 'lucide-react';

interface QuizPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ onNavigate }) => {
  const { addXp } = useUser();
  const { showToast } = useNotification();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const topics = ['All', 'Access Control', 'Injection', 'Client-Side Security', 'Web Security', 'Authentication', 'Input Validation', 'API Security', 'Defensive Architecture'];

  const filteredQuestions = QUIZ_QUESTIONS.filter(q =>
    selectedTopic === 'All' ? true : q.topic === selectedTopic
  );

  const currentQ = filteredQuestions[currentIndex] || QUIZ_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);

    if (selectedOption === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
      addXp(25, 'Quiz Correct Answer');
      showToast('success', 'Correct Answer!', '+25 XP awarded.');
    } else {
      showToast('warning', 'Incorrect Answer', 'Review the explanation to learn the security concept.');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      showToast('achievement', 'Quiz Completed!', `You scored ${score + (selectedOption === currentQ.correctAnswer ? 1 : 0)} / ${filteredQuestions.length}`);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const progressPercent = Math.round(((currentIndex + 1) / filteredQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-panel border border-cyber-border mb-3">
          <Award className="w-3.5 h-3.5 text-cyber-neonGreen" />
          <span className="text-xs font-mono text-cyber-neonCyan uppercase tracking-widest font-bold">
            CYBERSECURITY KNOWLEDGE ASSESSMENT
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
          INTERACTIVE QUIZ ENGINE
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-cyber-textDim max-w-xl mx-auto leading-relaxed">
          Test your comprehension of OWASP vectors, defense-in-depth principles, and secure programming patterns.
        </p>
      </div>

      {/* Topic Filter Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => {
              setSelectedTopic(t);
              handleRestartQuiz();
            }}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
              selectedTopic === t
                ? 'bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan font-bold shadow-glow-cyan'
                : 'bg-cyber-card border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!isFinished ? (
        <div className="rounded-3xl bg-cyber-card border border-cyber-border p-6 sm:p-10 shadow-card-glow space-y-6">
          {/* Progress Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-cyber-textMuted uppercase">
                QUESTION {currentIndex + 1} OF {filteredQuestions.length}
              </span>
              <span className="text-cyber-neonCyan font-bold">
                SCORE: {score} / {currentIndex}
              </span>
            </div>
            <div className="w-full h-1.5 bg-cyber-surface rounded-full overflow-hidden border border-cyber-border/40">
              <div
                className="h-full bg-gradient-to-r from-cyber-neonCyan to-cyber-neonGreen transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Metadata */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen font-semibold">
              Topic: {currentQ.topic}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted">
              Diff: {currentQ.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-mono font-bold text-cyber-textBright leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let optionStyle = 'bg-cyber-surface border-cyber-border text-cyber-textDim hover:border-cyber-borderGlow';
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-cyber-neonGreen/20 border-cyber-neonGreen text-cyber-neonGreen font-bold shadow-glow-green';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-cyber-neonRed/20 border-cyber-neonRed text-cyber-neonRed';
                }
              } else if (isSelected) {
                optionStyle = 'bg-cyber-neonCyan/15 border-cyber-neonCyan text-cyber-textBright font-bold shadow-glow-cyan';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-mono cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyber-panel border border-cyber-border flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && (
                    <div>
                      {isCorrect && <Check className="w-5 h-5 text-cyber-neonGreen" />}
                      {isSelected && !isCorrect && <X className="w-5 h-5 text-cyber-neonRed" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-cyber-panel border border-cyber-border font-mono text-xs leading-relaxed text-cyber-textBright">
              <span className="text-cyber-neonCyan font-bold uppercase block mb-1">
                Technical Explanation:
              </span>
              {currentQ.explanation}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-cyber-border flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyber-neonCyan text-cyber-bg font-mono font-bold text-xs uppercase hover:bg-cyber-neonCyan/90 transition-all shadow-glow-cyan"
              >
                <span>{currentIndex + 1 < filteredQuestions.length ? 'Next Question' : 'View Summary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Screen */
        <div className="rounded-3xl bg-cyber-card border border-cyber-border p-10 shadow-card-glow text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen">
            <Shield className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-mono font-black text-cyber-textBright uppercase">
            ASSESSMENT COMPLETED
          </h2>

          <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border max-w-sm mx-auto font-mono">
            <span className="text-xs text-cyber-textMuted uppercase block">Final Score</span>
            <span className="text-4xl font-black text-cyber-neonGreen mt-1 block">
              {score} / {filteredQuestions.length}
            </span>
            <span className="text-xs text-cyber-neonCyan block mt-2">
              Accuracy: {Math.round((score / filteredQuestions.length) * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-textDim text-cyber-textBright font-mono text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
            >
              Return to Researcher Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
