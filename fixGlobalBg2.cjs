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
      
      // Fix background slate issues for secondary backgrounds
      content = content.replace(/dark:bg-blue-950\/[0-9]+/g, 'dark:bg-blue-50');
      content = content.replace(/dark:bg-blue-950/g, 'dark:bg-blue-50');
      
      // bg-blue-950 is now mostly buttons / modals
      content = content.replace(/bg-blue-950\/[4-9]0 backdrop-blur/g, 'bg-slate-900/40 backdrop-blur'); // Overlays back to slate-900/40 which is a nice dark translucent mask
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');

