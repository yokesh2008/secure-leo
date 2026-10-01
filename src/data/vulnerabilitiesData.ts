import { Vulnerability } from '../types';

export const VULNERABILITIES_DATA: Vulnerability[] = [
  {
    id: 'vuln-sqli-01',
    slug: 'injection',
    title: 'SQL Injection (SQLi)',
    category: 'Injection',
    owaspId: 'A03:2021-Injection',
    cweId: 'CWE-89',
    severity: 'Critical',
    cvssScore: 9.8,
    overview: 'SQL Injection occurs when untrusted user input is directly concatenated or interpolated into a dynamic database query string, allowing attackers to manipulate query semantics, bypass authentication, read or modify sensitive tables, or execute administrative operations.',
    rootCause: 'Lack of strict separation between executable query code and user-supplied data in dynamic database abstraction layers.',
    attackSurface: 'Login forms, search filters, order ID parameters, sorting columns (`ORDER BY`), and HTTP request headers processed by ORM/raw database drivers.',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
      summary: 'Complete exposure of relational databases, administrative authentication bypass, arbitrary data modification, and potential OS command execution via database extensions.'
    },
    detectionConcept: 'Static code analysis (SAST) identifying raw query string interpolation, Dynamic Application Security Testing (DAST) injecting meta-characters (`\'`, `"`, `;`, `--`, `OR 1=1`), and database query anomaly monitoring.',
    safeDemoExample: {
      scenario: 'Simulated user login endpoint where input `admin\' --` forces SQLite to ignore the password verification clause.',
      payloadExample: "' OR '1'='1' --",
      observedBehavior: 'Query evaluates to TRUE for all rows, returning the primary administrative account token without password validation.'
    },
    defensiveStrategy: 'Adopt parameterized queries (prepared statements) as the universal standard, enforce Object-Relational Mappers (ORMs) with safe parameter bindings, and apply the principle of least privilege to database service accounts.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: String interpolation allows SQL structure alteration
const query = \`SELECT * FROM users WHERE email = '\${req.body.email}' AND password = '\${req.body.password}'\`;
const result = await db.query(query);`,
      secureSnippet: `// ✅ SECURE: Prepared statements treat inputs strictly as parameter literals
const query = 'SELECT id, email, password_hash, role FROM users WHERE email = ?';
const [user] = await db.query(query, [req.body.email]);
if (user && await bcrypt.compare(req.body.password, user.password_hash)) {
  return generateToken(user);
}`,
      explanation: 'Parameterized queries compile the SQL statement execution plan before user values are inserted, rendering metacharacters incapable of altering query semantics.'
    },
    preventionChecklist: [
      'Use parameterized queries / prepared statements exclusively for all SQL queries.',
      'Employ vetted ORMs (Prisma, TypeORM, Hibernate) using parameterized helper methods.',
      'Avoid dynamic SQL construction for table names and column sort fields; use strict whitelist validation.',
      'Configure database user permissions to least privilege (deny DROP/ALTER in web runtime accounts).'
    ],
    references: [
      { title: 'OWASP SQL Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command', url: 'https://cwe.mitre.org/data/definitions/89.html' }
    ]
  },
  {
    id: 'vuln-xss-02',
    slug: 'xss',
    title: 'Cross-Site Scripting (XSS)',
    category: 'Client-Side Security',
    owaspId: 'A03:2021-Injection',
    cweId: 'CWE-79',
    severity: 'High',
    cvssScore: 8.2,
    overview: 'Cross-Site Scripting occurs when web applications include untrusted data in an HTTP response or browser DOM without adequate contextual escaping or sanitization, allowing client-side execution of arbitrary malicious scripts.',
    rootCause: 'Failing to contextually encode or sanitize untrusted data before rendering it into HTML contexts, attribute values, or client-side execution sinks (e.g. innerHTML, eval).',
    attackSurface: 'Search query parameters reflected on pages, comment feeds, user profile biographies, rich text editors, and unvalidated URL parameters (`javascript:` URIs).',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'Medium',
      availability: 'None',
      summary: 'Session token exfiltration, sensitive DOM data theft, unauthorized actions on behalf of the victim user, credential harvesting via fraudulent login prompts, and defacement.'
    },
    detectionConcept: 'Auditing DOM sinks in client scripts (`innerHTML`, `document.write`, `outerHTML`), fuzzing input fields with HTML breakout sequences, and browser console script execution telemetry.',
    safeDemoExample: {
      scenario: 'Reflected search query rendered into `<div id="results">Search results for: [QUERY]</div>` without HTML encoding.',
      payloadExample: '<img src=x onerror="alert(\'XSS-Simulated\')">',
      observedBehavior: 'Image element fails to load source `x` and triggers the inline onerror JavaScript handler inside the sandbox.'
    },
    defensiveStrategy: 'Enforce Context-Aware Output Encoding, utilize secure DOM APIs (`textContent`, `replaceChildren`), sanitize rich HTML inputs with DOMPurify, and enforce a strict Content Security Policy (CSP).',
    codeGuidance: {
      language: 'javascript',
      vulnerableSnippet: `// ❌ DANGEROUS: Directly rendering user string into innerHTML sink
document.getElementById('banner').innerHTML = 'Welcome, ' + user.name;`,
      secureSnippet: `// ✅ SECURE: textContent encodes characters into harmless plain text
const bannerEl = document.getElementById('banner');
bannerEl.textContent = 'Welcome, ' + user.name;

// Or if rendering sanitized markup is necessary:
import DOMPurify from 'dompurify';
bannerEl.innerHTML = DOMPurify.sanitize(user.bio, { ALLOWED_TAGS: ['b', 'i', 'em'] });`,
      explanation: 'textContent treats all characters (including `<`, `>`, `&`, `"`) as pure text nodes, preventing the browser parser from executing script tags.'
    },
    preventionChecklist: [
      'Use framework auto-escaping mechanisms (React JSX, Angular templates) and avoid `dangerouslySetInnerHTML`.',
      'Sanitize unavoidable HTML inputs using DOMPurify with strict allowlists.',
      'Deploy strict Content Security Policy (CSP) headers restricting `script-src` and disabling `unsafe-inline`.',
      'Set `HttpOnly` and `Secure` flags on session cookies to prevent cookie theft via XSS.'
    ],
    references: [
      { title: 'OWASP Cross Site Scripting Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-79: Improper Neutralization of Input During Web Page Generation', url: 'https://cwe.mitre.org/data/definitions/79.html' }
    ]
  },
  {
    id: 'vuln-auth-03',
    slug: 'authentication',
    title: 'Broken Authentication & Session Management',
    category: 'Authentication',
    owaspId: 'A07:2021-Identification and Authentication Failures',
    cweId: 'CWE-287',
    severity: 'High',
    cvssScore: 8.5,
    overview: 'Authentication vulnerabilities allow attackers to compromise passwords, keys, or session tokens, or exploit other implementation flaws to assume other users’ identities either temporarily or permanently.',
    rootCause: 'Weak password complexity requirements, predictable session token generation, lack of rate limiting (permitting brute-force attacks), and missing multi-factor authentication.',
    attackSurface: 'Login forms, password reset endpoints, session token cookies, Remember Me tokens, and OAuth/SAML redirect callbacks.',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'Medium',
      summary: 'Complete account takeover, impersonation of administrative users, and unauthorized access to protected system assets.'
    },
    detectionConcept: 'Testing for missing rate limits on credential endpoints, analyzing session token entropy using randomness tools, and validating session invalidation upon logout.',
    safeDemoExample: {
      scenario: 'Password reset flow issuing deterministic tokens based on `Date.now()` without rate limiting.',
      payloadExample: 'Timestamp-based token enumeration attack script',
      observedBehavior: 'Token generator outputs predictable 6-digit hashes within an identical minute window.'
    },
    defensiveStrategy: 'Implement multi-factor authentication (MFA), adopt strong hashing algorithms (Argon2id, bcrypt), issue cryptographically secure random session tokens, and enforce account lockout/rate limiting.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Weak SHA256 without salt and weak session identifier
