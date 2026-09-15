const fs = require('fs');

let content = fs.readFileSync('apps/frontend/src/components/ThreeMap3D.tsx', 'utf8');
content = content.replace(/bg-blue-600 hover:bg-blue-700 text-slate-900/g, 'bg-blue-600 hover:bg-blue-700 text-white');
fs.writeFileSync('apps/frontend/src/components/ThreeMap3D.tsx', content, 'utf8');

