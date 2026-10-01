import React from 'react';
import { Logo } from '../components/common/Logo';
import { StatusStrip } from '../components/common/StatusStrip';
import { MetricCard } from '../components/common/MetricCard';
import { CyberNetworkCanvas } from '../components/visual/CyberNetworkCanvas';
import { LABS_DATA } from '../data/labsData';
import { Shield, ArrowRight, BookOpen, Bug, Award, CheckCircle2, Lock, Terminal, Sparkles, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string, param?: string) => void;
  onOpenTerminal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenTerminal }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* CINEMATIC HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle radial glow background behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyber-neonCyan/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column: Brand & Taglines */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-panel border border-cyber-border mb-6">
              <span className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-pulse" />
              <span className="text-xs font-mono text-cyber-neonCyan uppercase tracking-widest font-semibold">
                ISOLATED CYBERSECURITY RESEARCH LABORATORY
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-cyber-textBright uppercase leading-none">
              SECURE <span className="text-cyber-neonGreen drop-shadow-[0_0_20px_rgba(0,255,157,0.4)]">LEO</span>
            </h1>

            {/* Primary Tagline */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-cyber-neonCyan tracking-wider">
                BREAK. LEARN. SECURE.
              </span>
              <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted">
                v2.4-PROD
              </span>
            </div>

            {/* Secondary Tagline */}
            <p className="mt-2 text-sm sm:text-base font-mono text-cyber-textDim font-medium">
              Explore Vulnerabilities. Understand Security. Build Defenses.
            </p>

            {/* Supporting Description */}
            <p className="mt-5 text-sm sm:text-base text-cyber-textDim leading-relaxed max-w-xl">
              An isolated cybersecurity laboratory for exploring vulnerabilities, understanding attack surfaces, practicing responsible security research, and learning how to build secure applications.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('labs')}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-black text-sm tracking-wider uppercase hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
              >
                <Shield className="w-4 h-4 text-cyber-bg" />
                <span>ENTER SECURITY LAB</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('vulnerabilities')}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyber-surface border border-cyber-neonCyan/40 hover:border-cyber-neonCyan text-cyber-textBright font-mono font-bold text-sm tracking-wider uppercase hover:bg-cyber-panel transition-all shadow-glow-cyan"
              >
                <Bug className="w-4 h-4 text-cyber-neonCyan" />
                <span>EXPLORE SECURITY RESEARCH</span>
              </button>

              <button
                onClick={onOpenTerminal}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-cyber-panel border border-cyber-border hover:border-cyber-textDim text-cyber-textDim hover:text-cyber-textBright font-mono text-xs transition-colors"
                title="Open Simulated Leo Terminal"
              >
                <Terminal className="w-4 h-4 text-cyber-neonGreen" />
                <span className="hidden sm:inline">LEO TERMINAL</span>
              </button>
            </div>

            {/* Safe Lab Notice */}
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-cyber-textMuted">
              <Lock className="w-3.5 h-3.5 text-cyber-neonGreen" />
              <span>100% Isolated Browser Sandbox • Zero Real Network Calls • Ethical Educational Scope</span>
            </div>
          </div>

          {/* Hero Right Column: Interactive Network Visualization */}
          <div className="lg:col-span-5 h-[360px] sm:h-[420px] w-full z-10">
            <CyberNetworkCanvas className="h-full" />
          </div>
        </div>
      </section>

      {/* LIVE SECURITY STATUS STRIP */}
      <StatusStrip />

      {/* SECURITY METRICS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="ACTIVE LABS"
            targetValue={12}
            icon={Shield}
            accentColor="green"
            sublabel="Isolated Hands-on Labs"
          />
          <MetricCard
            label="VULNERABILITIES"
            targetValue={18}
            icon={Bug}
            accentColor="cyan"
            sublabel="Cataloged & Remediated"
          />
          <MetricCard
            label="CHALLENGES COMPLETED"
            targetValue={247}
            icon={CheckCircle2}
            accentColor="amber"
            sublabel="Verified Code Checks"
          />
          <MetricCard
            label="SECURITY REPORTS"
            targetValue={86}
            icon={Award}
            accentColor="purple"
            sublabel="Triaged Bug Reports"
          />
        </div>
      </section>

      {/* FEATURED VULNERABLE LABS PREVIEW */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonCyan font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-cyber-neonGreen" />
              HANDS-ON ENVIRONMENTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-cyber-textBright uppercase">
              Featured Security Labs
            </h2>
            <p className="text-xs sm:text-sm text-cyber-textDim mt-1">
              Step inside intentionally vulnerable applications to analyze root causes and implement code-level fixes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('labs')}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyber-neonCyan hover:text-cyber-neonGreen transition-colors self-start sm:self-auto"
          >
            VIEW ALL 12 LABS →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LABS_DATA.slice(0, 3).map((lab) => (
            <div
              key={lab.id}
              onClick={() => onNavigate('lab-detail', lab.slug)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-neonGreen transition-all duration-300 cursor-pointer shadow-card-glow hover:shadow-glow-green"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan font-semibold">
                    {lab.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen font-bold">
                    +{lab.points} XP
                  </span>
                </div>

                <h3 className="text-base font-mono font-bold text-cyber-textBright group-hover:text-cyber-neonGreen transition-colors">
                  {lab.title}
                </h3>
                <p className="mt-2 text-xs text-cyber-textDim leading-relaxed">
                  {lab.briefDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-cyber-textMuted">{lab.technology}</span>
                <span className="text-cyber-neonCyan group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                  LAUNCH LAB →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-cyber-card/60 border border-cyber-border relative overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider">
                  COMPLETE ECOSYSTEM
                </span>
                <h3 className="text-2xl sm:text-3xl font-mono font-black text-cyber-textBright uppercase mt-2">
                  FROM VULNERABILITY TO DEFENSE
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-cyber-textDim leading-relaxed">
                  SECURE LEO bridges the gap between offensive testing and defensive engineering. Learn how flaws happen in software, how to responsibly report them, and how to write resilient code.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onNavigate('learning')}
                  className="px-5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-neonCyan font-mono text-xs font-bold transition-all"
                >
                  Explore Academy Curriculum →
                </button>
              </div>
            </div>

            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-cyber-panel border border-cyber-border w-fit text-cyber-neonCyan mb-4">
                  <Bug className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-mono font-bold text-cyber-textBright uppercase">
                  Bug Bounty Simulator
                </h4>
                <p className="mt-2 text-xs text-cyber-textDim leading-relaxed">
                  Practice responsible disclosure on fictional scoped targets (`shop.secureleo.local`). Draft standardized reports, assign CVSS scores, and trace simulated triage feedback.
                </p>
              </div>
              <button
                onClick={() => onNavigate('bug-bounty')}
                className="mt-4 text-xs font-mono text-cyber-neonCyan hover:underline text-left"
              >
                View Program Scope & Rules →
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-xl bg-cyber-panel border border-cyber-border w-fit text-cyber-neonGreen mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-mono font-bold text-cyber-textBright uppercase">
                  Vulnerability Intelligence
                </h4>
                <p className="mt-2 text-xs text-cyber-textDim leading-relaxed">
                  10 comprehensive directories spanning SQLi, XSS, IDOR, CSRF, and API security. Detailed root causes, AST diagrams, safe demos, and side-by-side remediation diffs.
                </p>
              </div>
              <button
                onClick={() => onNavigate('vulnerabilities')}
                className="mt-4 text-xs font-mono text-cyber-neonGreen hover:underline text-left"
              >
                Explore Knowledge Base →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
