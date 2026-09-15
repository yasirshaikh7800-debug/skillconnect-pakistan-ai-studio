const fs = require('fs');
let content = fs.readFileSync('apps/frontend/src/components/BookingSuccess3DModal.tsx', 'utf8');

// The modal container
content = content.replace(/bg-slate-900/g, 'bg-white');
content = content.replace(/bg-slate-950\/80 overflow-hidden/g, 'bg-slate-50 overflow-hidden');
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/bg-slate-950\/80 backdrop-blur-md/g, 'bg-blue-950/40 backdrop-blur-sm'); // The backdrop overlay

// Subtext in the modal
content = content.replace(/text-slate-400/g, 'text-slate-600');
content = content.replace(/text-slate-300/g, 'text-slate-700');

// Hex colors in the 3D scene (it's a success checkmark, maybe we want it blue instead of green)
content = content.replace(/0x10b981/g, '0x3b82f6');
content = content.replace(/0x059669/g, '0x2563eb');

fs.writeFileSync('apps/frontend/src/components/BookingSuccess3DModal.tsx', content, 'utf8');
