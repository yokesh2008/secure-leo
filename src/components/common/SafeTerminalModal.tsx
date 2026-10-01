import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Shield, RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSecurityEvents } from '../../context/SecurityEventContext';
import { LABS_DATA } from '../../data/labsData';
import { BUG_BOUNTY_PROGRAM } from '../../data/bugBountyData';

interface SafeTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLabSlug?: string;
}

interface CommandHistoryItem {
  type: 'command' | 'output' | 'error' | 'system';
  text: string;
}

export const SafeTerminalModal: React.FC<SafeTerminalModalProps> = ({
  isOpen,
  onClose,
  activeLabSlug = 'sql-injection-lab',
}) => {
  const { user } = useUser();
  const { events, logEvent } = useSecurityEvents();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      type: 'system',
      text: 'SECURE LEO ISOLATED INTERACTIVE CLI v2.4-SEC\nType "help" to view safe lab inspection commands.\n---------------------------------------------------------',
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const activeLab = LABS_DATA.find(l => l.slug === activeLabSlug) || LABS_DATA[0];

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    setCmdHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newHistory: CommandHistoryItem[] = [
      ...history,
      { type: 'command', text: `secureleo@researcher:~$ ${trimmed}` },
    ];

    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `AVAILABLE SIMULATION COMMANDS:
  help           Display list of permitted commands
  status         Display simulated system & sandbox health
  lab-info       Show current active lab metadata & objectives
  show-target    List active simulated endpoints and targets
  show-request   Print latest simulated HTTP request payload
  show-response  Print latest simulated HTTP response & headers
  events         Stream recent SOC telemetry event log
  whoami         Display active researcher session info
  reset          Reset terminal simulation session state
  clear          Clear console scrollback buffer`,
        });
        break;

      case 'status':
        newHistory.push({
          type: 'output',
          text: `SYSTEM STATUS:
  [●] LAB ENVIRONMENT : ONLINE (12ms)
  [●] DEMO API       : OPERATIONAL (22ms)
  [●] LAB DATABASE   : SECURE (SQLite In-Memory Isolated)
  [●] LEARNING ENGINE: ONLINE
  [●] SECURITY AGENT : SOC v2.4-ACTIVE
  BOUNDARIES: External networking strictly disabled.`,
        });
        break;

      case 'lab-info':
        newHistory.push({
          type: 'output',
          text: `ACTIVE LAB:
  Title       : ${activeLab.title}
  Category    : ${activeLab.category}
  Difficulty  : ${activeLab.difficulty}
  Target      : ${activeLab.targetEndpoint}
  XP Points   : ${activeLab.points} XP
  Objectives  : 
${activeLab.learningObjectives.map(o => '    - ' + o).join('\n')}`,
        });
        break;

      case 'show-target':
        newHistory.push({
          type: 'output',
          text: `SIMULATED TARGETS (SANDBOX SCOPE):
${BUG_BOUNTY_PROGRAM.targets.map(t => `  [${t.inScope ? 'IN-SCOPE' : 'OUT-OF-SCOPE'}] ${t.domain} (${t.type})`).join('\n')}
NOTICE: Targets resolve strictly to internal browser memory mocks.`,
        });
        break;

      case 'show-request':
        newHistory.push({
          type: 'output',
          text: `LATEST SIMULATED REQUEST:
  POST /api/v1/auth/login HTTP/1.1
  Host: shop.secureleo.local
  User-Agent: SecureLeo-Inspector/2.4
  Content-Type: application/json
  X-Simulated-Sandbox: isolated-env-01

  {
    "email": "admin' --",
    "password": "arbitrary_test_password"
  }`,
        });
        break;

      case 'show-response':
        newHistory.push({
          type: 'output',
          text: `LATEST SIMULATED RESPONSE:
  HTTP/1.1 200 OK
  Date: ${new Date().toUTCString()}
  Content-Type: application/json
  X-Content-Type-Options: nosniff
  X-Simulated-Database-Rows: 1

  {
    "status": "authenticated",
    "user": {
      "id": "usr_001",
      "email": "admin@secureleo.local",
      "role": "admin"
    },
    "token": "sim_eyJh...mock_jwt_token"
  }`,
        });
        break;

      case 'events':
        newHistory.push({
          type: 'output',
          text: `RECENT SOC TELEMETRY:
${events.slice(0, 6).map(e => `  [${e.timestamp}] ${e.type} | ${e.component} | ${e.message}`).join('\n')}`,
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'output',
          text: `RESEARCHER IDENTITY:
  Name        : ${user.name}
  Title       : ${user.title}
  Rank Level  : ${user.level}
  Total XP    : ${user.xp} XP
  Auth Mode   : Simulated Student Researcher Session`,
        });
        break;

      case 'reset':
        newHistory.push({
          type: 'system',
          text: 'Simulation state refreshed. Cache cleared.',
        });
        logEvent('LAB_STARTED', 'TERMINAL', 'User reset terminal session.', 'info');
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${command}". Type "help" to view safe lab commands. External OS commands and real-world scanners are strictly restricted.`,
        });
        break;
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIndex);
          setInput(cmdHistory[nextIndex]);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-bg/85 backdrop-blur-md">
      <div
        className={`flex flex-col bg-cyber-surface border border-cyber-border rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isMaximized ? 'w-full h-full' : 'w-full max-w-3xl h-[520px]'
        }`}
      >
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-card border-b border-cyber-border select-none">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-textBright font-semibold">
            <TerminalIcon className="w-4 h-4 text-cyber-neonGreen" />
            <span>LEO TERMINAL — ISOLATED LAB WORKSPACE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-cyber-neonCyan">
              SAFE MODE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 rounded text-cyber-textMuted hover:text-cyber-textBright hover:bg-cyber-panel"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-cyber-textMuted hover:text-cyber-neonRed hover:bg-cyber-panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-[#05080e] text-cyber-textBright select-text"
        >
          {history.map((item, idx) => (
            <div key={idx} className="mb-2 whitespace-pre-wrap">
              {item.type === 'command' && (
                <span className="text-cyber-neonGreen font-bold">{item.text}</span>
              )}
              {item.type === 'system' && (
                <span className="text-cyber-neonCyan">{item.text}</span>
              )}
              {item.type === 'output' && (
                <span className="text-cyber-textDim">{item.text}</span>
              )}
              {item.type === 'error' && (
                <span className="text-cyber-neonRed font-semibold">{item.text}</span>
              )}
            </div>
          ))}

          {/* Active Command Prompt Line */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-cyber-neonGreen font-bold select-none">
              secureleo@researcher:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-cyber-textBright font-mono text-xs focus:outline-none caret-cyber-neonGreen"
              autoFocus
              spellCheck={false}
            />
          </div>
        </div>

        {/* Terminal Status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-cyber-card border-t border-cyber-border text-[11px] font-mono text-cyber-textMuted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyber-neonGreen">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonGreen animate-pulse" />
              SESSION SECURE
            </span>
            <span>TARGET: {activeLab.targetEndpoint}</span>
          </div>
          <span>TYPE "help" FOR COMMANDS</span>
        </div>
      </div>
    </div>
  );
};
