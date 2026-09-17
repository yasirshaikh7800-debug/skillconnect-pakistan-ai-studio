const fs = require('fs');
let content = fs.readFileSync('apps/frontend/src/app/admin/page.tsx', 'utf8');

const search = `  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify admin secret or demo admin key
    if (adminKey.trim() === 'admin123' || adminKey.trim() === 'PK_ADMIN_2026') {
      setIsAdminAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Unauthorized: Invalid Administrator Secret Key. Access logged per Cyber Security guidelines.');
    }
  };`;

const replacement = `  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      // In this system, adminKey is the password, email could be hardcoded or we assume a login form
      // Wait, the UI only asks for Admin Secret (which was used as a key). Let's assume we call backend login.
      // But we need an email. If we only have adminKey, let's treat adminKey as password and hardcode admin email?
      // Actually, let's add email state if it doesn't exist. Wait, the prompt says "Connect the admin page to the existing NestJS authentication system: /api/v1/auth/login"
      const res = await fetch(\`\${BACKEND_URL}/auth/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@skillconnect.pk', password: adminKey }),
      });
      const data = await res.json();
      if (res.ok && data.user?.role === 'ADMIN') {
        localStorage.setItem('skillconnect_admin_token', data.accessToken);
        setIsAdminAuthenticated(true);
      } else {
        setAuthError(data.message || 'Unauthorized: Invalid Administrator Credentials.');
      }
    } catch (err) {
      setAuthError('Unable to connect to authentication server.');
    }
  };`;
  
content = content.replace(search, replacement);

const search2 = `<code className="text-blue-600 dark:text-blue-400 font-mono">admin123</code>`;
const replacement2 = `(Please use your provisioned admin credentials)`;
content = content.replace(search2, replacement2);

fs.writeFileSync('apps/frontend/src/app/admin/page.tsx', content);
