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
      
      // Fix Text Accents to Royal Blue
      content = content.replace(/text-blue-700/g, 'text-blue-600');
      content = content.replace(/text-blue-800/g, 'text-blue-600');
      content = content.replace(/text-blue-900/g, 'text-blue-600');
      content = content.replace(/text-blue-950/g, 'text-blue-600');
      content = content.replace(/hover:text-blue-800/g, 'hover:text-blue-700');
      content = content.replace(/hover:text-blue-900/g, 'hover:text-blue-700');
      content = content.replace(/hover:text-blue-950/g, 'hover:text-blue-700');
      
      // Fix Borders to Royal Blue
      content = content.replace(/border-blue-700/g, 'border-blue-600');
      content = content.replace(/border-blue-800/g, 'border-blue-600');
      content = content.replace(/border-blue-900/g, 'border-blue-600');
      content = content.replace(/border-blue-950/g, 'border-blue-600');

      // Fix shadows and rings
      content = content.replace(/shadow-blue-[789]00/g, 'shadow-blue-600');
      content = content.replace(/shadow-blue-950/g, 'shadow-blue-600');
      content = content.replace(/ring-blue-[789]00/g, 'ring-blue-600');
      content = content.replace(/ring-blue-950/g, 'ring-blue-600');
      
      // Fix generic backgrounds (Buttons, tags)
      // Be careful not to replace the deep blue sections yet.
      // Most buttons are something like "px-4 py-2 bg-blue-X hover:bg-blue-Y text-white"
      content = content.replace(/bg-blue-950 hover:bg-blue-950/g, 'bg-blue-600 hover:bg-blue-700');
      content = content.replace(/bg-blue-950 hover:bg-blue-[89]00/g, 'bg-blue-600 hover:bg-blue-700');
      content = content.replace(/bg-blue-900 hover:bg-blue-[89]00/g, 'bg-blue-600 hover:bg-blue-700');
      content = content.replace(/bg-blue-800 hover:bg-blue-[89]00/g, 'bg-blue-600 hover:bg-blue-700');
      content = content.replace(/hover:bg-blue-[89]00/g, 'hover:bg-blue-700');
      
      // If there are standalone bg-blue-800 or 900 that aren't navbars...
      // Let's just make all remaining bg-blue-950 into bg-blue-900 (Deep Blue).
      content = content.replace(/bg-blue-950/g, 'bg-blue-900');
      // And bg-blue-800 into bg-blue-600 (Royal Blue).
      content = content.replace(/bg-blue-800/g, 'bg-blue-600');
      
      // Ensure gradient is Deep Blue to Royal Blue
      content = content.replace(/bg-gradient-to-br from-blue-900 via-blue-[89]00 to-blue-[89]00/g, 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');
console.log('Done.');
