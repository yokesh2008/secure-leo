import React from 'react';
import { useUser } from '../context/UserContext';
import { Award, Lock, CheckCircle2, Zap, Clock, ShieldCheck } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useUser();

  const unlockedCount = achievements.filter(a => a.status === 'unlocked').length;
  const inProgressCount = achievements.filter(a => a.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonAmber font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>PROGRESSION & HONORS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
            ACHIEVEMENTS & BADGES
          </h1>
          <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
            Verify cybersecurity milestones, defensive code audits, and responsible reporting achievements.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-border">
            <span className="text-cyber-textMuted uppercase block text-[10px]">Unlocked</span>
            <span className="text-cyber-neonGreen font-bold text-base">{unlockedCount} / {achievements.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-border">
            <span className="text-cyber-textMuted uppercase block text-[10px]">In Progress</span>
            <span className="text-cyber-neonCyan font-bold text-base">{inProgressCount}</span>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = ach.status === 'unlocked';
          const isInProgress = ach.status === 'in_progress';

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isUnlocked
                  ? 'bg-cyber-card border-cyber-neonGreen/40 shadow-glow-green'
                  : isInProgress
                  ? 'bg-cyber-card border-cyber-neonCyan/40 shadow-glow-cyan'
                  : 'bg-cyber-card/40 border-cyber-border opacity-70'
              }`}
            >
              {/* Subtle top glow bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isUnlocked
                    ? 'bg-cyber-neonGreen'
                    : isInProgress
                    ? 'bg-cyber-neonCyan'
                    : 'bg-cyber-border'
                }`}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl border ${
                      isUnlocked
                        ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen'
                        : isInProgress
                        ? 'bg-cyber-neonCyan/10 border-cyber-neonCyan text-cyber-neonCyan'
                        : 'bg-cyber-surface border-cyber-border text-cyber-textMuted'
                    }`}
                  >
                    {isUnlocked ? (
                      <Award className="w-6 h-6" />
                    ) : isInProgress ? (
                      <Zap className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      isUnlocked
                        ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen/30 text-cyber-neonGreen'
                        : isInProgress
                        ? 'bg-cyber-neonCyan/10 border-cyber-neonCyan/30 text-cyber-neonCyan'
                        : 'bg-cyber-surface border-cyber-border text-cyber-textMuted'
                    }`}
                  >
                    {ach.status.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-cyber-textMuted uppercase tracking-wider block">
                  {ach.category}
                </span>

                <h3 className="text-base font-mono font-bold text-cyber-textBright mt-1">
                  {ach.title}
                </h3>

                <p className="text-xs text-cyber-textDim mt-2 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/60">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-cyber-textMuted">Progress:</span>
                  <span className="text-cyber-textBright font-semibold">
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border/40">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isUnlocked
                        ? 'bg-cyber-neonGreen'
                        : isInProgress
                        ? 'bg-cyber-neonCyan'
                        : 'bg-cyber-textMuted'
                    }`}
                    style={{ width: `${Math.round((ach.progress / ach.maxProgress) * 100)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyber-neonGreen font-bold">
                    +{ach.xpReward} XP
                  </span>
                  {ach.unlockedAt && (
                    <span className="text-cyber-textMuted text-[10px]">
                      Unlocked {ach.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
