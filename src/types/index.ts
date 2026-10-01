// Core TypeScript Data Models for SECURE LEO

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SeverityLevel = 'Informational' | 'Low' | 'Medium' | 'High' | 'Critical';
export type ResearcherLevel = 'NOVICE' | 'LEARNER' | 'PRACTITIONER' | 'SECURITY RESEARCHER' | 'SECURITY ENGINEER';
export type ReportStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Resolved';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  level: ResearcherLevel;
  xp: number;
  nextLevelXp: number;
  avatarUrl: string;
  bio: string;
  skills: { name: string; level: number; category: string }[];
  github: string;
  linkedin: string;
  email: string;
  resumeUrl: string;
  labsCompletedCount: number;
  reportsSubmittedCount: number;
  achievementsUnlockedCount: number;
}

export interface LabTask {
  id: string;
  text: string;
  completed: boolean;
  hint?: string;
}

export interface LabHint {
  level: number;
  costXp: number;
  content: string;
  unlocked: boolean;
}

export interface Lab {
  id: string;
  slug: string;
  title: string;
  category: 'Injection' | 'Client-Side Security' | 'Access Control' | 'Authentication' | 'Web Security' | 'Input Validation' | 'API Security' | 'Configuration';
  difficulty: DifficultyLevel;
  technology: string;
  points: number;
  estimatedMinutes: number;
  isAvailable: boolean;
  isCompleted: boolean;
  briefDescription: string;
  fullDescription: string;
  learningObjectives: string[];
  tasks: LabTask[];
  hints: LabHint[];
  demoAppUrl: string;
  demoAppTitle: string;
  targetEndpoint: string;
  workflowStage: 'discover' | 'analyze' | 'test' | 'observe' | 'understand' | 'remediate' | 'report';
  remediationCode: {
    language: string;
    vulnerable: string;
    secure: string;
    explanation: string;
  };
}

export interface Vulnerability {
  id: string;
  slug: string;
  title: string;
  category: string;
  owaspId: string;
  cweId: string;
  severity: SeverityLevel;
  cvssScore: number;
  overview: string;
  rootCause: string;
  attackSurface: string;
  securityImpact: {
    confidentiality: 'None' | 'Low' | 'Medium' | 'High';
    integrity: 'None' | 'Low' | 'Medium' | 'High';
    availability: 'None' | 'Low' | 'Medium' | 'High';
    summary: string;
  };
  detectionConcept: string;
  safeDemoExample: {
    scenario: string;
    payloadExample: string;
    observedBehavior: string;
  };
  defensiveStrategy: string;
  codeGuidance: {
    language: string;
    vulnerableSnippet: string;
    secureSnippet: string;
    explanation: string;
  };
  preventionChecklist: string[];
  references: { title: string; url: string }[];
}

export interface SecurityReport {
  id: string;
  title: string;
  category: string;
  severity: SeverityLevel;
  affectedComponent: string;
  description: string;
  securityImpact: string;
  reproductionSummary: string;
  evidence: string;
  rootCause: string;
  remediation: string;
  references: string;
  status: ReportStatus;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  triageNotes?: string;
  awardedXp?: number;
}

export interface Achievement {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  xpReward: number;
  status: 'locked' | 'in_progress' | 'unlocked';
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  theory: string[];
  visualConcept: string;
  safeDemoCode: string;
  keyTakeaways: string[];
  miniChallenge: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  completed: boolean;
}

export interface AcademyModule {
  id: string;
  title: string;
  category: 'WEB SECURITY' | 'APPLICATION SECURITY' | 'DEFENSIVE SECURITY';
  description: string;
  lessons: Lesson[];
  badgeName: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  architecture: string[];
  technology: string[];
  securityConcept: string;
  features: string[];
  securityImpact: string;
  status: string;
  metrics: { label: string; value: string }[];
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'LAB_STARTED' | 'VULNERABILITY_DETECTED' | 'CHALLENGE_COMPLETED' | 'REPORT_SUBMITTED' | 'REMEDIATION_VIEWED' | 'ACHIEVEMENT_UNLOCKED' | 'ANOMALY_LOGGED' | 'AUTH_BYPASS_ATTEMPT';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  component: string;
  message: string;
  details?: Record<string, any>;
}

export interface HttpInspectionLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  parameters: Record<string, string>;
  body?: string;
  responseStatus: number;
  responseStatusText: string;
  responseHeaders: Record<string, string>;
  responseBody: string;
  securityObservations: string[];
}
