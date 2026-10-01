import React, { useState } from 'react';
import { Lab, LabTask, LabHint } from '../../types';
import { CheckCircle2, Circle, HelpCircle, RotateCcw, Award, Clock, Zap, Shield, ChevronRight, Lock } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';

interface LabControlPanelProps {
  lab: Lab;
  tasks: LabTask[];
  onToggleTask: (taskId: string) => void;
  onResetLab: () => void;
  onAdvanceWorkflow: () => void;
}

export const LabControlPanel: React.FC<LabControlPanelProps> = ({
  lab,
  tasks,
  onToggleTask,
  onResetLab,
  onAdvanceWorkflow,
}) => {
  const { addXp } = useUser();
  const { showToast } = useNotification();
  const [unlockedHints, setUnlockedHints] = useState<number[]>([1]); // Hint 1 free
  const [activeHintTab, setActiveHintTab] = useState<number>(1);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const unlockHint = (level: number, cost: number) => {
    if (!unlockedHints.includes(level)) {
      setUnlockedHints(prev => [...prev, level]);
      setActiveHintTab(level);
      showToast('info', `Hint ${level} Unlocked`, `Security hint ${level} is now revealed.`);
    } else {
      setActiveHintTab(level);
    }
  };

  const difficultyColors = {
    Beginner: 'text-cyber-neonGreen border-cyber-neonGreen/30 bg-cyber-neonGreen/10',
    Intermediate: 'text-cyber-neonCyan border-cyber-neonCyan/30 bg-cyber-neonCyan/10',
    Advanced: 'text-cyber-neonAmber border-cyber-neonAmber/30 bg-cyber-neonAmber/10',
    Expert: 'text-cyber-neonRed border-cyber-neonRed/30 bg-cyber-neonRed/10',
  }[lab.difficulty];

  return (
    <div className="flex flex-col h-full bg-cyber-card border-r border-cyber-border overflow-y-auto">
      {/* Header & Meta */}
      <div className="p-5 border-b border-cyber-border">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${difficultyColors}`}>
            {lab.difficulty}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen font-semibold">
            +{lab.points} XP
          </span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-cyber-textMuted ml-auto">
            <Clock className="w-3 h-3" />
            {lab.estimatedMinutes}m
          </span>
        </div>

        <h2 className="text-base font-bold text-cyber-textBright font-mono leading-snug">
          {lab.title}
        </h2>
        <p className="mt-1 text-xs text-cyber-textDim leading-relaxed">
          {lab.briefDescription}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-cyber-border/60">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-cyber-textMuted">PROGRESS</span>
            <span className="text-cyber-neonGreen font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border/40">
            <div
              className="h-full bg-gradient-to-r from-cyber-neonCyan to-cyber-neonGreen transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="p-5 border-b border-cyber-border">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonCyan mb-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Learning Objectives
        </h3>
        <ul className="space-y-2">
          {lab.learningObjectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-cyber-textDim leading-relaxed">
              <span className="text-cyber-neonGreen mt-0.5 font-mono">›</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks Checklist */}
      <div className="p-5 border-b border-cyber-border flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyber-neonGreen" />
            Lab Tasks ({completedCount}/{tasks.length})
          </h3>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                task.completed
                  ? 'bg-cyber-surface/80 border-cyber-neonGreen/40 text-cyber-textBright'
                  : 'bg-cyber-surface/30 border-cyber-border/70 hover:border-cyber-border text-cyber-textDim'
              }`}
            >
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-cyber-neonGreen flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-cyber-textMuted flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-xs font-medium leading-snug ${task.completed ? 'line-through text-cyber-textMuted' : ''}`}>
                  {task.text}
                </p>
                {task.hint && (
                  <p className="mt-1 text-[11px] font-mono text-cyber-textMuted">
                    💡 {task.hint}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Hints Section */}
      <div className="p-5 border-b border-cyber-border bg-cyber-surface/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonAmber flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Progressive Hints
          </h3>
        </div>

        {/* Hint Level Selector */}
        <div className="flex gap-2 mb-3">
          {lab.hints.map((hint) => {
            const isUnlocked = unlockedHints.includes(hint.level);
            return (
              <button
                key={hint.level}
                onClick={() => {
                  if (isUnlocked) setActiveHintTab(hint.level);
                  else unlockHint(hint.level, hint.costXp);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  activeHintTab === hint.level
                    ? 'bg-cyber-panel border-cyber-neonAmber text-cyber-neonAmber shadow-glow-amber'
                    : isUnlocked
                    ? 'bg-cyber-surface border-cyber-border text-cyber-textBright hover:border-cyber-textDim'
                    : 'bg-cyber-bg border-cyber-border/50 text-cyber-textMuted hover:border-cyber-neonAmber/50'
                }`}
              >
                {!isUnlocked && <Lock className="w-2.5 h-2.5" />}
                Hint {hint.level}
              </button>
            );
          })}
        </div>

        {/* Active Hint Content */}
        {(() => {
          const currentHint = lab.hints.find(h => h.level === activeHintTab) || lab.hints[0];
          const isUnlocked = unlockedHints.includes(currentHint.level);

          if (!isUnlocked) {
            return (
              <div className="p-3 rounded-lg border border-dashed border-cyber-border bg-cyber-bg/60 text-center">
                <p className="text-xs text-cyber-textDim mb-2 font-mono">
                  This hint is currently locked.
                </p>
                <button
                  onClick={() => unlockHint(currentHint.level, currentHint.costXp)}
                  className="px-3 py-1 rounded bg-cyber-neonAmber/20 border border-cyber-neonAmber/50 text-cyber-neonAmber font-mono text-xs hover:bg-cyber-neonAmber/30 transition-colors"
                >
                  Reveal Hint {currentHint.level}
                </button>
              </div>
            );
          }

          return (
            <div className="p-3 rounded-lg border border-cyber-border bg-cyber-panel/60 font-mono text-xs text-cyber-textBright leading-relaxed">
              {currentHint.content}
            </div>
          );
        })()}
      </div>

      {/* Lab Reset & Action Bar */}
      <div className="p-4 bg-cyber-surface flex items-center justify-between gap-3 border-t border-cyber-border">
        <button
          onClick={onResetLab}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-panel border border-cyber-border hover:border-cyber-textDim text-cyber-textMuted hover:text-cyber-textBright font-mono text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Lab
        </button>

        <button
          onClick={onAdvanceWorkflow}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-neonGreen/15 border border-cyber-neonGreen hover:bg-cyber-neonGreen/25 text-cyber-neonGreen font-mono font-bold text-xs transition-all shadow-glow-green"
        >
          Remediation & Report
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
