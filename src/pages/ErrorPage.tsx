import React from 'react';
import { ShieldAlert, ArrowLeft, RefreshCw, Terminal, Home } from 'lucide-react';

interface ErrorPageProps {
  code?: '404' | '403' | '401' | '500';
  message?: string;
  onNavigate: (page: string) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = '404',
  message,
  onNavigate,
}) => {
  const errorDetails = {
    '404': {
      title: 'ERROR 404: TARGET RESOURCE NOT FOUND',
      desc: message || 'The requested endpoint, sandbox node, or advisory report does not exist in the SECURE LEO topology.',
      suggestedAction: 'Verify URL parameters or return to platform overview.',
    },
    '403': {
      title: 'ERROR 403: ACCESS FORBIDDEN / PRIVILEGE VIOLATION',
      desc: message || 'Your current researcher session token lacks administrative authorization to inspect this isolated boundary.',
      suggestedAction: 'Elevate researcher progression level or return to authorized labs.',
    },
    '401': {
      title: 'ERROR 401: UNAUTHENTICATED RESEARCHER SESSION',
      desc: message || 'Missing or expired Bearer token in request header.',
      suggestedAction: 'Re-authenticate session in the security console.',
    },
    '500': {
      title: 'ERROR 500: SIMULATED BACKEND ANOMALY',
      desc: message || 'An unhandled exception occurred in the sandbox execution AST parser.',
      suggestedAction: 'Reset lab state in the lab control console.',
    },
  }[code];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full p-8 rounded-3xl bg-cyber-card border border-cyber-border shadow-card-glow text-center space-y-6">
        <div className="inline-flex p-4 rounded-3xl bg-cyber-neonRed/10 border border-cyber-neonRed/30 text-cyber-neonRed">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyber-neonRed">
            SECURITY EXCEPTION DIAGNOSTIC
          </span>
          <h1 className="text-2xl sm:text-3xl font-mono font-black text-cyber-textBright uppercase mt-1">
            {errorDetails.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-cyber-textDim leading-relaxed">
            {errorDetails.desc}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#05080e] border border-cyber-border font-mono text-xs text-cyber-neonCyan text-left space-y-1">
          <div>TELEMETRY: STATUS_{code}_EXCEPTION</div>
          <div>TIMESTAMP: {new Date().toISOString()}</div>
          <div>BOUNDARY: ISOLATED_SANDBOX_V2.4</div>
          <div className="text-cyber-textMuted pt-1">ACTION: {errorDetails.suggestedAction}</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-textDim text-cyber-textBright font-mono text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Landing</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-neonGreen text-cyber-bg font-mono font-bold text-xs uppercase hover:bg-cyber-neonGreen/90 transition-all shadow-glow-green"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Researcher Console</span>
          </button>
        </div>
      </div>
    </div>
  );
};
