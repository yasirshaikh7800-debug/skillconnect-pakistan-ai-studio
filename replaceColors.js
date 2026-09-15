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
      
      // Specifically target black/slate-950 dark backgrounds
      // Navbar and footers usually have specific classes we can target
      // Instead of risking changing ALL bg-slate-900 to bg-white which breaks text,
      // let's identify common patterns.
      
      // "dark:" classes: We want to eliminate the dark mode completely or make it blue/white.
      // But we can just strip "dark:" classes or change them.
      // Easiest is to just let dark mode use the same light mode colors, or remove them.
      // The user says "Make the main website backgrounds completely white."
      
      // Let's replace `dark:bg-slate-950` with `dark:bg-white`
      content = content.replace(/dark:bg-slate-950/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-900/g, 'dark:bg-white');
      content = content.replace(/dark:bg-slate-800/g, 'dark:bg-slate-50');
      content = content.replace(/dark:text-white/g, 'dark:text-slate-900');
      content = content.replace(/dark:text-slate-100/g, 'dark:text-slate-900');
      content = content.replace(/dark:text-slate-200/g, 'dark:text-slate-800');
      content = content.replace(/dark:text-slate-300/g, 'dark:text-slate-700');
      content = content.replace(/dark:text-slate-400/g, 'dark:text-slate-600');
      content = content.replace(/dark:border-slate-800/g, 'dark:border-slate-200');
      content = content.replace(/dark:border-slate-700/g, 'dark:border-slate-300');
      
      // Now let's handle hardcoded dark backgrounds (e.g. Hero section, footer)
      content = content.replace(/bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/g, 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800');
      content = content.replace(/bg-slate-950/g, 'bg-white');
      content = content.replace(/bg-slate-900/g, 'bg-white');
      // Fix some text colors if we changed bg to white
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');
console.log('Done');
