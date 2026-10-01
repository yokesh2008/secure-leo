import { Lab } from '../types';

export const LABS_DATA: Lab[] = [
  {
    id: 'lab-sql-01',
    slug: 'sql-injection-lab',
    title: 'SQL Injection Authentication Bypass',
    category: 'Injection',
    difficulty: 'Intermediate',
    technology: 'Node.js / SQLite',
    points: 150,
    estimatedMinutes: 25,
    isAvailable: true,
    isCompleted: true,
    briefDescription: 'Bypass database authentication logic and dump hidden records using tautology queries and comment syntax.',
    fullDescription: 'In this isolated laboratory, you will examine a fictional shopping portal (`shop.secureleo.local`) where login queries are assembled via direct string interpolation. You will observe how unescaped metacharacters manipulate SQL AST parsing and learn how parameterized queries completely mitigate the risk.',
    learningObjectives: [
      'Understand how dynamic string concatenation in SQL queries leads to syntax manipulation.',
      'Analyze the tautology condition (`\' OR 1=1 --`) and comment delimiter semantics.',
      'Observe simulated database AST execution in real time.',
      'Implement and verify prepared statements (parameterized queries) using Node.js SQLite driver.',
      'Draft a responsible vulnerability report with impact assessment.'
    ],
    tasks: [
      { id: 'task-sql-1', text: 'Navigate to the Leo Shop Login modal in the Demo Application.', completed: true, hint: 'Click the "Account" or "Sign In" button in the center demo app.' },
      { id: 'task-sql-2', text: 'Input standard credentials and observe the raw HTTP Request in the Right Panel.', completed: true, hint: 'Try user: "guest@example.com", pass: "guest123".' },
      { id: 'task-sql-3', text: 'Execute a boolean tautology payload (`admin\' OR \'1\'=\'1` or `admin\' --`) to bypass authentication.', completed: true, hint: 'Use single quote to close the string literal, followed by a comment delimiter.' },
      { id: 'task-sql-4', text: 'Observe the Security Observation panel for detected SQL anomalies.', completed: true, hint: 'Check the "SECURITY EVENTS" tab in the right-hand panel.' },
      { id: 'task-sql-5', text: 'Review the Remediation diff comparing dynamic SQL vs parameterized queries.', completed: false, hint: 'Advance the timeline workflow to "REMEDIATE".' },
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Look closely at the SQL query generated: `SELECT * FROM users WHERE email = \'${input}\' AND password = \'...\'`. What happens when the input contains a single quote?', unlocked: true },
      { level: 2, costXp: 10, content: 'The `--` or `/*` symbol in SQLite comments out the remainder of the query, ignoring the password check completely.', unlocked: true },
      { level: 3, costXp: 20, content: 'Entering `admin\' --` into the email field causes the query to execute as `SELECT * FROM users WHERE email = \'admin\' -- AND password = ...`, returning the admin record!', unlocked: true },
    ],
    demoAppUrl: 'https://shop.secureleo.local/auth',
    demoAppTitle: 'LEO SHOP — E-Commerce Portal',
    targetEndpoint: 'POST /api/v1/auth/login',
    workflowStage: 'remediate',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: String concatenation allows arbitrary SQL injection
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT id, email, role FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  
  // Directly executing unsanitized raw query string
  const user = await db.raw(query);
  if (user) {
    return res.json({ status: 'authenticated', user });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});`,
      secure: `// SECURE: Prepared statement with parameterized placeholders
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Database driver treats parameters strictly as literal values, never executable SQL
  const query = "SELECT id, email, role, password_hash FROM users WHERE email = ?";
  const user = await db.get(query, [email]);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Secure constant-time password hash verification
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  return res.json({ status: 'authenticated', user: { id: user.id, email: user.email, role: user.role } });
});`,
      explanation: 'Prepared statements guarantee that the database engine treats all user inputs strictly as typed literal data rather than executable SQL syntax commands, regardless of what characters or quotes are supplied.'
    }
  },
  {
    id: 'lab-xss-02',
    slug: 'reflected-xss-lab',
    title: 'Reflected Cross-Site Scripting (XSS)',
    category: 'Client-Side Security',
    difficulty: 'Beginner',
    technology: 'JavaScript / DOM API',
    points: 100,
    estimatedMinutes: 20,
    isAvailable: true,
    isCompleted: true,
    briefDescription: 'Discover unsanitized search reflection in the DOM and understand browser context escaping and CSP.',
    fullDescription: 'In this lab, you will explore how an e-commerce search query parameter (`/catalog?q=...`) is reflected directly into an unescaped HTML element via `element.innerHTML`. You will simulate safe execution of non-destructive script triggers and implement Context-Aware Output Encoding and Content Security Policy (CSP).',
    learningObjectives: [
      'Differentiate between Reflected, Stored, and DOM-based Cross-Site Scripting.',
      'Analyze how user inputs break out of HTML attributes and elements.',
      'Inspect simulated DOM sanitization flaws in real time.',
      'Apply Content Security Policy (CSP) headers to restrict script execution origins.',
      'Implement DOMPurify and context-aware HTML entity encoding.'
    ],
    tasks: [
      { id: 'task-xss-1', text: 'Locate the Product Search Bar in the Leo Shop center demo window.', completed: true, hint: 'Search is located at the top of the Leo Shop catalog.' },
      { id: 'task-xss-2', text: 'Enter benign input (e.g. "Laptop") and inspect the resulting URL query and rendered HTML.', completed: true, hint: 'Notice the text "Showing results for: Laptop" in the page.' },
      { id: 'task-xss-3', text: 'Inject an HTML event breakout payload: `<img src=x onerror="alert(1)">` or `<script>`.', completed: true, hint: 'The input is passed to innerHTML without sanitization.' },
      { id: 'task-xss-4', text: 'Observe the simulated DOM event trigger in the Security Observation panel.', completed: true, hint: 'Check the "SECURITY EVENTS" tab in the right panel.' },
      { id: 'task-xss-5', text: 'Review the secure coding remediation using `textContent` and DOMPurify.', completed: false, hint: 'Advance the timeline workflow to "REMEDIATE".' },
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Check how the search query is placed in the DOM. Is it using innerText/textContent or innerHTML?', unlocked: true },
      { level: 2, costXp: 10, content: 'Standard `<script>` tags inserted via innerHTML may be ignored by modern browsers, but `<img src="invalid" onerror="...">` or `<svg onload="...">` execute immediately.', unlocked: true },
      { level: 3, costXp: 20, content: 'Try typing `<img src="x" onerror="console.log(1)">` into the search box. The lab detects this injection and triggers an interactive event log.', unlocked: true },
    ],
    demoAppUrl: 'https://shop.secureleo.local/catalog',
    demoAppTitle: 'LEO SHOP — Catalog & Search',
    targetEndpoint: 'GET /catalog?search=',
    workflowStage: 'test',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: Direct insertion of raw user query into innerHTML
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('search');

// Dangerous DOM sink allows arbitrary script injection
const resultsHeader = document.getElementById('search-results');
resultsHeader.innerHTML = "<h3>Results for: " + query + "</h3>";`,
      secure: `// SECURE: Safe DOM assignment using textContent or DOMPurify
import DOMPurify from 'dompurify';

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('search') || '';

// Method 1: Using textContent treats all strings strictly as plain text
const resultsHeader = document.getElementById('search-results');
const titleSpan = document.createElement('span');
titleSpan.textContent = query; // Browser escapes all HTML entities automatically
resultsHeader.replaceChildren(document.createTextNode('Results for: '), titleSpan);

// Method 2 (if HTML rendering is required): Sanitize strictly
// resultsHeader.innerHTML = DOMPurify.sanitize(query, { ALLOWED_TAGS: ['b', 'i'] });`,
      explanation: 'Using textContent ensures that characters like `<` and `>` are interpreted solely as printable characters rather than markup delimiters, eliminating script execution.'
    }
  },
  {
    id: 'lab-idor-03',
    slug: 'idor-lab',
    title: 'Insecure Direct Object Reference (IDOR)',
    category: 'Access Control',
    difficulty: 'Intermediate',
    technology: 'REST API / JWT',
    points: 175,
    estimatedMinutes: 25,
    isAvailable: true,
    isCompleted: false,
    briefDescription: 'Manipulate resource identifiers in order and profile endpoints to access unauthorized user invoices.',
    fullDescription: 'In this lab, you analyze a REST API endpoint (`GET /api/v1/orders/101`) that exposes order invoices and receipt information based solely on an incremental numeric identifier in the URL path, without verifying session ownership.',
    learningObjectives: [
      'Understand the difference between Authentication (who you are) and Authorization (what you can access).',
      'Identify horizontal privilege escalation vectors via numeric resource identifiers.',
      'Inspect simulated JWT authorization headers and user claims.',
      'Implement row-level access control filters enforcing tenant/owner validation.',
      'Generate a standardized bug bounty report documenting the access control flaw.'
    ],
    tasks: [
      { id: 'task-idor-1', text: 'Open the "Orders & Invoices" tab in the Leo Shop demo portal.', completed: false, hint: 'Log in as the default user to view your order history.' },
      { id: 'task-idor-2', text: 'Inspect the outgoing GET request for order invoice #101 in the Right Panel.', completed: false, hint: 'Observe the parameter `orderId=101` in the request viewer.' },
      { id: 'task-idor-3', text: 'Modify the order parameter to request invoice #102 or #103 belonging to another tenant.', completed: false, hint: 'Use the interactive parameter modifier in the Demo App or Request tab.' },
      { id: 'task-idor-4', text: 'Observe the simulated server response leaking sensitive billing information.', completed: false, hint: 'Check the RESPONSE panel for customer name, address, and total.' },
      { id: 'task-idor-5', text: 'Analyze the secure coding solution enforcing session identity checks in the SQL query.', completed: false, hint: 'View the remediation tab diff.' },
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Look at the URL in the order viewer: `/api/v1/orders/101`. Can you change that number?', unlocked: false },
      { level: 2, costXp: 10, content: 'The server trusts the client-supplied ID without comparing it against the authenticated user\'s token session.', unlocked: false },
      { level: 3, costXp: 20, content: 'Requesting order ID 102 will display the invoice of "CEO Sarah Vance", including private financial details.', unlocked: false },
    ],
    demoAppUrl: 'https://shop.secureleo.local/orders',
    demoAppTitle: 'LEO SHOP — Orders & Invoices',
    targetEndpoint: 'GET /api/v1/orders/{orderId}',
    workflowStage: 'discover',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: Direct object lookup without validating authenticated owner
app.get('/api/v1/orders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  
  // Fetches order strictly by orderId without checking req.user.id!
  const order = await db.orders.findByPk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  // Leaks other users' confidential invoice data
  return res.json(order);
});`,
      secure: `// SECURE: Enforces tenant/owner validation at query layer
