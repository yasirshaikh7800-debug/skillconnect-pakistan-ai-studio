const fs = require('fs');
let content = fs.readFileSync('apps/frontend/src/components/ThreeAuth3D.tsx', 'utf8');

content = content.replace(/0x10b981/g, '0x3b82f6');
content = content.replace(/0x34d399/g, '0x60a5fa');
content = content.replace(/0x059669/g, '0x2563eb');
content = content.replace(/0x14b8a6/g, '0x3b82f6');
content = content.replace(/0x22c55e/g, '0x3b82f6');

fs.writeFileSync('apps/frontend/src/components/ThreeAuth3D.tsx', content, 'utf8');
