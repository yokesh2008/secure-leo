import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { SecurityReport, SeverityLevel } from '../types';
import { FileText, Send, Eye, Download, Save, CheckCircle2, Clock, Shield, AlertTriangle, Plus, ChevronRight } from 'lucide-react';

interface ReportsPageProps {
  initialMode?: 'list' | 'new';
  onNavigate: (page: string, param?: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ initialMode = 'list', onNavigate }) => {
  const { reports, submitReport, user } = useUser();
  const { showToast } = useNotification();

  const [mode, setMode] = useState<'list' | 'editor' | 'preview'>(initialMode === 'new' ? 'editor' : 'list');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Injection');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [affectedComponent, setAffectedComponent] = useState('shop.secureleo.local /api/v1/');
  const [description, setDescription] = useState('');
  const [securityImpact, setSecurityImpact] = useState('');
  const [reproductionSummary, setReproductionSummary] = useState('');
  const [evidence, setEvidence] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [remediation, setRemediation] = useState('');
  const [references, setReferences] = useState('OWASP Top 10 A03:2021 | CWE-89');

  const [activeReportForDetail, setActiveReportForDetail] = useState<SecurityReport | null>(null);

  const categories = [
    'Injection',
    'Client-Side Security',
    'Access Control',
    'Authentication',
    'Web Security',
    'Input Validation',
    'API Security',
    'Security Misconfiguration',
  ];

  const severities: SeverityLevel[] = ['Informational', 'Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('error', 'Incomplete Submission', 'Please provide a title and vulnerability description.');
      return;
    }

    const created = submitReport({
      title,
      category,
      severity,
      affectedComponent,
      description,
      securityImpact,
      reproductionSummary,
      evidence,
      rootCause,
      remediation,
      references,
    });

    showToast('success', 'Report Submitted!', `Vulnerability report ${created.id} queued for triage.`);
    setMode('list');
    setActiveReportForDetail(created);
  };

  const handleExportJSON = (report: SecurityReport) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.id}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('info', 'Report Exported', `${report.id}.json downloaded.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-neonCyan font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4 text-cyber-neonGreen" />
            <span>SECURITY VULNERABILITY REPORTING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-black text-cyber-textBright uppercase">
            SECURITY REPORT BUILDER
          </h1>
          <p className="mt-2 text-sm text-cyber-textDim max-w-2xl leading-relaxed">
            Standardized responsible disclosure templates. Draft findings with reproduction evidence and track simulated triage workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'list' ? (
            <button
              onClick={() => setMode('editor')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Report</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('list')}
              className="px-4 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs font-semibold hover:border-cyber-textDim transition-colors"
            >
              ← Back to Reports Archive
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: REPORTS ARCHIVE LIST */}
      {mode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reports Table / List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-cyber-textMuted px-1">
              <span>{reports.length} RESEARCH REPORTS LOGGED</span>
              <span>FILTER: ALL SUBMISSIONS</span>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => {
                const isSelected = activeReportForDetail?.id === rep.id;
                const statusColor = {
                  Draft: 'bg-cyber-panel text-cyber-textMuted border-cyber-border',
                  Submitted: 'bg-cyber-neonCyan/15 text-cyber-neonCyan border-cyber-neonCyan/40',
                  'Under Review': 'bg-cyber-neonAmber/15 text-cyber-neonAmber border-cyber-neonAmber/40',
                  Resolved: 'bg-cyber-neonGreen/15 text-cyber-neonGreen border-cyber-neonGreen/40',
                }[rep.status];

                const severityBadge = {
                  Critical: 'text-cyber-neonRed border-cyber-neonRed/30 bg-cyber-neonRed/10',
                  High: 'text-cyber-neonAmber border-cyber-neonAmber/30 bg-cyber-neonAmber/10',
                  Medium: 'text-cyber-neonCyan border-cyber-neonCyan/30 bg-cyber-neonCyan/10',
                  Low: 'text-cyber-neonGreen border-cyber-neonGreen/30 bg-cyber-neonGreen/10',
                  Informational: 'text-cyber-textMuted border-cyber-border bg-cyber-panel',
                }[rep.severity];

                return (
                  <div
                    key={rep.id}
                    onClick={() => setActiveReportForDetail(rep)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-cyber-card border-cyber-neonGreen shadow-glow-green'
                        : 'bg-cyber-card/70 border-cyber-border hover:border-cyber-borderGlow'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyber-neonCyan">
                          {rep.id}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${severityBadge}`}>
                          {rep.severity}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${statusColor}`}>
                        {rep.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-mono font-bold text-cyber-textBright leading-snug">
                      {rep.title}
                    </h3>

                    <p className="mt-1 text-xs text-cyber-textDim truncate">
                      Component: {rep.affectedComponent}
                    </p>

                    <div className="mt-3 pt-3 border-t border-cyber-border/60 flex items-center justify-between text-[11px] font-mono text-cyber-textMuted">
                      <span>Reporter: {rep.reporter}</span>
                      <span>+{rep.awardedXp || 120} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Detailed View Pane (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-cyber-card border border-cyber-border p-6 shadow-card-glow sticky top-20">
            {activeReportForDetail ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <div>
                    <span className="text-xs font-mono text-cyber-neonCyan font-bold">
                      {activeReportForDetail.id}
                    </span>
                    <h3 className="text-base font-mono font-bold text-cyber-textBright mt-1">
                      {activeReportForDetail.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleExportJSON(activeReportForDetail)}
                    className="p-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan text-cyber-neonCyan"
                    title="Download Report JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border">
                    <span className="text-[10px] text-cyber-textMuted uppercase block">Severity</span>
                    <span className="text-cyber-textBright font-bold mt-0.5 block">{activeReportForDetail.severity}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyber-surface border border-cyber-border">
                    <span className="text-[10px] text-cyber-textMuted uppercase block">Status</span>
                    <span className="text-cyber-neonGreen font-bold mt-0.5 block">{activeReportForDetail.status}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-cyber-textMuted block mb-1">
                    Vulnerability Description:
                  </span>
                  <p className="text-xs text-cyber-textDim leading-relaxed font-mono bg-cyber-surface p-3 rounded-xl border border-cyber-border">
                    {activeReportForDetail.description}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-cyber-textMuted block mb-1">
                    Security Impact:
                  </span>
                  <p className="text-xs text-cyber-textDim leading-relaxed font-mono bg-cyber-surface p-3 rounded-xl border border-cyber-border">
                    {activeReportForDetail.securityImpact}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-cyber-textMuted block mb-1">
                    Reproduction Steps & Evidence:
                  </span>
                  <pre className="text-[11px] text-cyber-neonCyan font-mono bg-[#05080e] p-3 rounded-xl border border-cyber-border overflow-x-auto whitespace-pre-wrap">
                    {activeReportForDetail.evidence || activeReportForDetail.reproductionSummary}
                  </pre>
                </div>

                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-cyber-textMuted block mb-1">
                    Remediation:
                  </span>
                  <p className="text-xs text-cyber-neonGreen font-mono bg-cyber-surface p-3 rounded-xl border border-cyber-border leading-relaxed">
                    {activeReportForDetail.remediation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center font-mono text-xs text-cyber-textMuted">
                Select a report from the list to inspect reproduction details and triage history.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: REPORT BUILDER EDITOR */}
      {mode === 'editor' && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-cyber-card border border-cyber-border p-6 sm:p-8 shadow-card-glow space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border pb-4">
            <h2 className="text-base font-mono font-bold text-cyber-textBright uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyber-neonCyan" />
              Standardized Vulnerability Advisory Editor
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('preview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs hover:border-cyber-textDim"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Title */}
            <div className="md:col-span-8">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Report Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unauthenticated Remote Code Execution in Avatar Upload"
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
                required
              />
            </div>

            {/* Severity */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Severity:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              >
                {severities.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright focus:outline-none focus:border-cyber-neonGreen"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Affected Component */}
            <div className="md:col-span-12">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Affected Demo Component / Endpoint:
              </label>
              <input
                type="text"
                value={affectedComponent}
                onChange={(e) => setAffectedComponent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
                placeholder="e.g. shop.secureleo.local /api/v1/auth/login"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Vulnerability Description & Root Cause:
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the security weakness, why it occurs in the application architecture, and which component is vulnerable."
                className="w-full p-3.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
                required
              />
            </div>

            {/* Security Impact */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Security Impact (Confidentiality / Integrity / Availability):
              </label>
              <textarea
                rows={4}
                value={securityImpact}
                onChange={(e) => setSecurityImpact(e.target.value)}
                placeholder="Detail what an adversary could achieve if exploited (e.g. full database exfiltration, admin account takeover)."
                className="w-full p-3.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            {/* Reproduction Steps */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Steps to Reproduce:
              </label>
              <textarea
                rows={4}
                value={reproductionSummary}
                onChange={(e) => setReproductionSummary(e.target.value)}
                placeholder="1. Navigate to endpoint... 2. Submit payload... 3. Observe response..."
                className="w-full p-3.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            {/* Evidence & HTTP Raw Logs */}
            <div className="md:col-span-6">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Raw HTTP Request / Response Evidence:
              </label>
              <textarea
                rows={4}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="POST /api/v1/auth/login HTTP/1.1&#10;Host: shop.secureleo.local&#10;Payload: admin' --"
                className="w-full p-3.5 rounded-xl bg-[#05080e] border border-cyber-border text-xs font-mono text-cyber-neonCyan placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>

            {/* Remediation Guidance */}
            <div className="md:col-span-12">
              <label className="block text-xs font-mono font-semibold text-cyber-textDim mb-1.5">
                Recommended Remediation & Defensive Code:
              </label>
              <textarea
                rows={3}
                value={remediation}
                onChange={(e) => setRemediation(e.target.value)}
                placeholder="Specify parameterized query implementation, input validation schema, or secure framework APIs..."
                className="w-full p-3.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright placeholder-cyber-textMuted focus:outline-none focus:border-cyber-neonGreen"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-cyber-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => showToast('info', 'Draft Saved', 'Report draft saved locally.')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-textDim text-cyber-textDim hover:text-cyber-textBright font-mono text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-black text-xs uppercase tracking-wider hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
            >
              <Send className="w-4 h-4 text-cyber-bg" />
              <span>Submit Report (+120 XP)</span>
            </button>
          </div>
        </form>
      )}

      {/* MODE 3: PREVIEW */}
      {mode === 'preview' && (
        <div className="rounded-2xl bg-cyber-card border border-cyber-border p-8 shadow-card-glow space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border pb-4">
            <span className="text-xs font-mono text-cyber-neonAmber font-bold uppercase">
              PREVIEW: FORMAL VULNERABILITY ADVISORY
            </span>
            <button
              onClick={() => setMode('editor')}
              className="px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border text-xs font-mono text-cyber-textBright"
            >
              Back to Editor
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-mono font-black text-cyber-textBright">
              {title || 'Untitled Security Report'}
            </h2>
            <div className="flex gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-cyber-neonAmber/20 text-cyber-neonAmber border border-cyber-neonAmber">
                Severity: {severity}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
                Category: {category}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-textMuted">
                Target: {affectedComponent}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border font-mono text-xs leading-relaxed text-cyber-textBright">
              <span className="text-cyber-neonCyan font-bold block mb-1">Description:</span>
              {description || 'No description provided.'}
            </div>

            <div className="p-4 rounded-xl bg-[#05080e] border border-cyber-border font-mono text-xs leading-relaxed text-cyber-neonGreen">
              <span className="text-cyber-textMuted block mb-1">Evidence & PoC:</span>
              <pre className="whitespace-pre-wrap">{evidence || 'No evidence provided.'}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