app.get('/api/v1/orders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const currentUserId = req.user.id; // Extracted securely from verified JWT
  
  // Query binds BOTH the resource ID and the authenticated user's ID
  const order = await db.orders.findOne({
    where: {
      id: orderId,
      userId: currentUserId // Enforces strict row-level authorization
    }
  });
  
  if (!order) {
    // Return 404 to prevent resource existence enumeration
    return res.status(404).json({ error: 'Order not found or unauthorized' });
  }
  
  return res.json(order);
});`,
      explanation: 'Always enforce authorization at the database layer by combining the resource identifier with the verified identity of the logged-in user retrieved from the authenticated session context.'
    }
  },
  {
    id: 'lab-auth-04',
    slug: 'authentication-lab',
    title: 'Broken Authentication & Password Reset',
    category: 'Authentication',
    difficulty: 'Beginner',
    technology: 'Node.js / Express',
    points: 100,
    estimatedMinutes: 20,
    isAvailable: true,
    isCompleted: false,
    briefDescription: 'Exploit predictable password reset tokens and flawed session invalidation upon credential changes.',
    fullDescription: 'Examine a password reset flow that generates weak, timestamp-derived pseudo-random reset tokens without rate limiting, allowing account takeover of simulated employee accounts.',
    learningObjectives: [
      'Understand entropy requirements for cryptographically secure random tokens.',
      'Analyze the dangers of predictable pseudo-random number generators (PRNGs).',
      'Learn proper token expiration, single-use invalidation, and rate limiting.',
      'Implement `crypto.randomBytes` for secure token generation.'
    ],
    tasks: [
      { id: 'task-auth-1', text: 'Open the "Forgot Password" modal in the Leo Shop portal.', completed: false },
      { id: 'task-auth-2', text: 'Request a password reset for target user "admin@secureleo.local".', completed: false },
      { id: 'task-auth-3', text: 'Analyze the token structure in the simulated email / response log.', completed: false },
      { id: 'task-auth-4', text: 'Verify how CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) fixes the token predictability.', completed: false }
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Examine the format of the reset token: it is a Base64-encoded timestamp with minimal entropy.', unlocked: false },
      { level: 2, costXp: 10, content: 'Because the generation uses Date.now() + Math.random(), tokens generated in the same second are trivial to guess.', unlocked: false },
      { level: 3, costXp: 20, content: 'Use the simulated attack preview button to witness the token collision.', unlocked: false }
    ],
    demoAppUrl: 'https://shop.secureleo.local/reset-password',
    demoAppTitle: 'LEO SHOP — Account Recovery',
    targetEndpoint: 'POST /api/v1/auth/reset-password',
    workflowStage: 'discover',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: Predictable PRNG based on timestamp
function generateResetToken(email) {
  // Math.random() is NOT cryptographically secure
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return Buffer.from(email + ':' + timestamp + ':' + randomSuffix).toString('hex');
}`,
      secure: `// SECURE: High-entropy CSPRNG with hash-at-rest storage
import crypto from 'crypto';

function generateSecureResetToken() {
  // 32 bytes of cryptographically secure random data (256 bits of entropy)
  const rawToken = crypto.randomBytes(32).toString('hex');
  
  // Store only the SHA-256 hash in the database, send rawToken to user
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry
  
  return { rawToken, tokenHash, expiresAt };
}`,
      explanation: 'Always use crypto.randomBytes() for session IDs and reset tokens, and store their hashes in the database to protect against token leakage during database breaches.'
    }
  },
  {
    id: 'lab-csrf-05',
    slug: 'csrf-lab',
    title: 'Cross-Site Request Forgery (CSRF)',
    category: 'Web Security',
    difficulty: 'Intermediate',
    technology: 'HTML / SameSite Cookies',
    points: 150,
    estimatedMinutes: 25,
    isAvailable: true,
    isCompleted: false,
    briefDescription: 'Simulate state-changing requests executed by an unauthorized third-party site against an authenticated session.',
    fullDescription: 'In this lab, you simulate a malicious third-party site (`attacker.local`) executing an automated fund/email transfer against `shop.secureleo.local` due to missing CSRF tokens and permissive `SameSite=None` cookie flags.',
    learningObjectives: [
      'Understand how browsers automatically attach session cookies to cross-origin requests.',
      'Explore state-changing GET/POST endpoints without anti-CSRF protections.',
      'Evaluate `SameSite=Lax` and `SameSite=Strict` cookie policies.',
      'Implement the Synchronizer Token Pattern or Double Submit Cookie pattern.'
    ],
    tasks: [
      { id: 'task-csrf-1', text: 'Log in to Leo Shop with the pre-authenticated user session.', completed: false },
      { id: 'task-csrf-2', text: 'Inspect the "Update Email" endpoint parameters and request headers.', completed: false },
      { id: 'task-csrf-3', text: 'Trigger the simulated third-party malicious exploit payload page.', completed: false },
      { id: 'task-csrf-4', text: 'Observe how the victim browser submitted the change without user consent.', completed: false },
      { id: 'task-csrf-5', text: 'Remediate by adding anti-CSRF token verification and SameSite cookie flags.', completed: false }
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Notice that the `/api/user/email` endpoint accepts POST requests without any custom headers or tokens.', unlocked: false },
      { level: 2, costXp: 10, content: 'The session cookie lacks the `SameSite` attribute, allowing cross-site requests from another tab.', unlocked: false },
      { level: 3, costXp: 20, content: 'Using `SameSite=Lax` prevents cookies from being sent on cross-origin POST requests.', unlocked: false }
    ],
    demoAppUrl: 'https://shop.secureleo.local/settings',
    demoAppTitle: 'LEO SHOP — Account Settings',
    targetEndpoint: 'POST /api/v1/user/update-email',
    workflowStage: 'discover',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: Relies strictly on ambient session cookies
app.post('/api/v1/user/update-email', authenticateCookie, (req, res) => {
  const { newEmail } = req.body;
  // Browser automatically sent the cookie, even when request originated from evil.com!
  db.updateUserEmail(req.user.id, newEmail);
  return res.json({ status: 'email_updated', newEmail });
});`,
      secure: `// SECURE: Anti-CSRF Token Validation & SameSite Cookie Attribute
import csurf from 'csurf';
const csrfProtection = csurf({ cookie: true });

// 1. Enforce SameSite=Lax or Strict on all authentication cookies
app.use(session({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' // Blocks cross-origin POST requests from attaching cookie
  }
}));

