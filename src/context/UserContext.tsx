import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ResearcherLevel, SecurityReport, Achievement } from '../types';

interface UserContextType {
  user: UserProfile;
  reports: SecurityReport[];
  achievements: Achievement[];
  addXp: (amount: number, reason?: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  submitReport: (report: Omit<SecurityReport, 'id' | 'createdAt' | 'updatedAt' | 'reporter' | 'status'>) => SecurityReport;
  updateReportStatus: (id: string, status: SecurityReport['status']) => void;
  completedLabs: string[];
  markLabCompleted: (labId: string, xpReward: number) => void;
  resetProgress: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-yokesh-01',
  name: 'YOKESH',
  title: 'B.E CSE — Cyber Security',
  level: 'PRACTITIONER',
  xp: 840,
  nextLevelXp: 1200,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  bio: 'Cybersecurity researcher and B.E Computer Science & Engineering undergraduate specializing in application security, penetration testing, defensive architecture, and vulnerability research. Passionate about breaking systems responsibly to build unbreakable defenses.',
  skills: [
    { name: 'Web Security', level: 90, category: 'AppSec' },
    { name: 'OWASP Top 10', level: 95, category: 'AppSec' },
    { name: 'Linux Hardening', level: 85, category: 'Systems' },
    { name: 'Networking & Protocols', level: 82, category: 'Infrastructure' },
    { name: 'Python Security Tooling', level: 88, category: 'Development' },
    { name: 'Java Security', level: 78, category: 'Development' },
    { name: 'Vulnerability Assessment', level: 92, category: 'Offensive' },
    { name: 'Secure Code Review', level: 86, category: 'Defensive' },
  ],
  github: 'https://github.com/yokesh-sec',
  linkedin: 'https://linkedin.com/in/yokesh-cybersecurity',
  email: 'yokesh.sec@academic.edu',
  resumeUrl: '#download-resume',
  labsCompletedCount: 4,
  reportsSubmittedCount: 2,
  achievementsUnlockedCount: 5,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-lab',
    title: 'FIRST LAB',
    category: 'Exploration',
    description: 'Successfully complete your very first interactive security lab.',
    iconName: 'Terminal',
    xpReward: 50,
    status: 'unlocked',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-18',
  },
  {
    id: 'ach-xss-explorer',
    title: 'XSS EXPLORER',
    category: 'Client-Side',
    description: 'Discover and remediate reflected client-side injection in the demo sandbox.',
    iconName: 'Code',
    xpReward: 100,
    status: 'unlocked',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-19',
  },
  {
    id: 'ach-injection-analyst',
    title: 'INJECTION ANALYST',
    category: 'Database Security',
    description: 'Inspect SQL query manipulation telemetry and remediate with parameterized queries.',
    iconName: 'Database',
    xpReward: 150,
    status: 'unlocked',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-20',
  },
  {
    id: 'ach-access-control',
    title: 'ACCESS CONTROL LEARNER',
    category: 'Authorization',
    description: 'Detect insecure direct object references across simulated multi-tenant APIs.',
    iconName: 'Key',
    xpReward: 125,
    status: 'unlocked',
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-09-20',
  },
  {
    id: 'ach-report-writer',
    title: 'REPORT WRITER',
    category: 'Bug Bounty',
    description: 'Draft and submit professional vulnerability research reports with reproduction steps.',
    iconName: 'FileText',
    xpReward: 150,
    status: 'unlocked',
    progress: 2,
    maxProgress: 3,
  },
  {
    id: 'ach-secure-coder',
    title: 'SECURE CODER',
    category: 'Defensive',
    description: 'Analyze vulnerable code snippets and verify secure remediation implementations.',
    iconName: 'ShieldCheck',
    xpReward: 200,
    status: 'in_progress',
    progress: 4,
    maxProgress: 6,
  },
  {
    id: 'ach-owasp-explorer',
    title: 'OWASP EXPLORER',
    category: 'Knowledge',
    description: 'Study all 10 core vulnerability categories in the Vulnerability Intelligence center.',
    iconName: 'BookOpen',
    xpReward: 175,
    status: 'in_progress',
    progress: 7,
    maxProgress: 10,
  },
  {
    id: 'ach-lab-master',
    title: 'LAB MASTER',
    category: 'Mastery',
    description: 'Complete all available vulnerable labs with zero automated hints.',
    iconName: 'Award',
    xpReward: 300,
    status: 'locked',
    progress: 2,
    maxProgress: 6,
  },
];

