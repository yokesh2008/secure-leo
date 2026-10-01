import { AcademyModule } from '../types';

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'mod-web-sec',
    title: 'WEB APPLICATION SECURITY',
    category: 'WEB SECURITY',
    description: 'Master the fundamental communication protocols, state mechanisms, and client-server boundaries that power modern web applications.',
    badgeName: 'Web Sec Novice',
    accentColor: '#00f0ff',
    lessons: [
      {
        id: 'les-web-1',
        title: 'Web Application Fundamentals & Threat Modeling',
        estimatedMinutes: 15,
        theory: [
          'Web applications operate on a distributed client-server architecture. The browser client is an untrusted environment completely under user control, while the server must enforce all security boundaries.',
          'Threat modeling involves identifying potential attack surfaces, assets at risk, and threat actors. In modern application security, the fundamental axiom is: Never trust client-supplied input.'
        ],
        visualConcept: 'Client-to-Server boundary diagram showing untrusted browser inputs crossing through reverse proxies, API gateways, and web application firewalls into hardened microservices.',
        safeDemoCode: `// Architecture Rule #1: Validate at boundary
function handleClientRequest(req) {
  // Input validation must occur on the server, not just in UI forms!
  const sanitizedInput = validateServerSide(req.body);
  return processBusinessLogic(sanitizedInput);
}`,
        keyTakeaways: [
          'All client-side validation can be bypassed using simple HTTP proxy tools (Burp Suite, OWASP ZAP).',
          'Security must be enforced deterministically on the server side.',
          'Model threats early during the architectural design phase.'
        ],
        miniChallenge: {
          question: 'Why can client-side form validation (e.g. HTML5 required attribute or React form check) never be considered a security boundary?',
          options: [
            'Because modern browsers strip client-side validation rules in production.',
            'Because an attacker can send HTTP requests directly to the API endpoint bypassing the browser interface completely.',
            'Because HTML5 validations only work on mobile devices.',
            'Because SSL/TLS encrypts and disables client validation.'
          ],
          correctAnswer: 1,
          explanation: 'Attackers do not have to use your frontend UI; they can issue raw HTTP requests via cURL, Postman, or custom scripts directly to the backend API without triggering client validation.'
        },
        completed: true
      },
      {
        id: 'les-web-2',
        title: 'HTTP, HTTPS & Transport Layer Security',
        estimatedMinutes: 20,
        theory: [
          'HTTP is a stateless protocol. HTTPS wraps standard HTTP transactions in a Transport Layer Security (TLS) cryptographic tunnel, ensuring Confidentiality, Integrity, and Server Authentication.',
          'Without HTTPS, network adversaries on shared networks (such as public Wi-Fi or compromised routers) can perform Man-In-The-Middle (MITM) attacks, inspecting session tokens and injecting rogue code.'
        ],
        visualConcept: 'TLS Handshake sequence: ClientHello, ServerHello, Certificate Validation, Pre-Master Secret exchange, Symmetric Session Key derivation.',
        safeDemoCode: `// Enforce HTTPS redirection in Express.js
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, 'https://' + req.header('host') + req.url);
  }
  next();
});`,
        keyTakeaways: [
          'HTTPS protects data in transit, but does NOT protect against application-level vulnerabilities like SQLi or XSS.',
          'Use HTTP Strict Transport Security (HSTS) with long max-age to prevent SSL stripping.',
          'Always disable outdated protocols (SSLv3, TLS 1.0, TLS 1.1) in server configurations.'
        ],
        miniChallenge: {
          question: 'Which HTTP response header forces browsers to communicate strictly over HTTPS for all subsequent requests?',
          options: [
            'Content-Security-Policy',
            'Strict-Transport-Security (HSTS)',
            'X-Forwarded-Proto',
            'Access-Control-Allow-Origin'
          ],
          correctAnswer: 1,
          explanation: 'Strict-Transport-Security (HSTS) informs the browser that the domain must only be accessed over HTTPS for a specified duration, preventing downgrade attacks.'
        },
        completed: true
      },
      {
        id: 'les-web-3',
        title: 'Cookies, Sessions & State Security',
        estimatedMinutes: 25,
        theory: [
          'Because HTTP is stateless, web apps manage session state using HTTP cookies or Bearer tokens. Cookies are small key-value pairs stored in the browser and automatically sent with matching domain requests.',
          'If a cookie lacking the `HttpOnly` flag is used for session authentication, any Cross-Site Scripting (XSS) vulnerability on the site allows immediate theft of the user\'s full session token.'
        ],
        visualConcept: 'Set-Cookie header attributes: Domain, Path, Expires, HttpOnly (blocks JS DOM), Secure (mandates TLS), SameSite (mitigates CSRF).',
        safeDemoCode: `// Production-hardened cookie configuration
res.cookie('sessionId', cryptographicallySecureToken, {
  httpOnly: true,     // Inaccessible to document.cookie
  secure: true,       // Only transmitted over HTTPS
  sameSite: 'strict', // Never sent with cross-site requests
  maxAge: 3600000     // Expires in 1 hour
});`,
        keyTakeaways: [
          'Always set `HttpOnly` on sensitive authentication tokens.',
          'Use `SameSite=Lax` or `SameSite=Strict` to protect against Cross-Site Request Forgery.',
          'Implement session expiration both on the client and in the backend session store.'
        ],
        miniChallenge: {
          question: 'What is the primary security defense provided by the `HttpOnly` cookie attribute?',
          options: [
            'It encrypts the cookie payload stored on the user hard drive.',
            'It prevents client-side JavaScript from accessing `document.cookie`, preventing cookie theft via XSS.',
            'It blocks all HTTP traffic unless an API key is attached.',
            'It automatically validates the user IP address on every request.'
          ],
          correctAnswer: 1,
          explanation: 'When HttpOnly is specified, the browser will not expose the cookie to `document.cookie` in JavaScript, preventing stolen sessions via standard XSS payloads.'
        },
        completed: false
      }
    ]
  },
  {
    id: 'mod-app-sec',
    title: 'APPLICATION SECURITY & VULNERABILITY MECHANICS',
    category: 'APPLICATION SECURITY',
    description: 'Deep dive into OWASP Top 10 vulnerabilities, root cause exploitation patterns, and secure design patterns.',
    badgeName: 'AppSec Analyst',
    accentColor: '#00ff9d',
    lessons: [
      {
        id: 'les-app-1',
        title: 'SQL Injection Mechanics & AST Manipulation',
        estimatedMinutes: 25,
        theory: [
          'SQL injection happens when input is parsed as code rather than data. The SQL parser breaks queries into an Abstract Syntax Tree (AST). User input containing punctuation alters the tokens and branches of this tree.',
          'By supplying quotes, attackers exit the string literal node and inject boolean evaluation operators (`OR`, `AND`) or comments (`--`) that neutralize subsequent syntax.'
        ],
        visualConcept: 'SQL Parser AST Diagram showing how input transforms a string constant node into a logical condition node.',
        safeDemoCode: `// Demonstration of parameterization in SQLite
const stmt = db.prepare('SELECT * FROM accounts WHERE user_id = ?');
// The parameter "?" is bound to the executed AST node as data only
const account = stmt.get(userId);`,
        keyTakeaways: [
          'Parameterized queries separate query logic from query data.',
          'ORMs can still be vulnerable if raw query methods (`db.raw`, `entityManager.query`) are improperly used.',
          'Input validation and character escaping are secondary defenses; parameterization is primary.'
        ],
        miniChallenge: {
          question: 'Why are parameterized queries immune to SQL injection attacks?',
          options: [
            'They encrypt user inputs with AES-256 before sending them to the database.',
            'The database pre-compiles the query AST structure before binding parameters as literal data values.',
            'They filter out all quote characters on the client side.',
            'They run SQL inside an isolated sandbox container for every query.'
          ],
          correctAnswer: 1,
          explanation: 'With prepared statements, the database engine compiles the SQL execution tree first. Parameter inputs are subsequently treated strictly as literal data values, incapable of changing the syntax structure.'
        },
        completed: true
      },
      {
        id: 'les-app-2',
        title: 'Cross-Site Scripting (XSS) & Browser DOM Sinks',
        estimatedMinutes: 20,
        theory: [
          'Modern web applications manipulate the DOM dynamically. When untrusted input is passed to dangerous DOM "sinks" like `innerHTML`, `outerHTML`, or `eval`, the browser HTML parser executes script payloads.',
          'Reflected XSS occurs immediately when input in the HTTP request is echoed in the response. Stored XSS persists inside database records and executes for every visitor viewing that record.'
        ],
        visualConcept: 'DOM XSS Flow: Untrusted Source (location.search / URL param) -> Execution Sink (element.innerHTML) -> Execution.',
        safeDemoCode: `// Safe vs Unsafe DOM Sinks
// ❌ Dangerous:
container.innerHTML = userInput;

// ✅ Safe:
container.textContent = userInput;`,
        keyTakeaways: [
          'Differentiate between HTML body context, attribute context, and JavaScript context encoding.',
          'Use `textContent` rather than `innerHTML` when rendering user strings.',
          'Deploy Content Security Policy (CSP) headers as defense-in-depth.'
        ],
        miniChallenge: {
          question: 'Which of the following is considered a dangerous DOM sink in client-side JavaScript?',
          options: [
            'document.getElementById()',
            'element.textContent',
            'element.innerHTML',
            'console.log()'
          ],
          correctAnswer: 2,
          explanation: 'element.innerHTML passes strings directly to the browser HTML/XML parser, which will interpret and execute embedded script and event handlers.'
        },
        completed: true
      },
      {
        id: 'les-app-3',
        title: 'Broken Access Control & Insecure Direct Object References (IDOR)',
        estimatedMinutes: 20,
        theory: [
          'Broken Access Control has risen to the #1 vulnerability on the OWASP Top 10. It occurs when authorization checks are either completely missing or inconsistently applied across endpoints.',
          'In an IDOR attack, an attacker alters an object identifier in a request to access records owned by another user without the server verifying permissions.'
        ],
        visualConcept: 'Authorization filter sequence verifying both JWT token authenticity and row-level ownership in the persistence layer.',
        safeDemoCode: `// Row-Level Access Control Check
async function getOrder(orderId, authenticatedUserId) {
  const order = await db.orders.findOne({
    where: { id: orderId, userId: authenticatedUserId }
  });
  if (!order) throw new UnauthorizedError();
  return order;
}`,
        keyTakeaways: [
          'Never rely on obfuscation or sequential integer IDs for authorization security.',
          'Check permissions on EVERY request at the database or controller layer.',
          'Deny access by default; enforce explicit allow policies.'
        ],
        miniChallenge: {
          question: 'Which security principle prevents a user from accessing another user\'s resources by modifying numeric identifiers?',
          options: [
            'Row-level Authorization / Proper Access Control',
            'Transport Layer Security (TLS)',
            'Input Masking',
            'Cross-Origin Resource Sharing (CORS)'
          ],
          correctAnswer: 0,
          explanation: 'Row-level authorization ensures that the querying user\'s identity is verified against the owner of the requested record before data is returned.'
        },
        completed: false
      }
    ]
  },
  {
    id: 'mod-def-sec',
    title: 'DEFENSIVE SECURITY & SECURE ARCHITECTURE',
    category: 'DEFENSIVE SECURITY',
    description: 'Learn industry-standard hardening techniques, security headers, defense-in-depth, and secure coding practices.',
    badgeName: 'Defensive Architect',
    accentColor: '#a855f7',
    lessons: [
      {
        id: 'les-def-1',
        title: 'Secure Coding Principles & Defense-in-Depth',
        estimatedMinutes: 20,
        theory: [
          'Defense-in-depth is the practice of layering multiple security controls throughout an IT system. If one defense layer fails, secondary controls prevent compromise.',
          'Core secure coding tenets include: Least Privilege, Fail Securely, Complete Mediation, Open Design, Separation of Duties, and Economy of Mechanism.'
        ],
        visualConcept: 'Layered defense concentric circles: Edge (Cloudflare/WAF) -> Gateway (Rate Limiting/Auth) -> Application (Validation) -> Data (Encryption & Row-level RBAC).',
        safeDemoCode: `// Example: Fail Securely
function verifyUserPermission(user, resource) {
  try {
    return policyEngine.canAccess(user, resource);
  } catch (error) {
    // Fail closed (deny access), never fail open!
    logger.error('Policy evaluation failed', error);
    return false;
  }
}`,
        keyTakeaways: [
          'Always fail securely: if an error or exception occurs, access should be denied.',
          'Never roll custom cryptography; utilize vetted libraries like libsodium or WebCrypto.',
          'Keep your dependencies updated using automated software composition analysis (SCA).'
        ],
        miniChallenge: {
          question: 'What does the "Fail Securely" principle dictate when an access control verification encounters an unexpected runtime error?',
          options: [
            'Grant access to avoid disrupting user experience.',
            'Deny access by default and log the anomaly.',
            'Redirect the user to the registration page.',
            'Prompt the user for their plain text password.'
          ],
          correctAnswer: 1,
          explanation: 'The principle of failing securely requires that systems deny access by default whenever a failure, exception, or undefined state occurs.'
        },
        completed: false
      },
      {
        id: 'les-def-2',
        title: 'HTTP Security Headers (CSP, HSTS, X-Frame-Options)',
        estimatedMinutes: 20,
        theory: [
          'HTTP Security Headers instruct browser clients how to interact safely with site resources, preventing attacks like Clickjacking, MIME sniffing, and script injection.',
          'Content Security Policy (CSP) is one of the most powerful client-side defenses, restricting the domains from which scripts, styles, and images can be fetched or executed.'
        ],
        visualConcept: 'Browser Security Policy Enforcement Engine evaluating response headers before rendering DOM content.',
        safeDemoCode: `// Recommended Production Security Headers
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin`,
        keyTakeaways: [
          'CSP blocks execution of unauthorized inline scripts and untrusted script sources.',
          'X-Frame-Options: DENY prevents the webpage from being embedded in an iframe (Clickjacking defense).',
          'X-Content-Type-Options: nosniff prevents the browser from guessing MIME types.'
        ],
        miniChallenge: {
          question: 'Which HTTP header prevents your website from being framed inside another website to stop Clickjacking attacks?',
          options: [
            'X-Frame-Options (or CSP frame-ancestors)',
            'Access-Control-Allow-Methods',
            'Cache-Control',
            'Server-Timing'
          ],
          correctAnswer: 0,
          explanation: 'X-Frame-Options: DENY or SAMEORIGIN (and Content-Security-Policy frame-ancestors) instructs browsers never to render the page inside a `<frame>`, `<iframe>`, or `<object>`.'
        },
        completed: false
      },
      {
        id: 'les-def-3',
        title: 'Security Logging, Monitoring & Audit Trails',
        estimatedMinutes: 15,
        theory: [
          'Without comprehensive audit logging, organizations cannot detect active intrusions, establish forensic timelines, or prove compliance during security incidents.',
          'Crucially, logs must never contain sensitive data such as plain text passwords, full credit card numbers, or cryptographic secret keys.'
        ],
        visualConcept: 'Centralized SIEM Pipeline: Application Logs -> Sanitization Pipeline -> SIEM (Elasticsearch/Splunk) -> Alerting Rules.',
        safeDemoCode: `// Safe Structured Audit Logging
function logAuditEvent(eventType, userId, status, metadata = {}) {
  // Redact sensitive keys
  const safeMeta = sanitizeLogData(metadata, ['password', 'token', 'creditCard']);
  logger.info({
    timestamp: new Date().toISOString(),
    eventType,
    userId,
    status,
    ip: hashIpForPrivacy(req.ip),
    meta: safeMeta
  });
}`,
        keyTakeaways: [
          'Log security-relevant events: failed logins, privilege changes, password resets, and access violations.',
          'Sanitize log payloads to prevent Log Injection and sensitive credential leakage.',
          'Store logs in append-only write-once-read-many (WORM) storage.'
        ],
        miniChallenge: {
          question: 'What information must NEVER be written to application security logs?',
          options: [
            'HTTP request method and URI',
            'Plaintext passwords, API secrets, and unmasked credit card numbers',
            'User role and timestamp',
            'Client IP address and user agent'
          ],
          correctAnswer: 1,
          explanation: 'Logging plaintext passwords or cryptographic keys creates severe compliance and data breach vulnerabilities if log repositories are accessed.'
        },
        completed: false
      }
    ]
  }
];
