import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    topic: 'Access Control',
    difficulty: 'Intermediate',
    question: 'Which security principle prevents a user from accessing another user\'s private invoices by simply manipulating the numeric ID parameter in the URL?',
    options: [
      'Input Masking & Captcha verification',
      'Row-level Authorization / Server-Side Ownership Validation',
      'Client-side URL encoding with Base64',
      'Configuring DNS over HTTPS (DoH)'
    ],
    correctAnswer: 1,
    explanation: 'Row-level authorization ensures that the querying user\'s authenticated session identity is checked against the owner field of the requested record at the database/API controller layer before serving data.'
  },
  {
    id: 'q-2',
    topic: 'Injection',
    difficulty: 'Beginner',
    question: 'Why are parameterized queries (prepared statements) considered the primary defense against SQL Injection?',
    options: [
      'They encrypt the database query in memory using asymmetric RSA keys.',
      'The database engine pre-compiles the query syntax plan before treating user inputs strictly as literal data values.',
      'They reject any request originating from an IP address outside the local subnet.',
      'They convert all uppercase letters into lowercase before query execution.'
    ],
    correctAnswer: 1,
    explanation: 'Prepared statements guarantee that the database engine parses and compiles the query AST beforehand. User inputs are treated solely as literal scalar values, making it impossible for metacharacters to modify query structure.'
  },
  {
    id: 'q-3',
    topic: 'Client-Side Security',
    difficulty: 'Beginner',
    question: 'Which browser property or DOM API should developers use instead of innerHTML to safely render untrusted user text strings?',
    options: [
      'element.documentWrite',
      'element.outerHTML',
      'element.textContent',
      'window.eval'
    ],
    correctAnswer: 2,
    explanation: '`textContent` inserts strings purely as text nodes within the DOM. The browser does not parse the content for HTML markup or `<script>` tags, naturally neutralizing script execution.'
  },
  {
    id: 'q-4',
    topic: 'Web Security',
    difficulty: 'Intermediate',
    question: 'How does configuring the `SameSite=Lax` or `Strict` cookie attribute mitigate Cross-Site Request Forgery (CSRF)?',
    options: [
      'It restricts cookie access exclusively to localhost during development.',
      'It instructs browsers to omit the cookie on cross-site requests, preventing third-party sites from executing authenticated actions.',
      'It hides the cookie value inside the HTTP response body.',
      'It requires the user to input a one-time password before every HTTP GET.'
    ],
    correctAnswer: 1,
    explanation: 'The `SameSite` attribute controls whether cookies are sent with cross-site requests. With `Lax` or `Strict`, the browser withholds the authentication cookie on cross-origin POST or state-changing requests triggered by external sites.'
  },
  {
    id: 'q-5',
    topic: 'Authentication',
    difficulty: 'Intermediate',
    question: 'Which of the following functions should NEVER be used to generate password reset tokens or session keys in Node.js?',
    options: [
      'crypto.randomBytes(32)',
      'Math.random()',
      'crypto.getRandomValues()',
      'crypto.generateKeySync()'
    ],
    correctAnswer: 1,
    explanation: '`Math.random()` is a deterministic pseudo-random number generator (PRNG) with low entropy, making its outputs predictable. Cryptographic secrets must always be generated via CSPRNG functions like `crypto.randomBytes`.'
  },
  {
    id: 'q-6',
    topic: 'Input Validation',
    difficulty: 'Advanced',
    question: 'What is the most robust method to verify an uploaded file\'s authentic type before storing it on a server?',
    options: [
      'Rely exclusively on the filename extension (e.g. `.png`).',
      'Inspect the `Content-Type` header sent by the client browser.',
      'Inspect the file header signature (magic bytes) directly from the raw binary buffer.',
      'Encode the entire file into Base64 and check the string length.'
    ],
    correctAnswer: 2,
    explanation: 'Both the file extension and the HTTP `Content-Type` header are trivial for an attacker to spoof. Inspecting the initial binary magic bytes (e.g. `89 50 4E 47` for PNG) verifies the true file format.'
  },
  {
    id: 'q-7',
    topic: 'API Security',
    difficulty: 'Intermediate',
    question: 'What does BOLA stand for in the OWASP API Security Top 10?',
    options: [
      'Basic Object Level Authentication',
      'Broken Object Level Authorization',
      'Binary Output Linking Anomaly',
      'Backend Object Lookup Architecture'
    ],
    correctAnswer: 1,
    explanation: 'Broken Object Level Authorization (BOLA), equivalent to IDOR in traditional web apps, occurs when API endpoints fail to validate whether the requester owns or has access rights to the specific object identifier.'
  },
  {
    id: 'q-8',
    topic: 'Defensive Architecture',
    difficulty: 'Beginner',
    question: 'What is the purpose of the HTTP `X-Content-Type-Options: nosniff` header?',
    options: [
      'It prevents browsers from MIME-sniffing a response away from the declared content-type.',
      'It disables caching for all image assets.',
      'It encrypts JSON payloads in transit.',
      'It forces all links to open in a new browser tab.'
    ],
    correctAnswer: 0,
    explanation: '`nosniff` prevents browsers from trying to guess (mime-sniff) the executable format of a file, ensuring that stylesheets and scripts are only executed if served with the correct MIME type.'
  }
];