const INITIAL_REPORTS: SecurityReport[] = [
  {
    id: 'SL-REP-2026-081',
    title: 'Authentication Bypass via SQL Injection in Demo User Auth Endpoint',
    category: 'Injection',
    severity: 'High',
    affectedComponent: 'shop.secureleo.local /api/v1/auth/login',
    description: 'The authentication endpoint concatenated unsanitized user credentials directly into a database query string, allowing boolean condition bypass (`\' OR \'1\'=\'1`).',
    securityImpact: 'Unauthenticated administrative account takeover allowing arbitrary data exfiltration and session impersonation.',
    reproductionSummary: 'Submitted payload `admin\' --` with arbitrary password in the login modal. Auth succeeded without credential verification.',
    evidence: 'POST /api/v1/auth/login HTTP/1.1\nHost: shop.secureleo.local\nPayload: username=admin%27+--&password=x\nResponse: 200 OK {"token": "sim_admin_token_jwt", "role": "admin"}',
    rootCause: 'Dynamic query construction via string template literals without parameterized placeholders.',
    remediation: 'Implement prepared statements using parameterized placeholders e.g. `db.query("SELECT * FROM users WHERE username = ? AND password = ?", [user, pass])`.',
    references: 'OWASP Top 10 A03:2021-Injection | CWE-89: SQL Injection',
    status: 'Resolved',
    reporter: 'YOKESH',
    createdAt: '2026-09-18T14:32:00Z',
    updatedAt: '2026-09-19T10:15:00Z',
    triageNotes: 'Confirmed in lab sandbox. Remediation verified and closed.',
    awardedXp: 150,
  },
  {
    id: 'SL-REP-2026-082',
    title: 'Reflected Cross-Site Scripting (XSS) in Product Catalog Search Query',
    category: 'Client-Side Security',
    severity: 'Medium',
    affectedComponent: 'shop.secureleo.local /catalog?search=',
    description: 'Search terms submitted in the query string are reflected directly into the DOM innerHTML without HTML entity encoding or sanitization.',
    securityImpact: 'Execution of arbitrary JavaScript within the victim browser context, enabling simulated cookie exfiltration or DOM defacement.',
    reproductionSummary: 'Appended payload `<img src=x onerror="alert(document.domain)">` to search query. Executed immediately upon render.',
    evidence: 'GET /catalog?search=%3Cimg+src%3Dx+onerror%3Dalert(1)%3E\nRendered: <div class="results">Search for: <img src=x onerror=alert(1)></div>',
    rootCause: 'Direct usage of unsanitized input within browser DOM manipulation functions without context-aware escaping.',
    remediation: 'Utilize textContent instead of innerHTML, or implement DOMPurify / rigorous contextual HTML escaping.',
    references: 'OWASP Top 10 A03:2021-Injection | CWE-79: Cross-site Scripting',
    status: 'Under Review',
    reporter: 'YOKESH',
    createdAt: '2026-09-19T18:20:00Z',
    updatedAt: '2026-09-20T08:00:00Z',
    triageNotes: 'Valid reproduction in isolated demo environment.',
    awardedXp: 100,
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('secure_leo_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [reports, setReports] = useState<SecurityReport[]>(() => {
    const saved = localStorage.getItem('secure_leo_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('secure_leo_achievements');
    return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
  });

  const [completedLabs, setCompletedLabs] = useState<string[]>(() => {
    const saved = localStorage.getItem('secure_leo_completed_labs');
    return saved ? JSON.parse(saved) : ['sql-injection-lab', 'reflected-xss-lab'];
  });

  useEffect(() => {
    localStorage.setItem('secure_leo_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('secure_leo_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('secure_leo_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('secure_leo_completed_labs', JSON.stringify(completedLabs));
  }, [completedLabs]);

  const calculateLevel = (totalXp: number): { level: ResearcherLevel; nextLevelXp: number } => {
    if (totalXp < 300) return { level: 'NOVICE', nextLevelXp: 300 };
    if (totalXp < 700) return { level: 'LEARNER', nextLevelXp: 700 };
    if (totalXp < 1200) return { level: 'PRACTITIONER', nextLevelXp: 1200 };
    if (totalXp < 2000) return { level: 'SECURITY RESEARCHER', nextLevelXp: 2000 };
    return { level: 'SECURITY ENGINEER', nextLevelXp: 3500 };
  };

  const addXp = (amount: number, reason?: string) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const { level, nextLevelXp } = calculateLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level,
        nextLevelXp,
      };
    });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const submitReport = (reportData: Omit<SecurityReport, 'id' | 'createdAt' | 'updatedAt' | 'reporter' | 'status'>) => {
    const newId = `SL-REP-2026-${String(reports.length + 83).padStart(3, '0')}`;
    const newReport: SecurityReport = {
      ...reportData,
      id: newId,
      status: 'Submitted',
      reporter: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triageNotes: 'Report queued for automated triage simulation.',
      awardedXp: 120,
    };

    setReports(prev => [newReport, ...prev]);
    setUser(prev => ({ ...prev, reportsSubmittedCount: prev.reportsSubmittedCount + 1 }));
    addXp(120, 'Security Report Submission');
    return newReport;
  };

  const updateReportStatus = (id: string, status: SecurityReport['status']) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r));
  };

  const markLabCompleted = (labId: string, xpReward: number) => {
    if (!completedLabs.includes(labId)) {
      setCompletedLabs(prev => [...prev, labId]);
      setUser(prev => ({ ...prev, labsCompletedCount: prev.labsCompletedCount + 1 }));
      addXp(xpReward, `Completed Lab: ${labId}`);
    }
  };

  const resetProgress = () => {
    setUser(DEFAULT_USER);
    setReports(INITIAL_REPORTS);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setCompletedLabs(['sql-injection-lab']);
    localStorage.removeItem('secure_leo_user');
    localStorage.removeItem('secure_leo_reports');
    localStorage.removeItem('secure_leo_achievements');
    localStorage.removeItem('secure_leo_completed_labs');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        reports,
        achievements,
        addXp,
        updateUser,
        submitReport,
        updateReportStatus,
        completedLabs,
        markLabCompleted,
        resetProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
