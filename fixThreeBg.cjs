const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/bg-\[#0[0-9a-fA-F]{5}\]/g, 'bg-blue-50'); // Replace black hex bg with blue-50
    content = content.replace(/bg-blue-900\/80/g, 'bg-white'); 
    content = content.replace(/bg-blue-900\/90/g, 'bg-white');
    content = content.replace(/border-blue-600\/30/g, 'border-slate-200');
    content = content.replace(/border-blue-600/g, 'border-slate-200');
    content = content.replace(/bg-blue-[0-9]+\/10 blur/g, 'bg-blue-100/30 blur');
    content = content.replace(/text-blue-300/g, 'text-blue-700');
    content = content.replace(/bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/g, 'bg-white');
    content = content.replace(/bg-blue-900\/20 text-blue-[37]00 hover:bg-blue-900\/30/g, 'bg-blue-100 text-blue-700 hover:bg-blue-200');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('apps/frontend/src/components/ThreeAuth3D.tsx');
replaceInFile('apps/frontend/src/components/ThreeHero3D.tsx');
replaceInFile('apps/frontend/src/components/ThreeMap3D.tsx');

