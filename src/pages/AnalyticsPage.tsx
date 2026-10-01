import React, { useState } from 'react';
import { useSecurityEvents } from '../../src/context/SecurityEventContext';
import { useUser } from '../../src/context/UserContext';
import { Activity, Shield, PieChart, BarChart3, AlertTriangle, CheckCircle2, Search, Filter, RefreshCw, Terminal } from 'lucide-react';

interface AnalyticsPageProps {
  onOpenTerminal: () => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onOpenTerminal }) => {
  const { events, clearEvents } = useSecurityEvents();
  const { user, reports, completedLabs } = useUser();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [eventSearch, setEventSearch] = useState('');

  const filteredEvents = events.filter((e) => {
    const matchesSev = selectedSeverity === 'all' || e.severity === selectedSeverity;
    const matchesSearch =
      e.message.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.component.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.type.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const categoryCounts = [
    { label: 'Injection', count: 4, color: 'bg-cyber-neonRed' },
    { label: 'Client-Side', count: 3, color: 'bg-cyber-neonCyan' },
    { label: 'Access Control', count: 3, color: 'bg-cyber-neonAmber' },
    { label: 'Authentication', count: 2, color: 'bg-cyber-neonGreen' },
    { label: 'Input Validation', count: 3, color: 'bg-cyber-neonPurple' },
    { label: 'API Security', count: 3, color: 'bg-blue-400' },
  ];

  const severityDistribution = [
    { label: 'Critical', count: 3, pct: '17%', color: 'text-cyber-neonRed', bg: 'bg-cyber-neonRed' },
    { label: 'High', count: 7, pct: '39%', color: 'text-cyber-neonAmber', bg: 'bg-cyber-neonAmber' },
    { label: 'Medium', count: 5, pct: '28%', color: 'text-cyber-neonCyan', bg: 'bg-cyber-neonCyan' },
    { label: 'Low', count: 3, pct: '16%', color: 'text-cyber-neonGreen', bg: 'bg-cyber-neonGreen' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonCyan font-bold uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4 text-cyber-neonGreen" />
            <span>SOC TELEMETRY & VULNERABILITY METRICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
            SECURITY ANALYTICS & EVENT CENTER
          </h1>
          <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
            Real-time simulated Security Operations Center (SOC) telemetry, attack surface metrics, and vulnerability distribution trends.
          </p>
        </div>

        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen text-cyber-textDim hover:text-cyber-neonGreen font-mono text-xs transition-colors self-start sm:self-auto"
        >
          <Terminal className="w-4 h-4 text-cyber-neonGreen" />
          <span>Launch Leo Terminal</span>
        </button>
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Vulnerability Category Breakdown */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border shadow-card-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright">
                Vulnerability Categories
              </h3>
              <PieChart className="w-4 h-4 text-cyber-neonCyan" />
            </div>

            <div className="space-y-3">
              {categoryCounts.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-cyber-textDim">{cat.label}</span>
                    <span className="text-cyber-textBright font-bold">{cat.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-cyber-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${(cat.count / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cyber-border/60 text-[10px] font-mono text-cyber-textMuted">
            Total 18 Cataloged Vulnerabilities
          </div>
        </div>

        {/* Card 2: Severity Distribution */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border shadow-card-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright">
                Severity Distribution
              </h3>
              <AlertTriangle className="w-4 h-4 text-cyber-neonAmber" />
            </div>

            <div className="space-y-4 pt-2">
              {severityDistribution.map((sev) => (
                <div key={sev.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${sev.bg}`} />
                    <span className="text-xs font-mono text-cyber-textBright font-semibold">{sev.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-cyber-textMuted">{sev.count} flaws</span>
                    <span className={`font-bold ${sev.color}`}>{sev.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cyber-border/60 text-[10px] font-mono text-cyber-textMuted">
            CVSS Severity Weighted Matrix
          </div>
        </div>

        {/* Card 3: Research & Report Status */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border shadow-card-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-textBright">
                Report Triage Funnel
              </h3>
              <BarChart3 className="w-4 h-4 text-cyber-neonGreen" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border">
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Submitted</span>
                <span className="text-2xl font-mono font-black text-cyber-neonCyan mt-1 block">
                  {reports.filter(r => r.status === 'Submitted').length}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border">
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">In Review</span>
                <span className="text-2xl font-mono font-black text-cyber-neonAmber mt-1 block">
                  {reports.filter(r => r.status === 'Under Review').length}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border">
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Resolved</span>
                <span className="text-2xl font-mono font-black text-cyber-neonGreen mt-1 block">
                  {reports.filter(r => r.status === 'Resolved').length}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border">
                <span className="text-[10px] font-mono text-cyber-textMuted uppercase block">Drafts</span>
                <span className="text-2xl font-mono font-black text-cyber-textMuted mt-1 block">
                  {reports.filter(r => r.status === 'Draft').length}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-cyber-border/60 text-[10px] font-mono text-cyber-textMuted">
            {reports.length} Total Reports Handled
          </div>
        </div>
      </div>

      {/* REAL-TIME SECURITY EVENT CENTER */}
      <div className="rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border/60 pb-4">
          <div>
            <h3 className="text-base font-mono font-bold uppercase text-cyber-textBright flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonGreen animate-ping" />
              LIVE SIMULATED SECURITY EVENT STREAM
            </h3>
            <p className="text-xs text-cyber-textDim mt-0.5">
              Telemetry feed updated dynamically as actions and payloads occur in the security sandbox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearEvents}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright font-mono text-xs transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Log</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyber-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              placeholder="Search telemetry events..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonCyan"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'critical', 'high', 'info'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeverity(s)}
                className={`px-3 py-1 rounded-xl text-xs font-mono uppercase font-bold transition-all ${
                  selectedSeverity === s
                    ? 'bg-cyber-panel border border-cyber-neonCyan text-cyber-neonCyan shadow-sm'
                    : 'bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Event Log Stream */}
        <div className="divide-y divide-cyber-border/40 font-mono text-xs max-h-96 overflow-y-auto rounded-xl bg-[#05080e] p-3 border border-cyber-border">
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-cyber-textMuted">
              No matching security events logged.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const sevColor = {
                critical: 'text-cyber-neonRed bg-cyber-neonRed/10 border-cyber-neonRed/30',
                high: 'text-cyber-neonAmber bg-cyber-neonAmber/10 border-cyber-neonAmber/30',
                medium: 'text-cyber-neonCyan bg-cyber-neonCyan/10 border-cyber-neonCyan/30',
                low: 'text-cyber-neonGreen bg-cyber-neonGreen/10 border-cyber-neonGreen/30',
                info: 'text-cyber-textMuted bg-cyber-panel border-cyber-border',
              }[evt.severity];

              return (
                <div key={evt.id} className="py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-cyber-surface/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-cyber-textMuted text-[11px]">{evt.timestamp}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${sevColor}`}>
                      {evt.severity}
                    </span>
                    <span className="text-cyber-neonGreen font-bold">{evt.type}</span>
                    <span className="text-cyber-textBright">{evt.message}</span>
                  </div>
                  <span className="text-[10px] text-cyber-textMuted self-end sm:self-auto">
                    {evt.component}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