// 2. Validate custom Anti-CSRF Synchronizer Token on all state-changing endpoints
app.post('/api/v1/user/update-email', csrfProtection, (req, res) => {
  const { newEmail } = req.body;
  db.updateUserEmail(req.user.id, newEmail);
  return res.json({ status: 'email_updated', newEmail });
});`,
      explanation: 'Combine SameSite=Lax cookies with Cryptographic Synchronizer Tokens (CSRF tokens) in forms and AJAX requests to guarantee origin verification.'
    }
  },
  {
    id: 'lab-upload-06',
    slug: 'file-upload-security-lab',
    title: 'Unrestricted File Upload & Extension Bypass',
    category: 'Input Validation',
    difficulty: 'Advanced',
    technology: 'Node.js / Multer / Storage',
    points: 250,
    estimatedMinutes: 30,
    isAvailable: true,
    isCompleted: false,
    briefDescription: 'Bypass naive client-side file extension checks and examine server-side magic byte validation.',
    fullDescription: 'Analyze an avatar upload interface that only verifies file extensions on the client side (`.jpg`, `.png`), allowing attackers to upload polyglot files or executable scripts into a web-accessible folder.',
    learningObjectives: [
      'Understand risks of arbitrary file upload in web-accessible storage roots.',
      'Differentiate between client-side validation, MIME-type headers, and true magic byte headers.',
      'Analyze extension blacklist bypasses (e.g. `.php5`, `.phtml`, double extensions).',
      'Implement file name randomization, secure MIME verification, and private cloud bucket storage.'
    ],
    tasks: [
      { id: 'task-upload-1', text: 'Navigate to the Profile Avatar Upload interface.', completed: false },
      { id: 'task-upload-2', text: 'Attempt uploading a benign image (`profile.png`) and view storage headers.', completed: false },
      { id: 'task-upload-3', text: 'Test a file with multiple extensions (`exploit.php.png`) or disguised MIME type.', completed: false },
      { id: 'task-upload-4', text: 'Observe how the server inspects or fails to inspect file signatures (magic bytes).', completed: false },
      { id: 'task-upload-5', text: 'Implement content-based file verification using magic-number buffers.', completed: false }
    ],
    hints: [
      { level: 1, costXp: 0, content: 'Inspect the browser JavaScript that validates the file: it checks filename.endsWith(".png"). Can that be bypassed in proxy/inspector?', unlocked: false },
      { level: 2, costXp: 10, content: 'Checking only req.headers["content-type"] is unsafe because the client controls this header.', unlocked: false },
      { level: 3, costXp: 20, content: 'Real security requires reading the initial bytes of the file buffer (e.g. PNG signature is 89 50 4E 47 0D 0A 1A 0A).', unlocked: false }
    ],
    demoAppUrl: 'https://shop.secureleo.local/profile/upload',
    demoAppTitle: 'LEO SHOP — Avatar Upload',
    targetEndpoint: 'POST /api/v1/profile/avatar',
    workflowStage: 'discover',
    remediationCode: {
      language: 'javascript',
      vulnerable: `// VULNERABLE: Relies on original client filename and content-type header
