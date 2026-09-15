const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic color swaps
      content = content.replace(/emerald/g, 'blue');
      content = content.replace(/teal/g, 'blue');
      
      // We want to remove dark mode or map it to light mode
      content = content.replace(/dark:bg-slate-950\/[0-9]+/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-900\/[0-9]+/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-950/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-900/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-800/g, 'dark:bg-slate-50');
      
      content = content.replace(/dark:text-white/g, 'dark:text-slate-900');
      content = content.replace(/dark:text-slate-100/g, 'dark:text-slate-900');
      content = content.replace(/dark:text-slate-200/g, 'dark:text-slate-800');
      content = content.replace(/dark:text-slate-300/g, 'dark:text-slate-700');
      content = content.replace(/dark:text-slate-400/g, 'dark:text-slate-600');
      content = content.replace(/dark:text-slate-500/g, 'dark:text-slate-500');
      
      content = content.replace(/dark:border-slate-800/g, 'dark:border-slate-200');
      content = content.replace(/dark:border-slate-700/g, 'dark:border-slate-300');
      
      // Hardcoded dark background sections (e.g. Hero, Modals)
      content = content.replace(/bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/g, 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800');
      
      // But we have places like ThreeMap3D, Hero, which might be explicitly slate-950.
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');
console.log('Done');
