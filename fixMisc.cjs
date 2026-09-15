const fs = require('fs');

function replaceFile(filePath, isCard=false) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (isCard) {
        content = content.replace(/bg-slate-950/g, 'bg-white');
        content = content.replace(/bg-slate-900\/90/g, 'bg-white');
        content = content.replace(/bg-slate-900\/80/g, 'bg-white');
        content = content.replace(/bg-slate-900/g, 'bg-white');
        content = content.replace(/border-slate-800/g, 'border-slate-200');
        content = content.replace(/border-slate-700/g, 'border-slate-300');
        content = content.replace(/text-white/g, 'text-slate-900');
        content = content.replace(/text-slate-400/g, 'text-slate-500');
        content = content.replace(/text-slate-500/g, 'text-slate-600');
        content = content.replace(/text-slate-300/g, 'text-slate-700');
    } else {
        content = content.replace(/bg-slate-950/g, 'bg-white');
        content = content.replace(/text-white/g, 'text-slate-900');
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// Fix error pages
replaceFile('apps/frontend/src/app/not-found.tsx', false);
replaceFile('apps/frontend/src/app/error.tsx', false);
replaceFile('apps/frontend/src/app/global-error.tsx', false);

// Fix AI Hub components
replaceFile('apps/frontend/src/components/ai/AiAssistantDrawer.tsx', true);
replaceFile('apps/frontend/src/components/ai/AiCareerInsightsCard.tsx', true);
replaceFile('apps/frontend/src/components/ai/AiCareerRoadmap.tsx', true);
replaceFile('apps/frontend/src/components/ThreeMap3D.tsx', true);

// Fix Navbar mobile menu
let navbar = fs.readFileSync('apps/frontend/src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/bg-slate-900\/95/g, 'bg-blue-900');
fs.writeFileSync('apps/frontend/src/components/Navbar.tsx', navbar, 'utf8');

// Fix search page inputs (page.tsx)
let page = fs.readFileSync('apps/frontend/src/app/page.tsx', 'utf8');
page = page.replace(/bg-slate-900\/80 text-white placeholder-slate-400 border-slate-700/g, 'bg-white text-slate-900 placeholder-slate-500 border-slate-300');
fs.writeFileSync('apps/frontend/src/app/page.tsx', page, 'utf8');
