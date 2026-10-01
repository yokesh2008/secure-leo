import React, { useState } from 'react';
import { Lab } from '../../types';
import { Check, ChevronRight, ShieldCheck, FileText, Code2, AlertTriangle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';

interface LearningWorkflowProps {
  lab: Lab;
  onOpenReportBuilder: () => void;
}

export const STAGES = [
  { id: 'discover', label: 'DISCOVER', desc: 'Identify input vectors & surface' },
  { id: 'analyze', label: 'ANALYZE', desc: 'Trace data flow into sinks' },
  { id: 'test', label: 'TEST', desc: 'Inject non-destructive payloads' },
  { id: 'observe', label: 'OBSERVE', desc: 'Examine HTTP & event telemetry' },
  { id: 'understand', label: 'UNDERSTAND', desc: 'Examine parser AST & root cause' },
  { id: 'remediate', label: 'REMEDIATE', desc: 'Review defensive code patterns' },
  { id: 'report', label: 'REPORT', desc: 'Submit responsible disclosure' },
] as const;

export const LearningWorkflow: React.FC<LearningWorkflowProps> = ({
  lab,
  onOpenReportBuilder,
}) => {
  const [currentStage, setCurrentStage] = useState<typeof STAGES[number]['id']>('discover');
  const [showRemediationModal, setShowRemediationModal] = useState(false);
  const { addXp } = useUser();
  const { showToast } = useNotification();

  const handleStageClick = (stageId: typeof STAGES[number]['id']) => {
    setCurrentStage(stageId);
    if (stageId === 'remediate') {
      setShowRemediationModal(true);
    } else if (stageId === 'report') {
      onOpenReportBuilder();
    }
  };

  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full bg-cyber-panel/90 border-t border-cyber-border py-3 px-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Workflow Title */}
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-neonCyan font-bold uppercase flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-cyber-neonGreen" />
          <span>SECURITY WORKFLOW:</span>
        </div>

        {/* Timeline Pipeline */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => handleStageClick(stage.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan shadow-glow-cyan'
                      : isCompleted
                      ? 'bg-cyber-neonGreen/10 border border-cyber-neonGreen/40 text-cyber-neonGreen'
                      : 'bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-cyber-neonGreen" />
                  ) : (
                    <span className="text-[10px] opacity-75">{idx + 1}.</span>
                  )}
                  <span>{stage.label}</span>
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-cyber-border flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowRemediationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen text-cyber-textDim hover:text-cyber-textBright font-mono text-xs transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-cyber-neonGreen" />
            <span>Remediation Diff</span>
          </button>
          <button
            onClick={onOpenReportBuilder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan hover:bg-cyber-neonCyan/30 font-mono text-xs font-bold transition-all shadow-glow-cyan"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Draft Report</span>
          </button>
        </div>
      </div>

      {/* Remediation Diff Modal */}
      {showRemediationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-bg/85 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-cyber-surface border border-cyber-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-cyber-panel border-b border-cyber-border">
              <div className="flex items-center gap-2 font-mono">
                <Code2 className="w-5 h-5 text-cyber-neonGreen" />
                <h3 className="text-sm font-bold text-cyber-textBright uppercase">
                  Secure Coding Guidance & Remediation: {lab.title}
                </h3>
              </div>
              <button
                onClick={() => setShowRemediationModal(false)}
                className="text-cyber-textMuted hover:text-cyber-textBright text-sm font-mono"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-[#05080e] font-mono text-xs">
              <div className="p-4 rounded-xl bg-cyber-panel border border-cyber-border text-cyber-textBright leading-relaxed">
                <span className="text-cyber-neonCyan font-bold uppercase block mb-1">
                  Architectural Explanation:
                </span>
                {lab.remediationCode.explanation}
              </div>

              {/* Side-by-Side Code Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vulnerable Code */}
                <div className="flex flex-col rounded-xl border border-cyber-neonRed/40 bg-cyber-surface/60 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-cyber-neonRed/10 border-b border-cyber-neonRed/30 text-cyber-neonRed font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      VULNERABLE IMPLEMENTATION
                    </span>
                    <span className="text-[10px]">DO NOT USE</span>
                  </div>
                  <pre className="p-4 text-cyber-textDim overflow-x-auto whitespace-pre leading-relaxed text-[11px] font-mono flex-1">
                    {lab.remediationCode.vulnerable}
                  </pre>
                </div>

                {/* Secure Code */}
                <div className="flex flex-col rounded-xl border border-cyber-neonGreen/40 bg-cyber-surface/60 overflow-hidden shadow-glow-green">
                  <div className="flex items-center justify-between px-4 py-2 bg-cyber-neonGreen/10 border-b border-cyber-neonGreen/30 text-cyber-neonGreen font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SECURE HARDENED CODE
                    </span>
                    <span className="text-[10px]">VERIFIED</span>
                  </div>
                  <pre className="p-4 text-cyber-neonGreen overflow-x-auto whitespace-pre leading-relaxed text-[11px] font-mono flex-1">
                    {lab.remediationCode.secure}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 bg-cyber-panel border-t border-cyber-border font-mono text-xs">
              <span className="text-cyber-textMuted">
                Review verified by SECURE LEO Defensive Architecture Team
              </span>
              <button
                onClick={() => {
                  setShowRemediationModal(false);
                  onOpenReportBuilder();
                }}
                className="px-4 py-1.5 rounded-xl bg-cyber-neonGreen/20 border border-cyber-neonGreen text-cyber-neonGreen font-bold hover:bg-cyber-neonGreen/30 transition-all shadow-glow-green"
              >
                Proceed to Bug Bounty Report →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
