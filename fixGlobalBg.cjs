const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Eliminate any lingering "dark:bg-blue-950" etc that could make sections dark
      content = content.replace(/dark:bg-blue-[987]00\/[0-9]+/g, 'dark:bg-blue-50');
      content = content.replace(/dark:bg-blue-[987]00/g, 'dark:bg-blue-50');
      
      // Fix background slate issues for secondary backgrounds
      content = content.replace(/dark:bg-slate-800\/[0-9]+/g, 'dark:bg-slate-50');
      content = content.replace(/dark:bg-slate-800/g, 'dark:bg-slate-50');
      
      // Ensure text is legible on light backgrounds (since we stripped dark mode backgrounds)
      content = content.replace(/dark:text-blue-300/g, 'dark:text-blue-700');
      content = content.replace(/dark:text-blue-400/g, 'dark:text-blue-800');
      content = content.replace(/dark:text-white/g, 'dark:text-slate-900');
      content = content.replace(/text-slate-200/g, 'text-slate-700');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');