const hash = crypto.createHash('sha256').update(password).digest('hex');
const sessionToken = Math.random().toString(36);`,
      secureSnippet: `// ✅ SECURE: Adaptive hashing (Argon2id / bcrypt) + Cryptographically secure tokens
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const saltRounds = 12;
const passwordHash = await bcrypt.hash(password, saltRounds);
const sessionToken = crypto.randomBytes(32).toString('hex'); // 256-bit entropy`,
      explanation: 'Bcrypt and Argon2 include deliberate computational cost and salting to defeat GPU-accelerated rainbow tables and dictionary attacks.'
    },
    preventionChecklist: [
      'Implement rate limiting (e.g. max 5 attempts per 15 mins) on authentication endpoints.',
      'Store passwords with adaptive salted algorithms (Argon2id, PBKDF2, or bcrypt with factor >= 12).',
      'Generate session IDs with cryptographically secure random number generators (CSPRNG).',
      'Invalidate session IDs server-side upon logout and after password changes.'
    ],
    references: [
      { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
      { title: 'NIST SP 800-63B: Digital Identity Guidelines', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html' }
    ]
  },
  {
    id: 'vuln-idor-04',
    slug: 'authorization',
    title: 'Insecure Direct Object References (IDOR / BOLA)',
    category: 'Authorization',
    owaspId: 'A01:2021-Broken Access Control',
    cweId: 'CWE-639',
    severity: 'High',
    cvssScore: 8.6,
    overview: 'IDOR occurs when an application provides direct access to objects based on user-supplied input without verifying that the requesting user has appropriate authorization permissions for that specific resource.',
    rootCause: 'Relying solely on client-side state or parameter IDs without performing server-side ownership verification.',
    attackSurface: 'REST API endpoints containing resource IDs (`/api/documents/104`), hidden form fields, and file download query parameters.',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'Low',
      summary: 'Horizontal privilege escalation (accessing other users\' private data) or vertical escalation (modifying system administrative configurations).'
    },
    detectionConcept: 'Parameter tampering testing (swapping IDs between two test accounts) and automated authorization fuzzing.',
    safeDemoExample: {
      scenario: 'User A logs in, views order `#101`, and alters the URL to `#102` which displays User B\'s billing invoice.',
      payloadExample: 'GET /api/v1/orders/102 HTTP/1.1 (Authenticated as User 101)',
      observedBehavior: 'Server returns Order 102 belonging to another user without checking JWT tenant identity.'
    },
    defensiveStrategy: 'Enforce row-level access control checks on every server endpoint. Use indirect reference maps or non-sequential UUIDv4 values.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Fetches resource strictly by ID from route parameters
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoice = await db.invoices.findById(req.params.id);
  res.json(invoice);
});`,
      secureSnippet: `// ✅ SECURE: Validates that invoice belongs to the authenticated user
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoice = await db.invoices.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});`,
      explanation: 'Binding the resource identifier with the authenticated user ID guarantees access is denied if the user does not own the record.'
    },
    preventionChecklist: [
      'Enforce record ownership checks in SQL/ORM queries via `userId = req.user.id`.',
      'Use unpredictable GUIDs/UUIDv4 instead of auto-incrementing integer IDs.',
      'Centralize authorization policies using Attribute-Based Access Control (ABAC).',
      'Deny access by default when ownership cannot be verified.'
    ],
    references: [
      { title: 'OWASP Authorization Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/' },
      { title: 'CWE-639: Authorization Bypass Through User-Controlled Key', url: 'https://cwe.mitre.org/data/definitions/639.html' }
    ]
  },
  {
    id: 'vuln-csrf-05',
    slug: 'csrf',
    title: 'Cross-Site Request Forgery (CSRF)',
    category: 'Web Security',
    owaspId: 'A01:2021-Broken Access Control',
    cweId: 'CWE-352',
    severity: 'Medium',
    cvssScore: 6.5,
    overview: 'CSRF tricks an authenticated end user into executing unwanted actions on a web application in which they are currently logged in, leveraging automatic browser cookie transmission.',
    rootCause: 'Web servers relying exclusively on automatically submitted credentials (session cookies, basic auth) to authorize state-changing HTTP requests.',
    attackSurface: 'State-changing POST/PUT requests (email updates, password changes, financial transfers) that lack custom verification headers or unique tokens.',
    securityImpact: {
      confidentiality: 'Low',
      integrity: 'High',
      availability: 'None',
      summary: 'Unauthorized changes to user email, password, or security settings, leading to full account takeover.'
    },
    detectionConcept: 'Submitting cross-origin HTML form POST requests from an external test domain and checking if the server accepts the state mutation.',
    safeDemoExample: {
      scenario: 'Attacker webpage containing `<form action="http://shop.secureleo.local/api/transfer" method="POST">` auto-submits via JS.',
      payloadExample: '<body onload="document.forms[0].submit()">',
      observedBehavior: 'Victim browser sends valid session cookies and completes the transfer without user awareness.'
    },
    defensiveStrategy: 'Enforce `SameSite=Lax` or `Strict` on all cookies, implement Synchronizer Anti-CSRF Tokens, and require re-authentication for critical operations.',
    codeGuidance: {
      language: 'javascript',
      vulnerableSnippet: `// ❌ DANGEROUS: Cookie alone authorizes email update
