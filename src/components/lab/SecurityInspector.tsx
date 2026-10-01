import React, { useState } from 'react';
import { HttpInspectionLog, SecurityEvent } from '../../types';
import { Terminal, Send, ArrowDownLeft, Shield, Sliders, AlertCircle, History, Copy, Check } from 'lucide-react';
import { useSecurityEvents } from '../../context/SecurityEventContext';
import { useNotification } from '../../context/NotificationContext';

interface SecurityInspectorProps {
  latestLog: HttpInspectionLog | null;
  logsHistory: HttpInspectionLog[];
}

export const SecurityInspector: React.FC<SecurityInspectorProps> = ({
  latestLog,
  logsHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'headers' | 'parameters' | 'events' | 'activity'>('request');
  const [copied, setCopied] = useState(false);
  const { events } = useSecurityEvents();
  const { showToast } = useNotification();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('info', 'Copied to Clipboard', 'Telemetry data copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Default fallback if no logs yet
  const log = latestLog || {
    id: 'initial-state',
    timestamp: new Date().toTimeString().split(' ')[0],
    method: 'GET' as const,
    url: 'https://shop.secureleo.local/auth',
    headers: {
      'Host': 'shop.secureleo.local',
      'User-Agent': 'SecureLeo-Agent/2.4',
      'Accept': 'application/json',
    },
    parameters: {
      'mode': 'initial_state',
    },
    responseStatus: 200,
    responseStatusText: 'OK',
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-Simulated-Node': 'LEO-SANDBOX-01',
    },
    responseBody: JSON.stringify({ message: 'Lab environment initialized. Ready for payload execution.' }, null, 2),
    securityObservations: [
      '[INFO] Isolated sandbox ready. Perform actions in the center demo panel to inspect HTTP traffic.',
    ],
  };

  return (
    <div className="flex flex-col h-full bg-cyber-card border-l border-cyber-border overflow-hidden">
      {/* Console Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-panel border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-neonCyan" />
          <span className="text-xs font-mono font-bold text-cyber-textBright uppercase tracking-wider">
            SECURITY OBSERVATION CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-neonGreen">
            ● LIVE SNIFFER
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-cyber-border bg-cyber-surface overflow-x-auto text-xs font-mono scrollbar-none">
        {[
          { key: 'request', label: 'REQUEST', icon: Send },
          { key: 'response', label: 'RESPONSE', icon: ArrowDownLeft },
          { key: 'headers', label: 'HEADERS', icon: Shield },
          { key: 'parameters', label: 'PARAMETERS', icon: Sliders },
          { key: 'events', label: 'SECURITY EVENTS', icon: AlertCircle, count: events.length },
          { key: 'activity', label: 'ACTIVITY', icon: History, count: logsHistory.length },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-cyber-neonCyan text-cyber-neonCyan bg-cyber-panel font-bold'
                  : 'border-transparent text-cyber-textMuted hover:text-cyber-textBright'
              }`}
            >
              <IconComp className="w-3 h-3" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[9px] px-1 py-0.2 rounded ${isActive ? 'bg-cyber-neonCyan/20 text-cyber-neonCyan' : 'bg-cyber-bg text-cyber-textMuted'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-cyber-textBright bg-[#05080e]">
        {/* TAB 1: REQUEST */}
        {activeTab === 'request' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border/60">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan font-bold text-[10px]">
                  {log.method}
                </span>
                <span className="text-cyber-textBright break-all">
                  {log.url}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(`${log.method} ${log.url}\n${JSON.stringify(log.headers, null, 2)}`)}
                className="p-1 rounded text-cyber-textMuted hover:text-cyber-textBright"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-cyber-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div>
              <span className="text-[10px] text-cyber-textMuted uppercase font-bold block mb-1">
                Headers:
              </span>
              <div className="p-3 rounded-xl bg-cyber-surface border border-cyber-border space-y-1">
                {Object.entries(log.headers).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-cyber-neonCyan">{k}:</span>
                    <span className="text-cyber-textDim break-all">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(log.parameters).length > 0 && (
              <div>
                <span className="text-[10px] text-cyber-textMuted uppercase font-bold block mb-1">
                  Parameters / Payload:
                </span>
                <pre className="p-3 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-neonGreen overflow-x-auto">
                  {JSON.stringify(log.parameters, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESPONSE */}
        {activeTab === 'response' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cyber-border/60">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    log.responseStatus >= 200 && log.responseStatus < 300
                      ? 'bg-cyber-neonGreen/20 border border-cyber-neonGreen text-cyber-neonGreen'
                      : log.responseStatus >= 400
                      ? 'bg-cyber-neonRed/20 border border-cyber-neonRed text-cyber-neonRed'
                      : 'bg-cyber-neonAmber/20 border border-cyber-neonAmber text-cyber-neonAmber'
                  }`}
                >
                  HTTP {log.responseStatus} {log.responseStatusText}
                </span>
                <span className="text-cyber-textMuted text-[10px]">
                  Time: {log.timestamp}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(log.responseBody)}
                className="p-1 rounded text-cyber-textMuted hover:text-cyber-textBright"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-cyber-neonGreen" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div>
              <span className="text-[10px] text-cyber-textMuted uppercase font-bold block mb-1">
                Response Body:
              </span>
              <pre className="p-3 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright overflow-x-auto max-h-72">
                {log.responseBody}
              </pre>
            </div>

            <div>
              <span className="text-[10px] text-cyber-textMuted uppercase font-bold block mb-1">
                Security Observations:
              </span>
              <div className="p-3 rounded-xl bg-cyber-panel border border-cyber-border space-y-1.5">
                {log.securityObservations.map((obs, i) => (
                  <p
                    key={i}
                    className={`text-[11px] leading-relaxed ${
                      obs.includes('[CRITICAL]')
                        ? 'text-cyber-neonRed font-semibold'
                        : obs.includes('[HIGH]')
                        ? 'text-cyber-neonAmber font-semibold'
                        : obs.includes('[WARN]')
                        ? 'text-cyber-neonCyan'
                        : 'text-cyber-textDim'
                    }`}
                  >
                    {obs}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEADERS AUDIT */}
        {activeTab === 'headers' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyber-textBright uppercase">
              Response Security Headers Audit
            </h4>
            <div className="divide-y divide-cyber-border/40 rounded-xl bg-cyber-surface border border-cyber-border overflow-hidden">
              {[
                { name: 'Content-Security-Policy', status: 'MISSING', risk: 'HIGH', desc: 'Allows inline scripts and unauthorized external script domains.' },
                { name: 'Strict-Transport-Security (HSTS)', status: 'PRESENT', risk: 'LOW', desc: 'Enforces HTTPS TLS encryption.' },
                { name: 'X-Frame-Options', status: 'MISSING', risk: 'MEDIUM', desc: 'Allows site to be rendered in iframes, vulnerable to Clickjacking.' },
                { name: 'X-Content-Type-Options', status: 'nosniff', risk: 'GOOD', desc: 'Prevents MIME sniffing attacks.' },
                { name: 'Set-Cookie (SameSite)', status: 'MISSING', risk: 'HIGH', desc: 'Cookies sent cross-origin, vulnerable to CSRF attacks.' },
                { name: 'Set-Cookie (HttpOnly)', status: 'FALSE', risk: 'HIGH', desc: 'Session cookie accessible to client JavaScript document.cookie.' },
              ].map((h) => (
                <div key={h.name} className="p-3 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-cyber-textBright">{h.name}</span>
                    <p className="text-[10px] text-cyber-textMuted mt-0.5">{h.desc}</p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      h.risk === 'HIGH'
                        ? 'bg-cyber-neonRed/20 text-cyber-neonRed border border-cyber-neonRed/40'
                        : h.risk === 'MEDIUM'
                        ? 'bg-cyber-neonAmber/20 text-cyber-neonAmber border border-cyber-neonAmber/40'
                        : 'bg-cyber-neonGreen/20 text-cyber-neonGreen border border-cyber-neonGreen/40'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PARAMETERS */}
        {activeTab === 'parameters' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyber-textBright uppercase">
              Extracted Request Parameters & Entities
            </h4>
            <div className="rounded-xl bg-cyber-surface border border-cyber-border p-3 space-y-3">
              {Object.entries(log.parameters).length === 0 ? (
                <p className="text-cyber-textMuted text-xs">No parameters attached to current request.</p>
              ) : (
                Object.entries(log.parameters).map(([key, val]) => (
                  <div key={key} className="border-b border-cyber-border/40 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] text-cyber-textMuted uppercase block">Param: {key}</span>
                    <span className="text-cyber-neonCyan text-xs break-all font-semibold">{String(val)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyber-textBright uppercase">
                Simulated SOC Detection Telemetry
              </h4>
              <span className="text-[10px] text-cyber-neonCyan">
                {events.length} EVENTS RECORDED
              </span>
            </div>

            <div className="space-y-2">
              {events.slice(0, 15).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-cyber-surface border border-cyber-border flex items-start gap-2.5"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      evt.severity === 'critical'
                        ? 'bg-cyber-neonRed animate-pulse'
                        : evt.severity === 'high'
                        ? 'bg-cyber-neonAmber'
                        : 'bg-cyber-neonCyan'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-cyber-textBright uppercase">{evt.type}</span>
                      <span className="text-cyber-textMuted">{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-cyber-textDim mt-0.5 leading-relaxed">
                      {evt.message}
                    </p>
                    <span className="text-[9px] text-cyber-textMuted font-mono block mt-1">
                      Component: {evt.component}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyber-textBright uppercase">
              Request Activity Stream
            </h4>
            <div className="space-y-2">
              {logsHistory.length === 0 ? (
                <p className="text-cyber-textMuted text-xs">No activity logged yet.</p>
              ) : (
                logsHistory.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan font-bold">
                        {item.method}
                      </span>
                      <span className="text-cyber-textBright truncate max-w-[200px]">
                        {item.url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-cyber-neonGreen">{item.responseStatus} OK</span>
                      <span className="text-cyber-textMuted">{item.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
