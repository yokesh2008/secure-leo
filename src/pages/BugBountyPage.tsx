import React from 'react';
import { BUG_BOUNTY_PROGRAM } from '../data/bugBountyData';
import { Bug, Shield, AlertTriangle, CheckCircle2, FileText, ExternalLink, Lock, ArrowRight, DollarSign } from 'lucide-react';

interface BugBountyPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const BugBountyPage: React.FC<BugBountyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Program Header */}
      <div className="p-8 rounded-3xl bg-cyber-card border border-cyber-border mb-10 relative overflow-hidden shadow-card-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonGreen animate-pulse" />
              <span className="text-xs font-mono text-cyber-neonGreen font-bold uppercase tracking-wider">
                {BUG_BOUNTY_PROGRAM.status}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                v{BUG_BOUNTY_PROGRAM.version}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
              {BUG_BOUNTY_PROGRAM.programName}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-cyber-textDim max-w-3xl leading-relaxed">
              {BUG_BOUNTY_PROGRAM.programOverview}
            </p>
          </div>

          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              onClick={() => onNavigate('reports', 'new')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-black text-xs uppercase tracking-wider hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
            >
              <FileText className="w-4 h-4 text-cyber-bg" />
              <span>SUBMIT VULNERABILITY REPORT</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-textBright font-mono text-xs font-semibold transition-colors"
            >
              <span>View Triaged Reports Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Boundary Notice */}
        <div className="mt-6 pt-4 border-t border-cyber-border/60 flex items-center gap-2 text-xs font-mono text-cyber-neonAmber">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>{BUG_BOUNTY_PROGRAM.policyNotice}</span>
        </div>
      </div>

      {/* Grid: Program Scope & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Scope Section (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-neonCyan flex items-center gap-2">
              <Shield className="w-4 h-4" />
              PROGRAM TARGET SCOPE
            </h3>
            <span className="text-[10px] font-mono text-cyber-textMuted">SIMULATED DOMAINS</span>
          </div>

          <div className="divide-y divide-cyber-border/40">
            {BUG_BOUNTY_PROGRAM.targets.map((target) => (
              <div key={target.domain} className="py-3.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyber-textBright">
                      {target.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyber-neonCyan">
                      ({target.domain})
                    </span>
                  </div>
                  <p className="text-[11px] text-cyber-textDim mt-1 leading-relaxed">
                    {target.notes}
                  </p>
                </div>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase flex-shrink-0 ${
                    target.inScope
                      ? 'bg-cyber-neonGreen/15 text-cyber-neonGreen border border-cyber-neonGreen/30'
                      : 'bg-cyber-neonRed/15 text-cyber-neonRed border border-cyber-neonRed/30'
                  }`}
                >
                  {target.inScope ? 'IN SCOPE' : 'OUT OF SCOPE'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyber-neonAmber flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              RULES OF ENGAGEMENT
            </h3>
            <span className="text-[10px] font-mono text-cyber-textMuted">RESPONSIBLE TESTING</span>
          </div>

          <div className="space-y-3">
            {BUG_BOUNTY_PROGRAM.rules.map((rule, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cyber-surface border border-cyber-border">
                <h4 className="text-xs font-mono font-bold text-cyber-textBright mb-1">
                  {idx + 1}. {rule.title}
                </h4>
                <p className="text-[11px] text-cyber-textDim leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Severity Matrix & Payout Guidelines */}
      <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-mono font-bold uppercase text-cyber-textBright flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyber-neonGreen" />
              SEVERITY TIERS & BENCHMARK REWARDS
            </h3>
            <p className="text-xs text-cyber-textDim mt-1">
              Standardized CVSS v3.1 calculation and researcher progression points.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonGreen">
            ETHICAL SIMULATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUG_BOUNTY_PROGRAM.severityTiers.map((tier) => {
            const badgeColor = {
              Critical: 'border-cyber-neonRed/40 bg-cyber-neonRed/5 text-cyber-neonRed',
              High: 'border-cyber-neonAmber/40 bg-cyber-neonAmber/5 text-cyber-neonAmber',
              Medium: 'border-cyber-neonCyan/40 bg-cyber-neonCyan/5 text-cyber-neonCyan',
              Low: 'border-cyber-neonGreen/40 bg-cyber-neonGreen/5 text-cyber-neonGreen',
              Informational: 'border-cyber-border bg-cyber-panel text-cyber-textMuted',
            }[tier.severity];

            return (
              <div
                key={tier.severity}
                className={`p-5 rounded-2xl border flex flex-col justify-between ${badgeColor}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black uppercase tracking-wider">
                      {tier.severity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-textBright font-bold">
                      CVSS {tier.cvssRange}
                    </span>
                  </div>

                  <div className="text-lg font-mono font-black text-cyber-textBright mb-2">
                    {tier.mockBountyRange}
                  </div>

                  <p className="text-xs text-cyber-textDim leading-relaxed mb-4">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cyber-border/60">
                  <span className="text-[10px] font-mono uppercase text-cyber-textMuted block mb-1.5">
                    Example Vulnerabilities:
                  </span>
                  <ul className="space-y-1">
                    {tier.examples.map((ex, i) => (
                      <li key={i} className="text-[11px] font-mono text-cyber-textBright flex items-start gap-1.5">
                        <span className="text-cyber-neonGreen">›</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