app.post('/api/user/email', checkSessionCookie, (req, res) => {
  updateUserEmail(req.session.userId, req.body.email);
  res.json({ success: true });
});`,
      secureSnippet: `// ✅ SECURE: Synchronizer token pattern + SameSite cookie flag
app.use(session({
  cookie: { sameSite: 'lax', secure: true, httpOnly: true }
}));

app.post('/api/user/email', checkSessionCookie, verifyCsrfToken, (req, res) => {
  updateUserEmail(req.session.userId, req.body.email);
  res.json({ success: true });
});`,
      explanation: 'Synchronizer tokens are unique cryptographically generated values stored in user sessions and validated on state-changing requests.'
    },
    preventionChecklist: [
      'Configure `SameSite=Lax` or `SameSite=Strict` on all session cookies.',
      'Implement Anti-CSRF tokens on all state-altering POST/PUT/DELETE requests.',
      'Check custom headers (e.g. `X-Requested-With` or `Sec-Fetch-Site`) for API calls.',
      'Require current password verification before sensitive profile mutations.'
    ],
    references: [
      { title: 'OWASP Cross-Site Request Forgery Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
      { title: 'CWE-352: Cross-Site Request Forgery', url: 'https://cwe.mitre.org/data/definitions/352.html' }
    ]
  },
  {
    id: 'vuln-upload-06',
    slug: 'file-handling',
    title: 'Unrestricted File Upload',
    category: 'File Handling',
    owaspId: 'A04:2021-Insecure Design',
    cweId: 'CWE-434',
    severity: 'Critical',
    cvssScore: 9.8,
    overview: 'Unrestricted file upload enables attackers to upload malicious executable files (e.g. `.php`, `.jsp`, webshells, or SVG containing scripts) into web-accessible directories, resulting in remote code execution (RCE).',
    rootCause: 'Relying solely on client-side extension validation or spoofable HTTP `Content-Type` headers without verifying server-side magic bytes.',
    attackSurface: 'Avatar upload, resume submissions, document attachments, and image import functions.',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'High',
      summary: 'Remote Code Execution (RCE), complete server compromise, lateral network movement, and malware hosting.'
    },
    detectionConcept: 'Uploading files with double extensions (`file.php.jpg`), null byte injection, SVG vectors with script payloads, and verifying if file signatures are validated.',
    safeDemoExample: {
      scenario: 'Avatar uploader allowing `.php.png` polyglot that bypasses filename `.endsWith(".png")` checks.',
      payloadExample: 'File with magic byte mismatch and executable payload',
      observedBehavior: 'Server stores file under public path without re-encoding, allowing script interpretation.'
    },
    defensiveStrategy: 'Validate file binary magic numbers, rename uploaded files with random UUIDs, store files outside web root or in dedicated object storage (S3), and serve with `Content-Disposition: attachment`.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Preserves user filename and saves directly in public static folder
const target = path.join(__dirname, 'public/avatars', req.file.originalname);
fs.copyFileSync(req.file.path, target);`,
      secureSnippet: `// ✅ SECURE: Magic byte detection + UUID generation + non-executable storage
import { fileTypeFromBuffer } from 'file-type';
import crypto from 'crypto';

const buffer = req.file.buffer;
const type = await fileTypeFromBuffer(buffer);
if (!type || !['image/jpeg', 'image/png'].includes(type.mime)) {
  throw new Error('Invalid file format');
}
const safeName = \`\${crypto.randomUUID()}.\${type.ext}\`;
await s3Client.putObject({ Bucket: 'private-user-uploads', Key: safeName, Body: buffer });`,
      explanation: 'Checking magic bytes reads internal binary file headers, preventing disguised executable files from being treated as images.'
    },
    preventionChecklist: [
      'Inspect magic numbers / binary file signatures using server-side libraries.',
      'Rename all uploaded files to randomized UUIDs; never use user-supplied names.',
      'Store user files outside web application document roots or on isolated S3 buckets.',
      'Disable script execution permissions (`noexec`) on upload storage mount points.'
    ],
    references: [
      { title: 'OWASP File Upload Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' },
      { title: 'CWE-434: Unrestricted Upload of File with Dangerous Type', url: 'https://cwe.mitre.org/data/definitions/434.html' }
    ]
  },
  {
    id: 'vuln-misconfig-07',
    slug: 'security-misconfiguration',
    title: 'Security Misconfiguration',
    category: 'Security Misconfiguration',
    owaspId: 'A05:2021-Security Misconfiguration',
    cweId: 'CWE-16',
    severity: 'High',
    cvssScore: 7.5,
    overview: 'Security misconfigurations occur when security controls are inaccurately defined, default credentials remain active, verbose stack traces leak system paths, or security headers are absent.',
    rootCause: 'Deploying applications with default development configurations, debug flags enabled, or missing security hardening headers.',
    attackSurface: 'Debug consoles, exposed `/metrics` or `/actuator` endpoints, default admin passwords, and unhardened HTTP response headers.',
    securityImpact: {
      confidentiality: 'Medium',
      integrity: 'Medium',
      availability: 'Medium',
      summary: 'Information disclosure of source code paths, database versions, and server architecture; ease of secondary exploitation.'
    },
    detectionConcept: 'Scanning HTTP response headers (CSP, HSTS, X-Content-Type-Options) and checking for exposed configuration files (`.env`, `.git/HEAD`).',
    safeDemoExample: {
      scenario: 'Application displays full stack trace with database connection string on unhandled 500 error.',
      payloadExample: 'GET /api/error-trigger HTTP/1.1',
      observedBehavior: 'Server dumps environment paths, Node.js version, and internal SQL query error.'
    },
    defensiveStrategy: 'Enforce automated security configuration baselines, remove debug tools in production, configure Helmet security headers, and disable directory listings.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Detailed stack traces and lack of hardening headers
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack, env: process.env });
});`,
      secureSnippet: `// ✅ SECURE: Helmet security headers + sanitized generic error responses
