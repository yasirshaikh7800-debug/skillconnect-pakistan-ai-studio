const fs = require('fs');
let content = fs.readFileSync('apps/frontend/src/components/ThreeHero3D.tsx', 'utf8');

content = content.replace(/bg-slate-900/g, 'bg-blue-950');
content = content.replace(/bg-slate-950/g, 'bg-blue-950');
content = content.replace(/border-slate-800/g, 'border-blue-900');
content = content.replace(/text-slate-400/g, 'text-blue-300');
content = content.replace(/text-slate-500/g, 'text-blue-400');

fs.writeFileSync('apps/frontend/src/components/ThreeHero3D.tsx', content, 'utf8');
