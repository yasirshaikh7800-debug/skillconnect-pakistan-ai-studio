const fs = require('fs');
let content = fs.readFileSync('apps/frontend/src/app/verify-otp/page.tsx', 'utf8');

// Replace dark slate with clean blue/white versions
content = content.replace(/bg-slate-900\/90/g, 'bg-blue-50');
content = content.replace(/bg-slate-950\/60/g, 'bg-white');
content = content.replace(/bg-slate-900\/80/g, 'bg-white/80');
content = content.replace(/text-slate-300/g, 'text-slate-600');
content = content.replace(/border-slate-700\/60/g, 'border-slate-300');
content = content.replace(/hover:border-slate-600/g, 'hover:border-blue-300');

fs.writeFileSync('apps/frontend/src/app/verify-otp/page.tsx', content, 'utf8');
