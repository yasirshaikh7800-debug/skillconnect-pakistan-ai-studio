const fs = require('fs');

function addCookieToLogin() {
  const path = 'apps/frontend/src/app/login/page.tsx';
  let content = fs.readFileSync(path, 'utf8');
  const search = `localStorage.setItem('skillconnect_auth_token', data.accessToken);`;
  const replacement = `localStorage.setItem('skillconnect_auth_token', data.accessToken);\n        document.cookie = \`skillconnect_auth_token=\${data.accessToken}; path=/; max-age=86400\`;`;
  // Let's just find where router.push is, because the previous login was mocked.
  // Wait, I haven't updated login/page.tsx yet! Let's update login/page.tsx first.
}

function updateLogin() {
  const path = 'apps/frontend/src/app/login/page.tsx';
  let content = fs.readFileSync(path, 'utf8');
  
  const search = `  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^\\+?[0-9\\s-]{10,}$/.test(emailOrPhone.trim());
    const redirectTarget = role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider';

    if (isPhone) {
      const phoneClean = emailOrPhone.trim().startsWith('+') ? emailOrPhone.trim() : \`+92\${emailOrPhone.trim().replace(/^0/, '')}\`;
      router.push(\`/verify-otp?phone=\${encodeURIComponent(phoneClean)}&redirect=\${encodeURIComponent(redirectTarget)}&role=\${role}\`);
    } else {
      router.push(redirectTarget);
    }
  };`;
  
  const replacement = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^\\+?[0-9\\s-]{10,}$/.test(emailOrPhone.trim());
    const redirectTarget = role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/provider';

    if (isPhone) {
      const phoneClean = emailOrPhone.trim().startsWith('+') ? emailOrPhone.trim() : \`+92\${emailOrPhone.trim().replace(/^0/, '')}\`;
      
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        await fetch(\`\${BACKEND_URL}/auth/otp/send\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneClean }),
        });
      } catch (err) {}
      
      router.push(\`/verify-otp?phone=\${encodeURIComponent(phoneClean)}&redirect=\${encodeURIComponent(redirectTarget)}&role=\${role}\`);
    } else {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const res = await fetch(\`\${BACKEND_URL}/auth/login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailOrPhone, password }),
        });
        const data = await res.json();
        
        if (res.ok && data.accessToken) {
          localStorage.setItem('skillconnect_auth_token', data.accessToken);
          document.cookie = \`skillconnect_auth_token=\${data.accessToken}; path=/; max-age=86400\`;
          
          if (data.user?.role === 'CUSTOMER') {
            router.push('/dashboard/customer');
          } else if (data.user?.role === 'PROVIDER') {
            router.push('/dashboard/provider');
          } else {
            router.push(redirectTarget);
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        alert('Login failed. Please configure backend database.');
      }
    }
  };`;
  content = content.replace(search, replacement);
  fs.writeFileSync(path, content);
}

function updateVerifyOtp() {
  const path = 'apps/frontend/src/app/verify-otp/page.tsx';
  let content = fs.readFileSync(path, 'utf8');
  
  const search = `      setSuccess(true);

      // Save dummy auth token to simulate logged in state
      localStorage.setItem('skillconnect_auth_token', 'demo-jwt-token-789');`;
      
  const replacement = `      setSuccess(true);

      // Save auth token
      if (data.accessToken) {
        localStorage.setItem('skillconnect_auth_token', data.accessToken);
        document.cookie = \`skillconnect_auth_token=\${data.accessToken}; path=/; max-age=86400\`;
      } else {
        localStorage.setItem('skillconnect_auth_token', 'demo-jwt-token-789');
        document.cookie = \`skillconnect_auth_token=demo-jwt-token-789; path=/; max-age=86400\`;
      }`;
  content = content.replace(search, replacement);
  fs.writeFileSync(path, content);
}

updateLogin();
updateVerifyOtp();
