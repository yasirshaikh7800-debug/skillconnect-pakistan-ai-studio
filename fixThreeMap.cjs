const fs = require('fs');

let content = fs.readFileSync('apps/frontend/src/components/ThreeMap3D.tsx', 'utf8');
content = content.replace(/0x14b8a6/g, '0x3b82f6'); // teal-500 -> blue-500
content = content.replace(/0x10b981/g, '0x3b82f6'); // emerald-500 -> blue-500
content = content.replace(/0x34d399/g, '0x60a5fa'); // emerald-400 -> blue-400
content = content.replace(/0x059669/g, '0x2563eb'); // emerald-600 -> blue-600
content = content.replace(/0x22c55e/g, '0x3b82f6'); // green-500 -> blue-500

fs.writeFileSync('apps/frontend/src/components/ThreeMap3D.tsx', content, 'utf8');
