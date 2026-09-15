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
      
      // Remove dark mode hover classes
      content = content.replace(/dark:hover:bg-slate-800/g, 'hover:bg-slate-100');
      // For standalone bg-slate-800 (usually old dark mode cards or buttons)
      // If it's a navbar secondary button:
      content = content.replace(/border-slate-700 text-white font-medium hover:bg-slate-800/g, 'border-slate-400 text-slate-100 font-medium hover:bg-blue-800'); // Navbar mobile secondary button
      
      // AiAssistantDrawer etc
      content = content.replace(/bg-slate-800 border border-slate-300\/80 text-slate-700/g, 'bg-slate-100 border border-slate-300/80 text-slate-700');
      content = content.replace(/bg-slate-800 hover:bg-slate-700 text-slate-700 border border-slate-300/g, 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300');
      
      content = content.replace(/bg-slate-800 text-blue-600 border border-slate-300/g, 'bg-slate-100 text-blue-600 border border-slate-300');
      
      content = content.replace(/bg-slate-800 hover:bg-slate-700 text-[a-z]+-300/g, 'bg-slate-100 hover:bg-slate-200 text-slate-700'); // AiSkillMatcher tags
      
      // Icon buttons
      content = content.replace(/hover:bg-slate-800/g, 'hover:bg-slate-100');
      content = content.replace(/bg-slate-800 hover:bg-slate-700 text-blue-600/g, 'bg-slate-100 hover:bg-slate-200 text-blue-600');
      
      // Divider
      content = content.replace(/bg-slate-800 my-auto/g, 'bg-slate-300 my-auto');
      
      // page.tsx hero secondary button: bg-slate-800 hover:bg-slate-700 text-blue-600 border border-blue-600/40
      content = content.replace(/bg-slate-[87]00/g, 'bg-slate-100');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');