import helmet from 'helmet';

app.use(helmet());
app.use((err, req, res, next) => {
  logger.error(err); // Log internally for security review
  res.status(500).json({ error: 'An unexpected internal error occurred.' });
});`,
      explanation: 'Helmet sets HTTP headers like Content-Security-Policy, Strict-Transport-Security, and X-Content-Type-Options to protect against common web attacks.'
    },
    preventionChecklist: [
      'Implement `helmet` in Node/Express or equivalent middleware in production.',
      'Ensure debug mode is disabled in production environments (`NODE_ENV=production`).',
      'Never expose `.git`, `.env`, or backup files on public web roots.',
      'Change all default administrative credentials before deployment.'
    ],
    references: [
      { title: 'OWASP Security Misconfiguration', url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/' },
      { title: 'CWE-16: Configuration', url: 'https://cwe.mitre.org/data/definitions/16.html' }
    ]
  },
  {
    id: 'vuln-api-08',
    slug: 'api-security',
    title: 'API Security & Broken Object Level Authorization (BOLA)',
    category: 'API Security',
    owaspId: 'OWASP API1:2023-Broken Object Level Authorization',
    cweId: 'CWE-285',
    severity: 'Critical',
    cvssScore: 9.1,
    overview: 'APIs frequently expose endpoints that handle object identifiers, creating a wide attack surface for object level access control issues when validation of client requests is missed.',
    rootCause: 'Assuming client clients (mobile apps or SPAs) only request IDs belonging to the logged-in user, neglecting server-side ownership checks.',
    attackSurface: 'REST and GraphQL endpoints querying entities via path variables (`/api/v1/users/{id}/settings`).',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'High',
      availability: 'Low',
      summary: 'Mass data scraping, unauthorized account profile modifications, and tenant cross-contamination in SaaS environments.'
    },
    detectionConcept: 'Inspecting API traffic between mobile/SPA clients, identifying numeric or guessable identifiers, and attempting access across diverse user sessions.',
    safeDemoExample: {
      scenario: 'API endpoint `/api/v1/accounts/8492/statement` accessed by user authorized for account `8491`.',
      payloadExample: 'GET /api/v1/accounts/8492/statement HTTP/1.1',
      observedBehavior: 'Endpoint returns full financial statement without verifying token claims.'
    },
    defensiveStrategy: 'Enforce authorization mechanisms at the model/query layer for every endpoint that accepts an ID parameter. Never rely on UI filtering alone.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Updates profile directly from request path
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  await db.users.update(req.body, { where: { id: req.params.id } });
  res.json({ updated: true });
});`,
      secureSnippet: `// ✅ SECURE: Enforces that req.user.id matches target resource or admin role
app.put('/api/users/:id', authMiddleware, async (req, res) => {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  const safeData = pick(req.body, ['displayName', 'bio', 'avatar']);
  await db.users.update(safeData, { where: { id: req.params.id } });
  res.json({ updated: true });
});`,
      explanation: 'Explicit verification of token identity against requested resource identity stops unauthorized horizontal modifications.'
    },
    preventionChecklist: [
      'Validate user authorization against object tenant on every API invocation.',
      'Avoid exposing sequential IDs; use UUIDv4 or encrypted tokens.',
      'Implement automated API security testing in CI/CD pipelines.',
      'Apply rate limiting per user and per API key.'
    ],
    references: [
      { title: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/' },
      { title: 'CWE-285: Improper Authorization', url: 'https://cwe.mitre.org/data/definitions/285.html' }
    ]
  },
  {
    id: 'vuln-session-09',
    slug: 'session-security',
    title: 'Session Security & Cookie Hardening',
    category: 'Session Security',
    owaspId: 'A07:2021-Identification and Authentication Failures',
    cweId: 'CWE-613',
    severity: 'Medium',
    cvssScore: 6.8,
    overview: 'Session vulnerabilities result from weak cookie attributes, session fixation, infinite session timeouts, and transmission over unencrypted channels.',
    rootCause: 'Omitting critical cookie security flags (`HttpOnly`, `Secure`, `SameSite`) or failing to regenerate session IDs upon authentication state transitions.',
    attackSurface: 'Session cookies transmitted in plain text, cookies accessible to JavaScript (`document.cookie`), and session IDs exposed in URLs.',
    securityImpact: {
      confidentiality: 'High',
      integrity: 'Medium',
      availability: 'None',
      summary: 'Session hijacking, persistent eavesdropping, and credential bypass via stolen tokens.'
    },
    detectionConcept: 'Inspecting HTTP response `Set-Cookie` headers for missing `HttpOnly`, `Secure`, or `SameSite` flags.',
    safeDemoExample: {
      scenario: 'Cookie `auth_session=xyz123` set without `HttpOnly` flag.',
      payloadExample: 'javascript:alert(document.cookie)',
      observedBehavior: 'JavaScript accesses the session token directly in the browser DOM.'
    },
    defensiveStrategy: 'Set `HttpOnly; Secure; SameSite=Lax` on all authentication cookies, implement absolute and idle session timeouts, and regenerate session tokens after login.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Permissive cookie without security attributes
res.cookie('token', token);`,
      secureSnippet: `// ✅ SECURE: Hardened cookie flags
res.cookie('token', token, {
  httpOnly: true, // Prevents XSS scripts from accessing the cookie
  secure: true,   // Transmitted exclusively over HTTPS
  sameSite: 'lax',// Mitigates CSRF vulnerabilities
  maxAge: 3600000 // 1 hour expiration
});`,
      explanation: 'The HttpOnly flag blocks client JavaScript from reading the cookie, significantly minimizing the impact of XSS vulnerabilities on session compromise.'
    },
    preventionChecklist: [
      'Always specify `HttpOnly` on sensitive session identifiers.',
      'Enforce `Secure` attribute to mandate HTTPS transport.',
      'Configure `SameSite=Lax` or `Strict` to mitigate cross-site request forgery.',
      'Regenerate session token upon user authentication to prevent session fixation.'
    ],
    references: [
      { title: 'OWASP Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
      { title: 'CWE-613: Insufficient Session Expiration', url: 'https://cwe.mitre.org/data/definitions/613.html' }
    ]
  },
  {
    id: 'vuln-input-10',
    slug: 'input-validation',
    title: 'Input Validation & Type Confusion',
    category: 'Input Validation',
    owaspId: 'A03:2021-Injection',
    cweId: 'CWE-20',
    severity: 'High',
    cvssScore: 7.9,
    overview: 'Improper input validation allows malformed, unexpected, or malicious data to flow into application workflows, triggering buffer overflows, prototype pollution, or logical bypasses.',
    rootCause: 'Trusting user input shapes without strict schema validation, type checking, or canonicalization.',
    attackSurface: 'JSON request bodies, query strings, headers, and form fields.',
    securityImpact: {
      confidentiality: 'Medium',
      integrity: 'High',
      availability: 'High',
      summary: 'Data corruption, application crashes (DoS), prototype pollution, and business logic circumvention.'
    },
    detectionConcept: 'Fuzzing input fields with abnormal types (arrays where strings are expected, object prototypes, null values).',
    safeDemoExample: {
      scenario: 'JSON endpoint expects `{ "role": "user" }` but receives `{ "__proto__": { "admin": true } }`.',
      payloadExample: '{"__proto__": {"isAdmin": true}}',
      observedBehavior: 'Object prototype is polluted, granting administrative properties globally.'
    },
    defensiveStrategy: 'Adopt schema validation libraries (Zod, Joi), freeze object prototypes, and validate inputs against strict allowlists.',
    codeGuidance: {
      language: 'typescript',
      vulnerableSnippet: `// ❌ DANGEROUS: Unvalidated shallow merge
function updateSettings(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
}`,
      secureSnippet: `// ✅ SECURE: Strict schema validation using Zod
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  notificationsEnabled: z.boolean(),
}).strict(); // Rejects unrecognized keys

const validatedData = UpdateProfileSchema.parse(req.body);`,
      explanation: 'Strict schemas enforce data types, lengths, and shapes while rejecting unexpected or prototype-polluting keys.'
    },
    preventionChecklist: [
      'Validate all inputs against strict schemas (e.g. Zod or Joi) at application boundaries.',
      'Use allowlists rather than blocklists for permissible characters and values.',
      'Freeze Object.prototype or use Map objects for dynamic key-value storage.',
      'Enforce type safety across full-stack applications with TypeScript.'
    ],
    references: [
      { title: 'OWASP Input Validation Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' },
      { title: 'CWE-20: Improper Input Validation', url: 'https://cwe.mitre.org/data/definitions/20.html' }
    ]
  }
];
