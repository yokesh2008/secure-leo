import React, { useState } from 'react';
import { ACADEMY_MODULES } from '../data/academyData';
import { AcademyModule, Lesson } from '../types';
import { BookOpen, CheckCircle2, Circle, Clock, Award, Shield, ChevronRight, Check, Code2, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';

interface LearningPageProps {
  initialModuleId?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ initialModuleId, onNavigate }) => {
  const { addXp } = useUser();
  const { showToast } = useNotification();

  const [selectedModule, setSelectedModule] = useState<AcademyModule>(() => {
    if (initialModuleId) {
      const found = ACADEMY_MODULES.find(m => m.id === initialModuleId);
      if (found) return found;
    }
    return ACADEMY_MODULES[0];
  });

  const [activeLesson, setActiveLesson] = useState<Lesson>(selectedModule.lessons[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    if (selectedQuizOption === activeLesson.miniChallenge.correctAnswer) {
      addXp(30, 'Lesson Challenge Completed');
      showToast('success', 'Challenge Passed!', '+30 XP awarded for mastering this concept.');
    } else {
      showToast('warning', 'Incorrect Answer', 'Review the explanation to reinforce your understanding.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>CYBERSECURITY ACADEMY CURRICULUM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
            LEARNING ACADEMY
          </h1>
          <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
            Theoretical foundations, visual architectures, interactive knowledge checks, and mini challenges across Web, AppSec, and Defensive Security.
          </p>
        </div>

        <button
          onClick={() => onNavigate('quiz')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan font-mono font-bold text-xs uppercase hover:bg-cyber-neonCyan/30 transition-all shadow-glow-cyan"
        >
          <Award className="w-4 h-4" />
          <span>Launch Interactive Quiz Engine →</span>
        </button>
      </div>

      {/* Module Selector Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {ACADEMY_MODULES.map((mod) => {
          const isSelected = mod.id === selectedModule.id;
          return (
            <div
              key={mod.id}
              onClick={() => {
                setSelectedModule(mod);
                setActiveLesson(mod.lessons[0]);
                setSelectedQuizOption(null);
                setQuizSubmitted(false);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyber-card border-cyber-neonGreen shadow-glow-green'
                  : 'bg-cyber-card/60 border-cyber-border hover:border-cyber-borderGlow'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan font-bold">
                  {mod.category}
                </span>
                <span className="text-xs font-mono text-cyber-textMuted">
                  {mod.lessons.length} Lessons
                </span>
              </div>
              <h3 className="text-sm font-mono font-bold text-cyber-textBright">
                {mod.title}
              </h3>
              <p className="mt-1 text-xs text-cyber-textDim line-clamp-2">
                {mod.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Lesson Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Lesson Navigation List (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-cyber-card border border-cyber-border p-4 shadow-card-glow space-y-2">
          <span className="text-xs font-mono text-cyber-textMuted uppercase font-bold block px-2 mb-2">
            Curriculum Lessons:
          </span>

          {selectedModule.lessons.map((lesson, idx) => {
            const isActive = lesson.id === activeLesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-cyber-surface border-cyber-neonGreen text-cyber-textBright font-bold shadow-sm'
                    : 'bg-cyber-surface/40 border-cyber-border hover:border-cyber-borderGlow text-cyber-textDim'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-cyber-neonGreen">
                    {idx + 1}.
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-mono truncate">{lesson.title}</h4>
                    <span className="text-[10px] font-mono text-cyber-textMuted flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {lesson.estimatedMinutes}m read
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyber-neonGreen' : 'text-cyber-border'}`} />
              </div>
            );
          })}
        </div>

        {/* Right Lesson Detailed Reader (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-cyber-card border border-cyber-border p-6 sm:p-8 shadow-card-glow space-y-6">
          <div className="border-b border-cyber-border pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                {selectedModule.category}
              </span>
              <span className="text-xs font-mono text-cyber-textMuted">
                {activeLesson.estimatedMinutes} Mins Read Time
              </span>
            </div>
            <h2 className="text-2xl font-mono font-black text-cyber-textBright uppercase">
              {activeLesson.title}
            </h2>
          </div>

          {/* Theory Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonGreen">
              Theoretical Concepts & Deep Dive
            </h3>
            {activeLesson.theory.map((para, i) => (
              <p key={i} className="text-xs sm:text-sm text-cyber-textDim leading-relaxed font-sans">
                {para}
              </p>
            ))}
          </div>

          {/* Visual Concept Architecture */}
          <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonCyan block">
              Architectural Concept Description:
            </span>
            <p className="text-xs font-mono text-cyber-textBright leading-relaxed">
              {activeLesson.visualConcept}
            </p>
          </div>

          {/* Safe Demo Code Snippet */}
          {activeLesson.safeDemoCode && (
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textMuted block mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyber-neonGreen" />
                Defensive Code Reference:
              </span>
              <pre className="p-4 rounded-xl bg-[#05080e] border border-cyber-border font-mono text-xs text-cyber-neonGreen overflow-x-auto whitespace-pre leading-relaxed">
                {activeLesson.safeDemoCode}
              </pre>
            </div>
          )}

          {/* Key Takeaways */}
          <div className="space-y-2 pt-2 border-t border-cyber-border/60">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright block">
              Key Security Takeaways:
            </span>
            <ul className="space-y-1.5">
              {activeLesson.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-cyber-textDim font-mono leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-cyber-neonGreen flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini Challenge / Knowledge Check */}
          <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-cyber-neonAmber flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Lesson Mini Challenge (+30 XP)
              </span>
            </div>

            <p className="text-xs sm:text-sm font-mono font-semibold text-cyber-textBright">
              {activeLesson.miniChallenge.question}
            </p>

            <div className="space-y-2">
              {activeLesson.miniChallenge.options.map((option, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === activeLesson.miniChallenge.correctAnswer;

                let optionStyle = 'bg-cyber-panel border-cyber-border text-cyber-textDim hover:border-cyber-borderGlow';
                if (quizSubmitted) {
                  if (isCorrect) optionStyle = 'bg-cyber-neonGreen/20 border-cyber-neonGreen text-cyber-neonGreen font-bold';
                  else if (isSelected && !isCorrect) optionStyle = 'bg-cyber-neonRed/20 border-cyber-neonRed text-cyber-neonRed';
                } else if (isSelected) {
                  optionStyle = 'bg-cyber-neonCyan/15 border-cyber-neonCyan text-cyber-textBright font-bold shadow-sm';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${optionStyle}`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedQuizOption === null}
                className="px-5 py-2 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
              >
                Submit Answer
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-cyber-panel border border-cyber-border font-mono text-xs leading-relaxed text-cyber-textBright">
                <span className="text-cyber-neonCyan font-bold block mb-1">
                  Explanation:
                </span>
                {activeLesson.miniChallenge.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
