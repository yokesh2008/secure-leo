import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, BookOpen, Shield, Bug, FileText, Award, Layers, ArrowRight, X } from 'lucide-react';
import { LABS_DATA } from '../../data/labsData';
import { VULNERABILITIES_DATA } from '../../data/vulnerabilitiesData';
import { ACADEMY_MODULES } from '../../data/academyData';
import { PROJECTS_DATA } from '../../data/projectsData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
  onOpenTerminal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenTerminal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent or event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Collect searchable items
  const items = [
    // Quick Actions & Tools
    {
      id: 'cmd-term',
      type: 'COMMAND',
      title: 'Open Safe LEO Terminal',
      description: 'Launch the simulated sandbox command-line console.',
      icon: Terminal,
      action: () => { onOpenTerminal(); onClose(); },
    },
    {
      id: 'cmd-report-new',
      type: 'COMMAND',
      title: 'Draft New Vulnerability Report',
      description: 'Open the vulnerability report builder editor.',
      icon: FileText,
      action: () => { onNavigate('reports', 'new'); onClose(); },
    },
    // Labs
    ...LABS_DATA.map(lab => ({
      id: `lab-${lab.slug}`,
      type: 'LAB',
      title: lab.title,
      description: `${lab.category} • ${lab.difficulty} • ${lab.points} XP`,
      icon: Shield,
      action: () => { onNavigate('lab-detail', lab.slug); onClose(); },
    })),
    // Vulnerabilities
    ...VULNERABILITIES_DATA.map(vuln => ({
      id: `vuln-${vuln.slug}`,
      type: 'VULNERABILITY',
      title: `${vuln.title} (${vuln.owaspId})`,
      description: `${vuln.category} • Severity: ${vuln.severity} (CVSS ${vuln.cvssScore})`,
      icon: Bug,
      action: () => { onNavigate('vulnerabilities', vuln.slug); onClose(); },
    })),
    // Academy Modules
    ...ACADEMY_MODULES.map(mod => ({
      id: `mod-${mod.id}`,
      type: 'LEARNING',
      title: mod.title,
      description: `${mod.category} • ${mod.lessons.length} Modules & Challenges`,
      icon: BookOpen,
      action: () => { onNavigate('learning', mod.id); onClose(); },
    })),
    // Projects
    ...PROJECTS_DATA.map(proj => ({
      id: `proj-${proj.id}`,
      type: 'PROJECT',
      title: proj.title,
      description: proj.tagline,
      icon: Layers,
      action: () => { onNavigate('projects', proj.id); onClose(); },
    })),
  ];

  const filteredItems = items.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  // Keyboard navigation within list
  useEffect(() => {
    const handleListNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };
    window.addEventListener('keydown', handleListNav);
    return () => window.removeEventListener('keydown', handleListNav);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-cyber-bg/80 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-cyber-panel border border-cyber-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-cyber-border/70 px-4 py-3.5">
          <Search className="w-5 h-5 text-cyber-neonCyan mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search labs, vulnerabilities, academy, reports... (Esc to close)"
            className="w-full bg-transparent text-sm text-cyber-textBright placeholder-cyber-textMuted focus:outline-none font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-cyber-textMuted hover:text-cyber-textBright mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-cyber-border/30">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-cyber-textMuted font-mono">
              No matching security components found for "{search}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const IconComp = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyber-surface border border-cyber-neonCyan/40 text-cyber-textBright shadow-sm'
                      : 'text-cyber-textDim hover:bg-cyber-surface/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-cyber-neonCyan/10 text-cyber-neonCyan border-cyber-neonCyan/40'
                          : 'bg-cyber-bg text-cyber-textMuted border-cyber-border'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyber-textBright truncate">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyber-bg border border-cyber-border text-cyber-neonGreen flex-shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyber-textMuted truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${
                      isSelected ? 'text-cyber-neonCyan translate-x-1' : 'text-cyber-border'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="flex items-center justify-between border-t border-cyber-border/70 px-4 py-2.5 bg-cyber-surface/60 text-[11px] font-mono text-cyber-textMuted">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-cyber-panel border border-cyber-border">↵</kbd> Select
            </span>
          </div>
          <span className="text-cyber-neonCyan">SECURE LEO QUICK NAV</span>
        </div>
      </div>
    </div>
  );
};
