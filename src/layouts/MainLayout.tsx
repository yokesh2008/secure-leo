import React, { useState, useEffect } from 'react';
import { Logo } from '../components/common/Logo';
import { NotificationBell } from '../components/common/NotificationBell';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard,
  Shield,
  Award,
  Bug,
  DollarSign,
  FileText,
  BookOpen,
  Activity,
  Layers,
  User,
  Search,
  Terminal,
  Menu,
  X,
  Settings,
  Zap,
} from 'lucide-react';

interface MainLayoutProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenCommandPalette: () => void;
  onOpenTerminal: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenCommandPalette,
  onOpenTerminal,
  children,
}) => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Overview', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Console', icon: Activity },
    { id: 'labs', label: 'Security Labs', icon: Shield },
    { id: 'quiz', label: 'Challenges', icon: Zap },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { id: 'bug-bounty', label: 'Bug Bounty', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-textBright font-sans selection:bg-cyber-neonGreen/20 selection:text-cyber-neonGreen">
      {/* Top Persistent Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-cyber-surface/90 border-b border-cyber-border backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('landing')}
            className="cursor-pointer flex items-center"
          >
            <Logo size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 font-mono text-xs">
            {navItems.slice(0, 10).map((item) => {
              const IconComp = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyber-panel border border-cyber-neonGreen text-cyber-neonGreen font-bold shadow-glow-green'
                      : 'text-cyber-textMuted hover:text-cyber-textBright hover:bg-cyber-card/60'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Global Search / Command Palette Bar */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-textDim text-cyber-textMuted hover:text-cyber-textBright font-mono text-xs transition-colors group"
            >
              <Search className="w-3.5 h-3.5 text-cyber-neonCyan group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Search Platform...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-cyber-surface border border-cyber-border text-[10px]">
                Ctrl K
              </kbd>
            </button>

            {/* Terminal Quick Button */}
            <button
              onClick={onOpenTerminal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyber-panel border border-cyber-border hover:border-cyber-neonGreen text-cyber-textDim hover:text-cyber-neonGreen font-mono text-xs transition-colors"
              title="Open LEO Terminal"
            >
              <Terminal className="w-4 h-4 text-cyber-neonGreen" />
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Admin shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl bg-cyber-surface border transition-colors ${
                currentPage === 'admin'
                  ? 'border-cyber-neonGreen text-cyber-neonGreen'
                  : 'border-cyber-border text-cyber-textMuted hover:text-cyber-textBright'
              }`}
              title="Admin Lab Management"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <div
              onClick={() => handleNavClick('profile')}
              className="hidden lg:flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-cyber-surface border border-cyber-border hover:border-cyber-neonCyan cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-cyber-panel border border-cyber-neonGreen flex items-center justify-center font-mono font-bold text-[10px] text-cyber-neonGreen">
                YL
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-mono font-bold text-cyber-textBright leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] font-mono text-cyber-neonGreen leading-none">
                  {user.level}
                </span>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textDim hover:text-cyber-textBright"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-cyber-panel border-b border-cyber-border p-4 font-mono text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2 border transition-all ${
                      isActive
                        ? 'bg-cyber-surface border-cyber-neonGreen text-cyber-neonGreen font-bold'
                        : 'border-cyber-border/40 text-cyber-textDim hover:text-cyber-textBright'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-cyber-border/60 flex items-center justify-between">
              <span className="text-cyber-textMuted text-[11px]">
                {user.name} • {user.level} ({user.xp} XP)
              </span>
              <button
                onClick={() => handleNavClick('admin')}
                className="text-cyber-neonCyan hover:underline"
              >
                Admin Panel →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main App Page View */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Global Cybersecurity Platform Footer */}
      <footer className="bg-cyber-surface border-t border-cyber-border py-10 px-4 sm:px-6 lg:px-8 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <Logo size="sm" showTagline={true} />
            <p className="text-[11px] text-cyber-textMuted mt-1">
              Isolated Cybersecurity Vulnerable Laboratory & Research Dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-cyber-textDim">
            <button onClick={() => handleNavClick('labs')} className="hover:text-cyber-neonGreen">Security Labs</button>
            <button onClick={() => handleNavClick('vulnerabilities')} className="hover:text-cyber-neonCyan">Vulnerability Intel</button>
            <button onClick={() => handleNavClick('bug-bounty')} className="hover:text-cyber-neonAmber">Bug Bounty</button>
            <button onClick={() => handleNavClick('learning')} className="hover:text-cyber-neonGreen">Academy</button>
            <button onClick={() => handleNavClick('projects')} className="hover:text-cyber-neonCyan">Portfolio</button>
            <button onClick={() => handleNavClick('profile')} className="hover:text-cyber-textBright">Yokesh (B.E CSE)</button>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-cyber-textMuted">
            <span>© 2026 SECURE LEO</span>
            <span>•</span>
            <span className="text-cyber-neonGreen">BREAK. LEARN. SECURE.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
