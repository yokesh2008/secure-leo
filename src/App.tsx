import React, { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { SecurityEventProvider } from './context/SecurityEventContext';
import { MainLayout } from './layouts/MainLayout';
import { CommandPalette } from './components/common/CommandPalette';
import { SafeTerminalModal } from './components/common/SafeTerminalModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LabsPage } from './pages/LabsPage';
import { LabDetailPage } from './pages/LabDetailPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { BugBountyPage } from './pages/BugBountyPage';
import { ReportsPage } from './pages/ReportsPage';
import { LearningPage } from './pages/LearningPage';
import { QuizPage } from './pages/QuizPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ErrorPage } from './pages/ErrorPage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentParam, setCurrentParam] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  const navigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setCurrentParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for Ctrl+K global keyboard shortcut
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={navigate}
            onOpenTerminal={() => setIsTerminalOpen(true)}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={navigate}
            onOpenTerminal={() => setIsTerminalOpen(true)}
          />
        );
      case 'labs':
        return <LabsPage onNavigate={navigate} />;
      case 'lab-detail':
        return (
          <LabDetailPage
            labSlug={currentParam || 'sql-injection-lab'}
            onNavigate={navigate}
            onOpenTerminal={() => setIsTerminalOpen(true)}
          />
        );
      case 'vulnerabilities':
        return (
          <VulnerabilitiesPage
            initialSlug={currentParam}
            onNavigate={navigate}
          />
        );
      case 'bug-bounty':
        return <BugBountyPage onNavigate={navigate} />;
      case 'reports':
        return (
          <ReportsPage
            initialMode={currentParam === 'new' ? 'new' : 'list'}
            onNavigate={navigate}
          />
        );
      case 'learning':
        return (
          <LearningPage
            initialModuleId={currentParam}
            onNavigate={navigate}
          />
        );
      case 'quiz':
        return <QuizPage onNavigate={navigate} />;
      case 'analytics':
        return <AnalyticsPage onOpenTerminal={() => setIsTerminalOpen(true)} />;
      case 'achievements':
        return <AchievementsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'admin':
        return <AdminPage />;
      default:
        return (
          <ErrorPage
            code="404"
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <UserProvider>
      <NotificationProvider>
        <SecurityEventProvider>
          <div className="relative min-h-screen bg-cyber-bg">
            {/* Main Application Layout */}
            <MainLayout
              currentPage={currentPage}
              onNavigate={navigate}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenTerminal={() => setIsTerminalOpen(true)}
            >
              {renderPage()}
            </MainLayout>

            {/* Global Command Palette (Ctrl + K) */}
            <CommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
              onNavigate={navigate}
              onOpenTerminal={() => setIsTerminalOpen(true)}
            />

            {/* Safe Interactive LEO Terminal Modal */}
            <SafeTerminalModal
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
              activeLabSlug={currentParam || 'sql-injection-lab'}
            />
          </div>
        </SecurityEventProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default App;