const upload = multer({ dest: './public/uploads/' });

app.post('/api/v1/profile/avatar', upload.single('avatar'), (req, res) => {
  // Vulnerability: Kept user's filename and placed directly in web root
  const targetPath = './public/uploads/' + req.file.originalname;
  fs.renameSync(req.file.path, targetPath);
  
  // Directly executable via http://server/uploads/shell.php
  return res.json({ url: '/uploads/' + req.file.originalname });
});`,
      secure: `// SECURE: File signature (magic bytes) validation + UUID renaming + off-root storage
import fileType from 'file-type';
import crypto from 'crypto';

app.post('/api/v1/profile/avatar', upload.memoryStorage(), async (req, res) => {
  const buffer = req.file.buffer;
  
  // 1. Inspect actual file header magic bytes, not file extension or client MIME
  const type = await fileType.fromBuffer(buffer);
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!type || !ALLOWED_TYPES.includes(type.mime)) {
    return res.status(400).json({ error: 'Disallowed file type detected.' });
  }
  
  // 2. Generate random UUID filename - NEVER preserve user-supplied names
  const safeFilename = crypto.randomUUID() + '.' + type.ext;
  
  // 3. Store outside web root or upload to isolated object storage (S3/GCS bucket)
  await uploadToPrivateStorage(safeFilename, buffer);
  
  return res.json({ status: 'uploaded', fileId: safeFilename });
});`,
      explanation: 'Never trust user-supplied filenames or client MIME headers. Always validate file binary signatures (magic bytes), generate random filenames, and store uploaded files outside web-executable directories.'
    }
  }
];
