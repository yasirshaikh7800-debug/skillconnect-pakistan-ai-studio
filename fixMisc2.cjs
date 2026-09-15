const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // overlays
    content = content.replace(/bg-slate-950\/[0-9]+/g, 'bg-blue-950/40');
    // text-slate-200
    content = content.replace(/text-slate-200/g, 'text-slate-700');
    // text-white -> text-slate-900
    // content = content.replace(/text-white/g, 'text-slate-900');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('apps/frontend/src/app/not-found.tsx');
replaceInFile('apps/frontend/src/app/services/page.tsx');
replaceInFile('apps/frontend/src/app/services/[id]/page.tsx');
replaceInFile('apps/frontend/src/app/dashboard/customer/page.tsx');
replaceInFile('apps/frontend/src/app/dashboard/provider/page.tsx');
replaceInFile('apps/frontend/src/app/admin/page.tsx');
replaceInFile('apps/frontend/src/app/page.tsx');
replaceInFile('apps/frontend/src/app/search/page.tsx');
replaceInFile('apps/frontend/src/components/ai/AiAssistantDrawer.tsx');
replaceInFile('apps/frontend/src/components/ai/AiCareerInsightsCard.tsx');

let page = fs.readFileSync('apps/frontend/src/app/page.tsx', 'utf8');
page = page.replace(/bg-slate-900\/80 text-white placeholder-slate-400 border border-slate-700/g, 'bg-white text-slate-900 placeholder-slate-500 border border-slate-300');
fs.writeFileSync('apps/frontend/src/app/page.tsx', page, 'utf8');

console.log("Done fixing.");
