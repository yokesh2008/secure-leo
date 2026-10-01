import React, { useState } from 'react';
import { VULNERABILITIES_DATA } from '../data/vulnerabilitiesData';
import { Vulnerability } from '../types';
import { Bug, Shield, CheckCircle2, AlertTriangle, Code2, ExternalLink, Search, ChevronRight, Layers, FileText } from 'lucide-react';

interface VulnerabilitiesPageProps {
  initialSlug?: string;
  onNavigate: (page: string, param?: string) => void;
}

export const VulnerabilitiesPage: React.FC<VulnerabilitiesPageProps> = ({
  initialSlug,
  onNavigate,
}) => {
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability>(() => {
    if (initialSlug) {
      const found = VULNERABILITIES_DATA.find(v => v.slug === initialSlug);
      if (found) return found;
    }
    return VULNERABILITIES_DATA[0];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'demo' | 'remediation' | 'checklist'>('overview');

  const filteredVulns = VULNERABILITIES_DATA.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.owaspId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const severityBadgeColors = {
    Critical: 'text-cyber-neonRed bg-cyber-neonRed/10 border-cyber-neonRed/30',
    High: 'text-cyber-neonAmber bg-cyber-neonAmber/10 border-cyber-neonAmber/30',
    Medium: 'text-cyber-neonCyan bg-cyber-neonCyan/10 border-cyber-neonCyan/30',
    Low: 'text-cyber-neonGreen bg-cyber-neonGreen/10 border-cyber-neonGreen/30',
    Informational: 'text-cyber-textMuted bg-cyber-panel border-cyber-border',
  }[selectedVuln.severity];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonCyan font-bold uppercase tracking-wider mb-2">
          <Bug className="w-4 h-4 text-cyber-neonGreen" />
          <span>VULNERABILITY INTELLIGENCE DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
          VULNERABILITY INTELLIGENCE
        </h1>
        <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
          Comprehensive technical directory detailing root causes, attack surfaces, safe execution vectors, defensive strategies, and side-by-side remediation code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vulnerabilities Directory List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-cyber-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter vulnerability entries..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-cyber-card border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonCyan"
            />
          </div>

          {/* Directory Item List */}
          <div className="rounded-2xl bg-cyber-card border border-cyber-border overflow-hidden divide-y divide-cyber-border/40 shadow-card-glow max-h-[720px] overflow-y-auto">
            {filteredVulns.map((vuln) => {
              const isSelected = vuln.id === selectedVuln.id;
              return (
                <div
                  key={vuln.id}
                  onClick={() => setSelectedVuln(vuln)}
                  className={`p-4 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyber-surface border-l-4 border-l-cyber-neonGreen text-cyber-textBright'
                      : 'hover:bg-cyber-surface/50 text-cyber-textDim'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                        {vuln.owaspId.split(':')[0]}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                        vuln.severity === 'Critical'
                          ? 'text-cyber-neonRed border-cyber-neonRed/30'
                          : vuln.severity === 'High'
                          ? 'text-cyber-neonAmber border-cyber-neonAmber/30'
                          : 'text-cyber-neonCyan border-cyber-neonCyan/30'
                      }`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <h4 className="text-xs font-mono font-bold text-cyber-textBright truncate">
                      {vuln.title}
                    </h4>
                    <p className="text-[11px] text-cyber-textMuted truncate mt-0.5">
                      {vuln.category} • CVSS {vuln.cvssScore}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-2 ${isSelected ? 'text-cyber-neonGreen' : 'text-cyber-border'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Vulnerability Technical Dossier (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-cyber-card border border-cyber-border overflow-hidden shadow-card-glow">
          {/* Dossier Header */}
          <div className="p-6 border-b border-cyber-border bg-cyber-surface/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2.5 py-0.5 rounded border uppercase font-bold text-[10px] ${severityBadgeColors}`}>
                  {selectedVuln.severity} (CVSS {selectedVuln.cvssScore})
                </span>
                <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan text-[10px]">
                  {selectedVuln.owaspId}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-textMuted text-[10px]">
                  {selectedVuln.cweId}
                </span>
              </div>

              <button
                onClick={() => onNavigate('reports', 'new')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-neonCyan/15 border border-cyber-neonCyan/50 text-cyber-neonCyan hover:bg-cyber-neonCyan/25 font-mono text-xs font-bold transition-all shadow-glow-cyan"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>File Report</span>
              </button>
            </div>

            <h2 className="text-2xl font-mono font-black text-cyber-textBright uppercase">
              {selectedVuln.title}
            </h2>
            <p className="mt-1 text-xs font-mono text-cyber-neonGreen font-semibold">
              Category: {selectedVuln.category}
            </p>
          </div>

          {/* Dossier Navigation Tabs */}
          <div className="flex items-center border-b border-cyber-border bg-cyber-panel px-6 overflow-x-auto text-xs font-mono scrollbar-none">
            {[
              { id: 'overview', label: 'OVERVIEW & CAUSE' },
              { id: 'analysis', label: 'ATTACK SURFACE & IMPACT' },
              { id: 'demo', label: 'SAFE DEMONSTRATION' },
              { id: 'remediation', label: 'SECURE CODE GUIDANCE' },
              { id: 'checklist', label: 'PREVENTION CHECKLIST' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-cyber-neonGreen text-cyber-neonGreen'
                    : 'border-transparent text-cyber-textMuted hover:text-cyber-textBright'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dossier Body */}
          <div className="p-6 space-y-6">
            {/* TAB 1: OVERVIEW & CAUSE */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonCyan mb-2">
                    Executive Overview
                  </h3>
                  <p className="text-xs text-cyber-textDim leading-relaxed">
                    {selectedVuln.overview}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonAmber mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Technical Root Cause
                  </h3>
                  <p className="text-xs text-cyber-textDim leading-relaxed font-mono">
                    {selectedVuln.rootCause}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonGreen mb-2">
                    Detection & Telemetry Concept
                  </h3>
                  <p className="text-xs text-cyber-textDim leading-relaxed">
                    {selectedVuln.detectionConcept}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ATTACK SURFACE & IMPACT */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonCyan mb-2">
                    Attack Surface Mapping
                  </h3>
                  <p className="text-xs text-cyber-textDim leading-relaxed">
                    {selectedVuln.attackSurface}
                  </p>
                </div>

                {/* CIA Triad Impact Box */}
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright mb-3">
                    Security Impact (CIA Triad Breakdown)
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-cyber-surface border border-cyber-border text-center">
                      <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Confidentiality</span>
                      <span className="text-xs font-mono font-bold text-cyber-neonRed mt-1 block">
                        {selectedVuln.securityImpact.confidentiality}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyber-surface border border-cyber-border text-center">
                      <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Integrity</span>
                      <span className="text-xs font-mono font-bold text-cyber-neonAmber mt-1 block">
                        {selectedVuln.securityImpact.integrity}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyber-surface border border-cyber-border text-center">
                      <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Availability</span>
                      <span className="text-xs font-mono font-bold text-cyber-neonCyan mt-1 block">
                        {selectedVuln.securityImpact.availability}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border text-xs text-cyber-textDim leading-relaxed font-mono">
                    {selectedVuln.securityImpact.summary}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SAFE DEMONSTRATION */}
            {activeTab === 'demo' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyber-neonGreen">
                    <Shield className="w-4 h-4" />
                    <span>Isolated Educational Scenario</span>
                  </div>
                  <p className="text-xs text-cyber-textDim leading-relaxed">
                    {selectedVuln.safeDemoExample.scenario}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textMuted block mb-1.5">
                    Safe Demonstration Payload Example:
                  </span>
                  <pre className="p-3.5 rounded-xl bg-[#05080e] border border-cyber-border font-mono text-xs text-cyber-neonCyan overflow-x-auto">
                    {selectedVuln.safeDemoExample.payloadExample}
                  </pre>
                </div>

                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textMuted block mb-1.5">
                    Observed Sandbox Behavior:
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#05080e] border border-cyber-border font-mono text-xs text-cyber-neonGreen">
                    {selectedVuln.safeDemoExample.observedBehavior}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('labs')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-neonGreen/15 border border-cyber-neonGreen text-cyber-neonGreen font-mono text-xs font-bold hover:bg-cyber-neonGreen/25 transition-all shadow-glow-green"
                  >
                    <span>Launch Interactive Lab for this Vulnerability</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: SECURE CODE GUIDANCE */}
            {activeTab === 'remediation' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonGreen block mb-1">
                    Defensive Strategy
                  </span>
                  <p className="text-xs text-cyber-textDim leading-relaxed">
                    {selectedVuln.defensiveStrategy}
                  </p>
                </div>

                {/* Side-by-Side Code Diff */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-cyber-neonRed/40 bg-[#05080e] overflow-hidden">
                    <div className="px-4 py-2 bg-cyber-neonRed/10 border-b border-cyber-neonRed/30 text-cyber-neonRed font-mono font-bold text-xs">
                      ❌ VULNERABLE CODE (INSECURE PATTERN)
                    </div>
                    <pre className="p-4 text-cyber-textDim text-[11px] font-mono overflow-x-auto whitespace-pre leading-relaxed">
                      {selectedVuln.codeGuidance.vulnerableSnippet}
                    </pre>
                  </div>

                  <div className="rounded-xl border border-cyber-neonGreen/40 bg-[#05080e] overflow-hidden shadow-glow-green">
                    <div className="px-4 py-2 bg-cyber-neonGreen/10 border-b border-cyber-neonGreen/30 text-cyber-neonGreen font-mono font-bold text-xs">
                      ✅ SECURE REMEDIATION (DEFENSIVE PATTERN)
                    </div>
                    <pre className="p-4 text-cyber-neonGreen text-[11px] font-mono overflow-x-auto whitespace-pre leading-relaxed">
                      {selectedVuln.codeGuidance.secureSnippet}
                    </pre>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs text-cyber-textDim font-mono">
                  💡 {selectedVuln.codeGuidance.explanation}
                </div>
              </div>
            )}

            {/* TAB 5: PREVENTION CHECKLIST & REFS */}
            {activeTab === 'checklist' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-neonGreen mb-3">
                    Defense-in-Depth Prevention Checklist
                  </h3>
                  <div className="space-y-2.5">
                    {selectedVuln.preventionChecklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-cyber-surface border border-cyber-border flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-cyber-neonGreen flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-cyber-textBright font-mono leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-cyber-border/60">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textMuted mb-2">
                    Industry References & Standards
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedVuln.references.map((ref, i) => (
                      <li key={i}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-neonCyan hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{ref.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
