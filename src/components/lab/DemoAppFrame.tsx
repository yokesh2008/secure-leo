import React, { useState } from 'react';
import { Lab, HttpInspectionLog } from '../../types';
import { ShoppingBag, Search, User, KeyRound, AlertTriangle, ArrowRight, ShieldAlert, Package, Check, RefreshCw, Upload, Lock, FileCode } from 'lucide-react';
import { useSecurityEvents } from '../../context/SecurityEventContext';
import { useNotification } from '../../context/NotificationContext';

interface DemoAppFrameProps {
  lab: Lab;
  onLogHttpRequest: (log: HttpInspectionLog) => void;
  onTaskAction?: (actionType: string) => void;
}

export const DemoAppFrame: React.FC<DemoAppFrameProps> = ({
  lab,
  onLogHttpRequest,
  onTaskAction,
}) => {
  const { logEvent } = useSecurityEvents();
  const { showToast } = useNotification();

  // Demo App Sub-routing
  const [activeTab, setActiveTab] = useState<'login' | 'search' | 'products' | 'orders' | 'upload'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin' --");
  const [loginPassword, setLoginPassword] = useState('anypassword');
  const [authSuccess, setAuthSuccess] = useState<boolean | null>(null);
  const [authResponseMsg, setAuthResponseMsg] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('<img src=x onerror=alert(1)>');
  const [reflectedHtml, setReflectedHtml] = useState<string | null>(null);
  const [xssTriggered, setXssTriggered] = useState(false);

  // Orders / IDOR state
  const [selectedOrderId, setSelectedOrderId] = useState('102');
  const [fetchedOrder, setFetchedOrder] = useState<any>(null);

  // File Upload state
  const [uploadFilename, setUploadFilename] = useState('profile-avatar.php.png');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Mock Products Catalog
  const products = [
    { id: 'prod-1', name: 'Quantum Encrypted Hardware Key', price: '$149.00', category: 'Hardware', inStock: true },
    { id: 'prod-2', name: 'Air-Gapped Cold Storage Vault', price: '$289.00', category: 'Storage', inStock: true },
    { id: 'prod-3', name: 'Faraday EMP Protection Sleeve', price: '$39.00', category: 'Accessories', inStock: true },
    { id: 'prod-4', name: 'Tactical Hardware Authenticator', price: '$85.00', category: 'Hardware', inStock: false },
  ];

  // Mock Orders Database
  const mockOrdersDatabase: Record<string, any> = {
    '101': {
      orderId: '101',
      customerName: 'Yokesh (Current User)',
      email: 'yokesh.sec@academic.edu',
      items: ['Quantum Encrypted Hardware Key x 1'],
      totalAmount: '$149.00',
      shippingAddress: 'Lab Station 4, Tech Campus',
      paymentMethod: 'Corporate Purchase Order ****-9012',
      isCurrentUser: true,
    },
    '102': {
      orderId: '102',
      customerName: 'Sarah Vance (CEO)',
      email: 's.vance@executive-secureleo.com',
      items: ['Enterprise Defense Cluster x 5', 'Private Cryptographic Node x 2'],
      totalAmount: '$48,500.00',
      shippingAddress: 'Executive Suite 800, Neo Tower',
      paymentMethod: 'Corporate Wire Transfer #WT-8942-NY',
      isCurrentUser: false,
    },
    '103': {
      orderId: '103',
      customerName: 'Dr. Marcus Holloway (Chief Scientist)',
      email: 'marcus.h@rd-secureleo.org',
      items: ['Quantum Entropy Generator Prototype x 1'],
      totalAmount: '$12,000.00',
      shippingAddress: 'Sub-Level 3 Lab, Black Mesa',
      paymentMethod: 'Defense Grant Credit Card ****-4433',
      isCurrentUser: false,
    },
  };

  // 1. Simulate SQL Injection Login Execution
  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toTimeString().split(' ')[0];
    const isSqliPayload =
      loginEmail.includes("'") ||
      loginEmail.includes('--') ||
      loginEmail.toLowerCase().includes('or 1=1') ||
      loginEmail.toLowerCase().includes('or "1"="1');

    if (isSqliPayload) {
      setAuthSuccess(true);
      setAuthResponseMsg('AUTHENTICATED AS ROOT ADMINISTRATOR (admin@secureleo.local)');

      // Emit SOC Telemetry
      logEvent('AUTH_BYPASS_ATTEMPT', 'shop.secureleo.local/auth', 'SQL Tautology injected into login query: Metacharacters parsed into execution tree.', 'critical');
      logEvent('VULNERABILITY_DETECTED', 'DATABASE-AST', `Simulated query executed: SELECT * FROM users WHERE email = '${loginEmail}' AND password = '${loginPassword}'`, 'high');
      showToast('achievement', 'SQL Injection Executed!', 'Bypassed authentication logic via boolean tautology.');

      // Log HTTP Traffic
      onLogHttpRequest({
        id: `req-${Date.now()}`,
        timestamp,
        method: 'POST',
        url: 'https://shop.secureleo.local/api/v1/auth/login',
        headers: {
          'Host': 'shop.secureleo.local',
          'Content-Type': 'application/json',
          'User-Agent': 'SecureLeo-Agent/2.4 (Simulated)',
          'Origin': 'https://shop.secureleo.local',
        },
        parameters: { email: loginEmail, password: loginPassword },
        responseStatus: 200,
        responseStatusText: 'OK',
        responseHeaders: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'auth_session=sim_admin_jwt_eyJh...; Path=/; HttpOnly=false',
          'X-Simulated-Query-Time': '4ms',
        },
        responseBody: JSON.stringify(
          {
            status: 'success',
            user: { id: 'usr_root_001', email: 'admin@secureleo.local', role: 'root_admin' },
            token: 'sim_jwt_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          null,
          2
        ),
        securityObservations: [
          '[CRITICAL] Dynamic SQL Query Concatenation: Input broke string literal boundaries.',
          '[HIGH] Missing Prepared Statement: The database driver accepted raw metacharacters.',
          '[WARN] Permissive Session Cookie: Session cookie lacks Secure and SameSite attributes.',
        ],
      });

      onTaskAction?.('sql-bypass');
    } else {
      setAuthSuccess(false);
      setAuthResponseMsg('Invalid credentials. Expected administrative injection payload.');

      onLogHttpRequest({
        id: `req-${Date.now()}`,
        timestamp,
        method: 'POST',
        url: 'https://shop.secureleo.local/api/v1/auth/login',
        headers: { 'Host': 'shop.secureleo.local', 'Content-Type': 'application/json' },
        parameters: { email: loginEmail, password: loginPassword },
        responseStatus: 401,
        responseStatusText: 'Unauthorized',
        responseHeaders: { 'Content-Type': 'application/json' },
        responseBody: JSON.stringify({ error: 'Invalid user credentials.' }, null, 2),
        securityObservations: ['[INFO] Standard authentication rejection.'],
      });
    }
  };

  // 2. Simulate Reflected XSS Search Execution
  const handleSimulatedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toTimeString().split(' ')[0];

    const hasXss =
      searchQuery.includes('<script') ||
      searchQuery.includes('onerror=') ||
      searchQuery.includes('onload=') ||
      searchQuery.includes('<img') ||
      searchQuery.includes('<svg');

    setReflectedHtml(searchQuery);

    if (hasXss) {
      setXssTriggered(true);
      logEvent('VULNERABILITY_DETECTED', 'shop.secureleo.local/catalog', `Reflected XSS payload triggered in DOM: ${searchQuery}`, 'high');
      showToast('warning', 'Reflected XSS Detected!', 'Malicious payload executed inside the isolated sandbox DOM.');
      onTaskAction?.('xss-executed');
    } else {
      setXssTriggered(false);
    }

    onLogHttpRequest({
      id: `req-${Date.now()}`,
      timestamp,
      method: 'GET',
      url: `https://shop.secureleo.local/catalog?search=${encodeURIComponent(searchQuery)}`,
      headers: {
        'Host': 'shop.secureleo.local',
        'Accept': 'text/html,application/xhtml+xml',
      },
      parameters: { search: searchQuery },
      responseStatus: 200,
      responseStatusText: 'OK',
      responseHeaders: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-XSS-Protection': '0', // Intentionally vulnerable
      },
      responseBody: `<!DOCTYPE html>\n<html>\n  <body>\n    <h2>Catalog Search Results</h2>\n    <!-- VULNERABLE REFLECTION: Unsanitized DOM innerHTML -->\n    <div id="results">Showing search query: ${searchQuery}</div>\n  </body>\n</html>`,
      securityObservations: hasXss
        ? [
            '[HIGH] Unsanitized Reflection in HTML context: Input echoed directly without HTML entity encoding.',
            '[MEDIUM] Dangerous DOM Sink: innerHTML used without DOMPurify.',
            '[HIGH] Content Security Policy (CSP) is missing: `unsafe-inline` scripts can execute.',
          ]
        : ['[INFO] Standard search request. No script metacharacters detected.'],
    });
  };

  // 3. Simulate IDOR Order Query Execution
  const handleFetchOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    const timestamp = new Date().toTimeString().split(' ')[0];
    const order = mockOrdersDatabase[orderId] || null;
    setFetchedOrder(order);

    const isUnauthorizedTenant = order && !order.isCurrentUser;

    if (isUnauthorizedTenant) {
      logEvent('VULNERABILITY_DETECTED', 'shop.secureleo.local/api/orders', `IDOR Access: Current user accessed Order #${orderId} belonging to ${order.customerName}`, 'high');
      showToast('error', 'IDOR Vulnerability Confirmed!', `Unauthorized access to private invoice for ${order.customerName}`);
      onTaskAction?.('idor-accessed');
    }

    onLogHttpRequest({
      id: `req-${Date.now()}`,
      timestamp,
      method: 'GET',
      url: `https://shop.secureleo.local/api/v1/orders/${orderId}`,
      headers: {
        'Host': 'shop.secureleo.local',
        'Authorization': 'Bearer sim_yokesh_session_token_101',
        'Accept': 'application/json',
      },
      parameters: { orderId },
      responseStatus: order ? 200 : 404,
      responseStatusText: order ? 'OK' : 'Not Found',
      responseHeaders: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      responseBody: JSON.stringify(order || { error: 'Order not found' }, null, 2),
      securityObservations: isUnauthorizedTenant
        ? [
            `[CRITICAL] Broken Object Level Authorization (BOLA): Requesting token owner (User 101) granted access to Order #${orderId} belonging to ${order.customerName}.`,
            '[HIGH] Missing Tenant Ownership Verification in controller logic.',
            '[WARN] Sensitive PII & Payment Information leaked in cleartext response.',
          ]
        : ['[INFO] Access granted to user\'s own legitimate order record.'],
    });
  };

  // 4. Simulate Arbitrary File Upload Execution
  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toTimeString().split(' ')[0];
    const isDangerousExtension =
      uploadFilename.endsWith('.php') ||
      uploadFilename.includes('.php.') ||
      uploadFilename.endsWith('.jsp') ||
      uploadFilename.endsWith('.sh');

    if (isDangerousExtension) {
      setUploadStatus(`⚠️ Exploit Stored: /uploads/${uploadFilename} (Executable in web root!)`);
      logEvent('VULNERABILITY_DETECTED', 'shop.secureleo.local/upload', `Executable file uploaded into web root: ${uploadFilename}`, 'critical');
      showToast('error', 'Arbitrary File Upload Bypass!', 'Uploaded executable file with bypassed extension filters.');
      onTaskAction?.('file-upload-bypass');
    } else {
      setUploadStatus(`File accepted: /uploads/${uploadFilename}`);
    }

    onLogHttpRequest({
      id: `req-${Date.now()}`,
      timestamp,
      method: 'POST',
      url: 'https://shop.secureleo.local/api/v1/profile/avatar',
      headers: {
        'Host': 'shop.secureleo.local',
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      },
      parameters: { filename: uploadFilename, mimeType: 'image/png' },
      responseStatus: 201,
      responseStatusText: 'Created',
      responseHeaders: { 'Content-Type': 'application/json' },
      responseBody: JSON.stringify(
        {
          status: 'success',
          fileUrl: `https://shop.secureleo.local/uploads/${uploadFilename}`,
          mimeTypeReceived: 'image/png',
          executionPermitted: isDangerousExtension,
        },
        null,
        2
      ),
      securityObservations: isDangerousExtension
        ? [
            '[CRITICAL] Arbitrary Executable File in Document Root: Server stored user file without renaming or stripping PHP extensions.',
            '[HIGH] Missing Magic Byte Signature Check: Server relied exclusively on client-supplied Content-Type.',
          ]
        : ['[INFO] Benign image uploaded.'],
    });
  };

  return (
    <div className="flex flex-col h-full bg-cyber-bg overflow-hidden">
      {/* Top Browser Sandbox Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-surface border-b border-cyber-border text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonRed/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonAmber/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-neonGreen/80 inline-block" />
          </div>
          <span className="text-cyber-textMuted ml-2 hidden sm:inline">LOCAL SANDBOX BROWSER:</span>
          <span className="text-cyber-neonCyan font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyber-neonGreen" />
            https://shop.secureleo.local
          </span>
        </div>

        {/* Big Warning Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyber-neonAmber/10 border border-cyber-neonAmber/30 text-cyber-neonAmber font-bold text-[10px] uppercase">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>INTENTIONALLY VULNERABLE DEMO</span>
        </div>
      </div>

      {/* Demo App Navigation Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-cyber-panel border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 text-cyber-neonGreen">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-cyber-textBright text-sm tracking-wider">
            LEO SHOP
          </span>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex items-center gap-1 bg-cyber-surface p-1 rounded-xl border border-cyber-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('login')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-cyber-panel text-cyber-neonGreen border border-cyber-neonGreen/40 font-bold'
                : 'text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            Login (SQLi)
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'search'
                ? 'bg-cyber-panel text-cyber-neonCyan border border-cyber-neonCyan/40 font-bold'
                : 'text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            Search (XSS)
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-cyber-panel text-cyber-neonAmber border border-cyber-neonAmber/40 font-bold'
                : 'text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            Orders (IDOR)
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-cyber-panel text-cyber-neonRed border border-cyber-neonRed/40 font-bold'
                : 'text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'products'
                ? 'bg-cyber-panel text-cyber-textBright border border-cyber-border font-bold'
                : 'text-cyber-textMuted hover:text-cyber-textBright'
            }`}
          >
            Catalog
          </button>
        </div>
      </div>

      {/* Main Demo App Content Screen */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#070b12]">
        {/* TAB 1: LOGIN (SQL Injection) */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto my-6 p-6 rounded-2xl bg-cyber-card border border-cyber-border shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-cyber-surface border border-cyber-border mb-3 text-cyber-neonGreen">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-mono text-cyber-textBright">
                Account Sign In
              </h3>
              <p className="text-xs text-cyber-textDim mt-1">
                Simulated authentication portal vulnerable to raw SQL interpolation.
              </p>
            </div>

            <form onSubmit={handleSimulatedLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyber-textDim mb-1.5">
                  Email / Username:
                </label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs focus:outline-none focus:border-cyber-neonGreen"
                  placeholder="e.g. admin' -- or user@example.com"
                />
                <span className="text-[10px] font-mono text-cyber-textMuted mt-1 block">
                  Hint payload: <code className="text-cyber-neonGreen">admin' --</code> or <code className="text-cyber-neonGreen">' OR 1=1 --</code>
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyber-textDim mb-1.5">
                  Password:
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs focus:outline-none focus:border-cyber-neonGreen"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-cyber-neonGreen/20 border border-cyber-neonGreen text-cyber-neonGreen font-mono font-bold text-xs hover:bg-cyber-neonGreen/30 transition-all shadow-glow-green"
              >
                Authenticate & Send Request
              </button>
            </form>

            {/* Auth Response Banner */}
            {authSuccess !== null && (
              <div
                className={`mt-5 p-3.5 rounded-xl border font-mono text-xs ${
                  authSuccess
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen/40 text-cyber-neonGreen'
                    : 'bg-cyber-neonRed/10 border-cyber-neonRed/40 text-cyber-neonRed'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {authSuccess ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{authSuccess ? 'SQL INJECTION SUCCESS' : 'ACCESS DENIED'}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {authResponseMsg}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEARCH (Reflected XSS) */}
        {activeTab === 'search' && (
          <div className="max-w-xl mx-auto my-4 space-y-5">
            <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border">
              <h3 className="text-sm font-bold font-mono text-cyber-textBright mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyber-neonCyan" />
                Product Catalog Search (Reflected XSS Lab)
              </h3>
              <p className="text-xs text-cyber-textDim mb-4">
                The search query parameter is placed directly into the browser DOM using <code className="text-cyber-neonCyan">innerHTML</code> without HTML escaping.
              </p>

              <form onSubmit={handleSimulatedSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs focus:outline-none focus:border-cyber-neonCyan"
                  placeholder="Enter search term or payload..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyber-neonCyan/20 border border-cyber-neonCyan text-cyber-neonCyan font-mono font-bold text-xs hover:bg-cyber-neonCyan/30 transition-all shadow-glow-cyan"
                >
                  Search
                </button>
              </form>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchQuery('<img src=x onerror=alert(1)>')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright"
                >
                  Load Image Payload
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('<script>console.log("XSS")</script>')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright"
                >
                  Load Script Tag
                </button>
              </div>
            </div>

            {/* Reflected Search Result Screen */}
            {reflectedHtml !== null && (
              <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border">
                <div className="text-xs font-mono text-cyber-textMuted uppercase mb-2">
                  Simulated Browser DOM Output:
                </div>
                <div className="p-4 rounded-xl bg-cyber-bg border border-cyber-border font-mono text-xs text-cyber-textBright">
                  <span>Results for query: </span>
                  <span className="text-cyber-neonCyan font-bold">{reflectedHtml}</span>
                </div>

                {xssTriggered && (
                  <div className="mt-4 p-4 rounded-xl bg-cyber-neonAmber/10 border border-cyber-neonAmber/40 text-cyber-neonAmber">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 animate-bounce" />
                      SIMULATED JAVASCRIPT EXECUTION TRIGGERED:
                    </div>
                    <p className="mt-1 font-mono text-xs text-cyber-textBright">
                      Execution payload: <code className="bg-cyber-bg px-2 py-0.5 rounded border border-cyber-border text-cyber-neonCyan">{reflectedHtml}</code>
                    </p>
                    <p className="mt-1 text-[11px] text-cyber-textDim">
                      In an actual attack, this would execute arbitrary client code, exfiltrate cookies, or hijack active browser sessions.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS (IDOR) */}
        {activeTab === 'orders' && (
          <div className="max-w-2xl mx-auto my-4 space-y-5">
            <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-border">
              <h3 className="text-sm font-bold font-mono text-cyber-textBright mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-cyber-neonAmber" />
                Customer Order Lookup (Insecure Direct Object Reference - IDOR)
              </h3>
              <p className="text-xs text-cyber-textDim mb-4">
                You are currently logged in as <strong className="text-cyber-textBright">YOKESH</strong> (Authorized strictly for Order #101). Modify the order ID below to test if the API enforces tenant authorization checks.
              </p>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyber-textMuted">
                  GET /api/v1/orders/
                </span>
                <select
                  value={selectedOrderId}
                  onChange={(e) => handleFetchOrder(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs focus:outline-none focus:border-cyber-neonAmber"
                >
                  <option value="101">101 (Your Order - Legitimate)</option>
                  <option value="102">102 (Sarah Vance - Unauthorized Tenant)</option>
                  <option value="103">103 (Dr. Marcus Holloway - Unauthorized Tenant)</option>
                </select>
                <button
                  onClick={() => handleFetchOrder(selectedOrderId)}
                  className="px-4 py-1.5 rounded-xl bg-cyber-neonAmber/20 border border-cyber-neonAmber text-cyber-neonAmber font-mono font-bold text-xs hover:bg-cyber-neonAmber/30 transition-all"
                >
                  Execute API Call
                </button>
              </div>
            </div>

            {/* Order Invoice Display */}
            {fetchedOrder && (
              <div
                className={`p-6 rounded-2xl border ${
                  fetchedOrder.isCurrentUser
                    ? 'bg-cyber-card border-cyber-border'
                    : 'bg-cyber-neonRed/5 border-cyber-neonRed/40 shadow-glow-red'
                }`}
              >
                {!fetchedOrder.isCurrentUser && (
                  <div className="flex items-center gap-2 p-2.5 mb-4 rounded-xl bg-cyber-neonRed/15 border border-cyber-neonRed/40 text-cyber-neonRed font-mono text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    IDOR PRIVILEGE ESCALATION: UNINTENDED ACCESS TO TENANT DATA
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-cyber-border/60 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyber-textMuted uppercase">
                      Invoice ID
                    </span>
                    <h4 className="text-base font-bold font-mono text-cyber-textBright">
                      #ORDER-{fetchedOrder.orderId}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-cyber-textMuted uppercase">
                      Billed Amount
                    </span>
                    <h4 className="text-base font-bold font-mono text-cyber-neonGreen">
                      {fetchedOrder.totalAmount}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-cyber-textMuted block text-[10px]">Customer:</span>
                    <span className="text-cyber-textBright font-semibold">
                      {fetchedOrder.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-cyber-textMuted block text-[10px]">Email:</span>
                    <span className="text-cyber-textBright">{fetchedOrder.email}</span>
                  </div>
                  <div>
                    <span className="text-cyber-textMuted block text-[10px]">Shipping Destination:</span>
                    <span className="text-cyber-textBright">{fetchedOrder.shippingAddress}</span>
                  </div>
                  <div>
                    <span className="text-cyber-textMuted block text-[10px]">Payment Method:</span>
                    <span className="text-cyber-textBright">{fetchedOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyber-border/60">
                  <span className="text-cyber-textMuted block text-[10px] font-mono mb-1">Purchased Line Items:</span>
                  <ul className="list-disc list-inside text-xs font-mono text-cyber-textBright">
                    {fetchedOrder.items.map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="max-w-md mx-auto my-4 p-6 rounded-2xl bg-cyber-card border border-cyber-border">
            <h3 className="text-sm font-bold font-mono text-cyber-textBright mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyber-neonRed" />
              Profile Avatar Upload (File Handling Lab)
            </h3>
            <p className="text-xs text-cyber-textDim mb-4">
              Client validation only verifies that filenames end in an allowed string. Test uploading polyglot extensions like <code className="text-cyber-neonCyan">avatar.php.png</code>.
            </p>

            <form onSubmit={handleSimulatedUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyber-textDim mb-1">
                  Upload Filename:
                </label>
                <input
                  type="text"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-surface border border-cyber-border text-cyber-textBright font-mono text-xs focus:outline-none focus:border-cyber-neonRed"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadFilename('exploit.php.png')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright"
                >
                  Use Polyglot
                </button>
                <button
                  type="button"
                  onClick={() => setUploadFilename('normal-photo.png')}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-cyber-textMuted hover:text-cyber-textBright"
                >
                  Use Safe PNG
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-cyber-neonRed/20 border border-cyber-neonRed text-cyber-neonRed font-mono font-bold text-xs hover:bg-cyber-neonRed/30 transition-all shadow-glow-red"
              >
                Upload to Server Root
              </button>
            </form>

            {uploadStatus && (
              <div className="mt-4 p-3 rounded-xl bg-cyber-surface border border-cyber-border font-mono text-xs text-cyber-textBright">
                {uploadStatus}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-cyber-card border border-cyber-border flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-neonCyan">
                    {p.category}
                  </span>
                  <h4 className="mt-2 text-sm font-bold font-mono text-cyber-textBright">
                    {p.name}
                  </h4>
                  <p className="text-xs font-mono text-cyber-neonGreen font-semibold mt-1">
                    {p.price}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-cyber-border/60">
                  <span className="text-[10px] font-mono text-cyber-textMuted">
                    {p.inStock ? '● IN STOCK' : '○ BACKORDER'}
                  </span>
                  <button
                    onClick={() => {
                      showToast('info', 'Item Added', `${p.name} placed in shopping cart.`);
                    }}
                    className="px-3 py-1 rounded-lg bg-cyber-surface border border-cyber-border text-[11px] font-mono text-cyber-textBright hover:border-cyber-neonGreen transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
