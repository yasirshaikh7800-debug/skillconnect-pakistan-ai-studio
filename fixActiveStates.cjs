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
      
      content = content.replace(/bg-blue-900 text-white/g, 'bg-blue-600 text-white');
      content = content.replace(/bg-blue-900 hover:text-white/g, 'bg-blue-600 hover:text-white');
      content = content.replace(/hover:bg-blue-900 hover:text-white/g, 'hover:bg-blue-600 hover:text-white');
      content = content.replace(/hover:bg-blue-900 text-white/g, 'hover:bg-blue-700 text-white');
      
      // Also Navbar needs to STAY bg-blue-900!
      // Let's re-fix Navbar specifically after this.
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('apps/frontend/src');

// Restore Navbar and Logo
let navbar = fs.readFileSync('apps/frontend/src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/bg-blue-600 border-b border-blue-600 transition-colors shadow-lg/g, 'bg-blue-900 border-b border-blue-800 transition-colors shadow-lg');
navbar = navbar.replace(/bg-blue-600 backdrop-blur-lg/g, 'bg-blue-900 backdrop-blur-lg');
fs.writeFileSync('apps/frontend/src/components/Navbar.tsx', navbar, 'utf8');

