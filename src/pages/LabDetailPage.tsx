import React, { useState } from 'react';
import { LABS_DATA } from '../data/labsData';
import { LabControlPanel } from '../components/lab/LabControlPanel';
import { DemoAppFrame } from '../components/lab/DemoAppFrame';
import { SecurityInspector } from '../components/lab/SecurityInspector';
import { LearningWorkflow } from '../components/lab/LearningWorkflow';
import { HttpInspectionLog, LabTask } from '../types';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { useSecurityEvents } from '../context/SecurityEventContext';
import { ArrowLeft, Maximize2, Minimize2, Terminal, Shield, RefreshCw } from 'lucide-react';

interface LabDetailPageProps {
  labSlug: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenTerminal: () => void;
}

export const LabDetailPage: React.FC<LabDetailPageProps> = ({
  labSlug,
  onNavigate,
  onOpenTerminal,
}) => {
  const lab = LABS_DATA.find(l => l.slug === labSlug) || LABS_DATA[0];
  const { markLabCompleted, addXp } = useUser();
  const { showToast } = useNotification();
  const { logEvent } = useSecurityEvents();

  const [tasks, setTasks] = useState<LabTask[]>(lab.tasks);
  const [latestLog, setLatestLog] = useState<HttpInspectionLog | null>(null);
  const [logsHistory, setLogsHistory] = useState<HttpInspectionLog[]>([]);

  // Task toggle
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const newlyCompleted = updated.find(t => t.id === taskId)?.completed;
      if (newlyCompleted) {
        addXp(25, 'Checkpoint Completed');
        showToast('success', 'Checkpoint Reached', '+25 XP awarded.');
      }
      return updated;
    });
  };

  // Reset lab
  const handleResetLab = () => {
    setTasks(lab.tasks.map(t => ({ ...t, completed: false })));
    setLatestLog(null);
    setLogsHistory([]);
    logEvent('LAB_STARTED', lab.slug, 'User initiated lab session reset.', 'info');
    showToast('info', 'Lab Reset', 'Sandbox environment restored to baseline state.');
  };

  // Handle HTTP traffic emitted from center Demo App
  const handleLogHttpRequest = (log: HttpInspectionLog) => {
    setLatestLog(log);
    setLogsHistory(prev => [log, ...prev.slice(0, 40)]);
  };

  // Automated Task check when certain actions happen in demo
  const handleTaskAction = (actionType: string) => {
    if (actionType === 'sql-bypass') {
      setTasks(prev => prev.map(t => (t.id === 'task-sql-3' ? { ...t, completed: true } : t)));
      markLabCompleted(lab.slug, lab.points);
    } else if (actionType === 'xss-executed') {
      setTasks(prev => prev.map(t => (t.id === 'task-xss-3' || t.id === 'task-xss-4' ? { ...t, completed: true } : t)));
      markLabCompleted(lab.slug, lab.points);
    } else if (actionType === 'idor-accessed') {
      setTasks(prev => prev.map(t => (t.id === 'task-idor-3' || t.id === 'task-idor-4' ? { ...t, completed: true } : t)));
      markLabCompleted(lab.slug, lab.points);
    } else if (actionType === 'file-upload-bypass') {
      setTasks(prev => prev.map(t => (t.id === 'task-upload-3' ? { ...t, completed: true } : t)));
      markLabCompleted(lab.slug, lab.points);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-cyber-bg">
      {/* Lab Sub-Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-panel border-b border-cyber-border text-xs font-mono select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('labs')}
            className="flex items-center gap-1 text-cyber-textMuted hover:text-cyber-neonCyan transition-colors font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL LABS</span>
          </button>
          <span className="text-cyber-border">/</span>
          <span className="text-cyber-textBright font-bold truncate">
            {lab.title}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-neonGreen font-semibold">
            {lab.targetEndpoint}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-neonGreen text-cyber-textDim hover:text-cyber-neonGreen transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-neonGreen" />
            <span className="hidden sm:inline">LEO TERMINAL</span>
          </button>
          <button
            onClick={handleResetLab}
            className="p-1 rounded text-cyber-textMuted hover:text-cyber-textBright"
            title="Reset Lab Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Interactive Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column (Lab Control Panel) - 3 Cols */}
        <div className="lg:col-span-3 h-full overflow-hidden">
          <LabControlPanel
            lab={lab}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onResetLab={handleResetLab}
            onAdvanceWorkflow={() => {
              // Open remediation in workflow
              onNavigate('reports', 'new');
            }}
          />
        </div>

        {/* Center Column (Demo Application - "LEO SHOP") - 5 Cols */}
        <div className="lg:col-span-5 h-full overflow-hidden border-r border-cyber-border">
          <DemoAppFrame
            lab={lab}
            onLogHttpRequest={handleLogHttpRequest}
            onTaskAction={handleTaskAction}
          />
        </div>

        {/* Right Column (Security Observation Console) - 4 Cols */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <SecurityInspector
            latestLog={latestLog}
            logsHistory={logsHistory}
          />
        </div>
      </div>

      {/* Bottom Learning Workflow Timeline Strip */}
      <LearningWorkflow
        lab={lab}
        onOpenReportBuilder={() => {
          onNavigate('reports', 'new');
        }}
      />
    </div>
  );
};
