export interface BugBountyTarget {
  name: string;
  domain: string;
  type: string;
  inScope: boolean;
  notes: string;
}

export interface SeverityTier {
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  cvssRange: string;
  xpReward: number;
  mockBountyRange: string;
  description: string;
  examples: string[];
}

export const BUG_BOUNTY_PROGRAM = {
  programName: 'SECURE LEO SECURITY RESEARCH PROGRAM',
  status: 'ACTIVE — DEMO PROGRAM',
  version: '2.4-SIM',
  lastUpdated: 'September 2026',
  programOverview: 'Welcome to the simulated Secure Leo Bug Bounty & Vulnerability Disclosure Program. This program provides an ethical sandbox for aspiring security researchers to practice responsible disclosure, triage workflows, and vulnerability reporting standards in accordance with industry benchmarks (HackerOne, Bugcrowd, ISO 29147).',
  policyNotice: 'All targets listed below are simulated local sandbox environments. No actual internet infrastructure or third-party entities are targeted.',
  targets: [
    {
      name: 'Leo Shop E-Commerce',
      domain: 'shop.secureleo.local',
      type: 'Web Application (SPA + Node.js)',
      inScope: true,
      notes: 'Customer shopping cart, authentication endpoints, product catalog search, and avatar upload.'
    },
    {
      name: 'Secure Leo REST API Gateway',
      domain: 'api.secureleo.local',
      type: 'RESTful Microservices (JSON)',
      inScope: true,
      notes: 'Order processing, user profile management, session token verification, and health probes.'
    },
    {
      name: 'Researcher Management Portal',
      domain: 'portal.secureleo.local',
      type: 'Administrative Portal',
      inScope: true,
      notes: 'Lab telemetry collectors, simulated audit trails, and student progress synchronizers.'
    },
    {
      name: 'External Third-Party CDN (Simulated)',
      domain: 'cdn.thirdparty.example',
      type: 'Static Assets Provider',
      inScope: false,
      notes: 'Third-party asset domains are strictly out of scope.'
    }
  ] as BugBountyTarget[],
  rules: [
    {
      title: 'Responsible & Ethical Research',
      description: 'Conduct all security assessments strictly within designated sandbox boundaries. Report vulnerabilities promptly with clear reproduction steps.'
    },
    {
      title: 'No Destructive Actions',
      description: 'Do not attempt Denial of Service (DoS), data deletion, hardware disruption, or infrastructure exhaustion.'
    },
    {
      title: 'Zero Credential Harvesting & Privacy Respect',
      description: 'Never attempt to access, exfiltrate, or harvest personal data or real-world credentials. Use only synthetic test accounts provided.'
    },
    {
      title: 'No Real-World Targets or Exploitation',
      description: 'Never point automated scanners or security payloads at external websites, IP addresses, or non-simulated domains.'
    },
    {
      title: 'Clear Proof-of-Concept (PoC)',
      description: 'Submit non-destructive proof-of-concept steps (e.g. `alert(document.domain)` or harmless mock SELECT query) rather than intrusive payloads.'
    }
  ],
  severityTiers: [
    {
      severity: 'Critical',
      cvssRange: '9.0 - 10.0',
      xpReward: 350,
      mockBountyRange: '1,500 – 3,000 XP Points',
      description: 'Vulnerabilities that cause full remote code execution, unauthenticated administrative account takeover, or complete database exfiltration.',
      examples: ['Remote Code Execution (RCE) via File Upload', 'Unauthenticated SQLi in Auth Gateway', 'Bypass of Core API Authorization Engine']
    },
    {
      severity: 'High',
      cvssRange: '7.0 - 8.9',
      xpReward: 200,
      mockBountyRange: '800 – 1,400 XP Points',
      description: 'Flaws allowing significant data leakage across tenant accounts, stored XSS in administrative contexts, or privilege escalation.',
      examples: ['Horizontal IDOR leaking customer billing statements', 'Stored XSS in Support Ticket System', 'Blind SSRF against internal microservices']
    },
    {
      severity: 'Medium',
      cvssRange: '4.0 - 6.9',
      xpReward: 120,
      mockBountyRange: '400 – 750 XP Points',
      description: 'Vulnerabilities affecting state-changing actions under specific preconditions, reflected XSS, or flawed session timeouts.',
      examples: ['Reflected XSS on Search Query', 'Cross-Site Request Forgery on Profile Settings', 'Missing Rate Limiting on Password Reset']
    },
    {
      severity: 'Low',
      cvssRange: '0.1 - 3.9',
      xpReward: 60,
      mockBountyRange: '150 – 350 XP Points',
      description: 'Minor issues with limited security impact, such as verbose server headers, clickjacking on non-sensitive pages, or open redirects.',
      examples: ['Software version disclosure in Server header', 'Missing X-Frame-Options on static FAQs', 'Unvalidated external redirect']
    },
    {
      severity: 'Informational',
      cvssRange: '0.0',
      xpReward: 25,
      mockBountyRange: '50 XP Recognition',
      description: 'Defense-in-depth suggestions, security header recommendations, or best-practice architectural enhancements.',
      examples: ['HSTS preload recommendation', 'CSP directive optimizations', 'Deprecating legacy TLS cipher suites']
    }
  ] as SeverityTier[]
};
