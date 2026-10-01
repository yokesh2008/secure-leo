import React from 'react';
import { useUser } from '../context/UserContext';
import { RadarChart } from '../components/visual/RadarChart';
import { LABS_DATA } from '../data/labsData';
import { Shield, Award, FileText, CheckCircle2, Zap, ArrowRight, User, Terminal, BookOpen, Layers, Lock } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string, param?: string) => void;
  onOpenTerminal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenTerminal }) => {
  const { user, reports, achievements, completedLabs } = useUser();

  const xpProgressPercent = Math.round((user.xp / user.nextLevelXp) * 100);

  const levels = ['NOVICE', 'LEARNER', 'PRACTITIONER', 'SECURITY RESEARCHER', 'SECURITY ENGINEER'] as const;
  const currentLevelIndex = levels.indexOf(user.level as any);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Personalized Welcome Header */}
      <div className="p-8 rounded-3xl bg-cyber-card border border-cyber-border shadow-card-glow relative overflow-hidden">
        {/* Subtle radial aura */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyber-neonGreen/5 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-pulse" />
              <span className="text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider">
                SECURITY RESEARCH CONSOLE
              </span>
              <span className="text-cyber-border">|</span>
              <span className="text-xs font-mono text-cyber-neonCyan">
                {user.title}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-mono font-black text-cyber-textBright uppercase tracking-tight">
              WELCOME BACK, <span className="text-cyber-neonGreen drop-shadow-[0_0_15px_rgba(0,255,157,0.3)]">{user.name}</span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-cyber-textDim max-w-2xl leading-relaxed">
              Continue your security research journey, explore vulnerable application internals, verify defensive remediations, and build production-grade cybersecurity case studies.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-panel border border-cyber-border hover:border-cyber-neonGreen text-cyber-textDim hover:text-cyber-neonGreen font-mono text-xs transition-colors"
            >
              <Terminal className="w-4 h-4 text-cyber-neonGreen" />
              <span>LEO TERMINAL</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textBright font-mono text-xs font-bold transition-all shadow-glow-cyan"
            >
              <User className="w-4 h-4 text-cyber-neonCyan" />
              <span>Researcher Profile</span>
            </button>
          </div>
        </div>

        {/* Level Progression Stepper */}
        <div className="mt-8 pt-6 border-t border-cyber-border/60">
          <div className="flex items-center justify-between text-xs font-mono mb-3">
            <span className="text-cyber-textMuted uppercase font-bold">
              RESEARCHER PROGRESSION TIER:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-cyber-neonGreen font-black">{user.xp} XP</span>
              <span className="text-cyber-textMuted">/ {user.nextLevelXp} XP to next milestone</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-3">
            {levels.map((lvl, idx) => {
              const isPassed = idx <= currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;

              return (
                <div key={lvl} className="flex flex-col items-center">
                  <div
                    className={`w-full h-2 rounded-full mb-2 transition-all ${
                      isPassed
                        ? 'bg-gradient-to-r from-cyber-neonCyan to-cyber-neonGreen shadow-glow-green'
                        : 'bg-cyber-surface border border-cyber-border/40'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono tracking-tight text-center uppercase font-bold truncate w-full ${
                      isCurrent
                        ? 'text-cyber-neonGreen font-black'
                        : isPassed
                        ? 'text-cyber-textBright'
                        : 'text-cyber-textMuted'
                    }`}
                  >
                    {lvl}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between shadow-card-glow">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase font-bold block mb-1">
              CURRENT TIER
            </span>
            <span className="text-xl font-mono font-black text-cyber-neonGreen tracking-tight">
              {user.level}
            </span>
            <span className="text-[10px] font-mono text-cyber-textDim block mt-1">
              Rank Level 3 / 5
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between shadow-card-glow">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase font-bold block mb-1">
              TOTAL XP EARNED
            </span>
            <span className="text-3xl font-mono font-black text-cyber-neonCyan tracking-tight">
              {user.xp}
            </span>
            <span className="text-[10px] font-mono text-cyber-textDim block mt-1">
              Top 5% Learning Velocity
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyber-neonCyan/10 border border-cyber-neonCyan/30 text-cyber-neonCyan">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between shadow-card-glow">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase font-bold block mb-1">
              LABS COMPLETED
            </span>
            <span className="text-3xl font-mono font-black text-cyber-neonAmber tracking-tight">
              {completedLabs.length} / 12
            </span>
            <span className="text-[10px] font-mono text-cyber-textDim block mt-1">
              Hands-on environments
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyber-neonAmber/10 border border-cyber-neonAmber/30 text-cyber-neonAmber">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between shadow-card-glow">
          <div>
            <span className="text-xs font-mono text-cyber-textMuted uppercase font-bold block mb-1">
              REPORTS SUBMITTED
            </span>
            <span className="text-3xl font-mono font-black text-cyber-neonPurple tracking-tight">
              {reports.length}
            </span>
            <span className="text-[10px] font-mono text-cyber-textDim block mt-1">
              Bug Bounty Advisories
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyber-neonPurple/10 border border-cyber-neonPurple/30 text-cyber-neonPurple">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Mid-Row: Competency Radar & Learning Roadmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Competency Radar Visualization (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
          <div className="flex items-center justify-between mb-4 border-b border-cyber-border/60 pb-3">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-neonCyan flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyber-neonGreen" />
                SECURITY SKILLS COMPETENCY MATRIX
              </h3>
              <p className="text-xs text-cyber-textDim mt-0.5">
                Multi-domain evaluation based on lab completions & assessments.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen">
              YOKESH B.E CSE
            </span>
          </div>

          <div className="flex items-center justify-center py-4">
            <RadarChart skills={user.skills} size={340} />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-cyber-border/60 text-[11px] font-mono">
            {user.skills.slice(0, 4).map((s) => (
              <div key={s.name} className="flex justify-between p-2 rounded bg-cyber-surface border border-cyber-border/40">
                <span className="text-cyber-textMuted">{s.name}:</span>
                <span className="text-cyber-neonGreen font-bold">{s.level}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recommended Actions & Recent Activity (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Lab Suggestions */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-textBright mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyber-neonGreen" />
              RECOMMENDED SECURITY LABS
            </h3>

            <div className="space-y-3">
              {LABS_DATA.slice(2, 5).map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => onNavigate('lab-detail', lab.slug)}
                  className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyber-textBright group-hover:text-cyber-neonGreen transition-colors">
                        {lab.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                        {lab.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyber-textMuted mt-0.5 truncate max-w-sm">
                      {lab.briefDescription}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyber-textMuted group-hover:text-cyber-neonGreen group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Unlocked Achievements */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-neonAmber flex items-center gap-2">
                <Award className="w-4 h-4" />
                RECENT BADGES & ACCOMPLISHMENTS
              </h3>
              <button
                onClick={() => onNavigate('achievements')}
                className="text-xs font-mono text-cyber-neonCyan hover:underline"
              >
                View All ({achievements.length}) →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  className="p-3 rounded-xl bg-cyber-surface border border-cyber-border flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-mono font-bold text-cyber-textBright truncate">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-mono text-cyber-neonGreen">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
