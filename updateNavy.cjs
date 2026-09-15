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
      
      // We want to replace bright blues with Navy (blue-900/blue-950)
      // Light blue backgrounds for accents can remain blue-50/blue-100
      
      // Text
      content = content.replace(/text-blue-400/g, 'text-blue-700');
      content = content.replace(/text-blue-500/g, 'text-blue-800');
      content = content.replace(/text-blue-600/g, 'text-blue-900');
      content = content.replace(/hover:text-blue-300/g, 'hover:text-blue-700');
      content = content.replace(/hover:text-blue-400/g, 'hover:text-blue-800');
      content = content.replace(/hover:text-blue-500/g, 'hover:text-blue-900');
      content = content.replace(/hover:text-blue-600/g, 'hover:text-blue-950');
      content = content.replace(/hover:text-blue-700/g, 'hover:text-blue-950');

      // Backgrounds
      content = content.replace(/bg-blue-400/g, 'bg-blue-800');
      content = content.replace(/bg-blue-500/g, 'bg-blue-800');
      content = content.replace(/bg-blue-600/g, 'bg-blue-900');
      content = content.replace(/hover:bg-blue-600/g, 'hover:bg-blue-900');
      content = content.replace(/hover:bg-blue-700/g, 'hover:bg-blue-950');
      
      // Border
      content = content.replace(/border-blue-300/g, 'border-blue-700');
      content = content.replace(/border-blue-400/g, 'border-blue-800');
      content = content.replace(/border-blue-500/g, 'border-blue-900');
      content = content.replace(/border-blue-600/g, 'border-blue-900');
      
      // Ring & Shadow
      content = content.replace(/ring-blue-500/g, 'ring-blue-900');
      content = content.replace(/shadow-blue-500/g, 'shadow-blue-900');
      content = content.replace(/shadow-blue-600/g, 'shadow-blue-900');
      
      // Nav/Header: ensure deep navy
      content = content.replace(/bg-blue-900/g, 'bg-blue-950');
      
      // Any remaining emerald or green
      content = content.replace(/emerald/g, 'blue');
      content = content.replace(/green/g, 'blue');
      content = content.replace(/teal/g, 'blue');

      // Fix specific navbar links that might have been broken by text-blue-100 logic
      // In the navbar, the background is bg-blue-950, so text-blue-900 would be invisible.
      // We need text-white on deep blue backgrounds!
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');
console.log('Done mapping to navy.');
