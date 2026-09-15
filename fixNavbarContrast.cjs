const fs = require('fs');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // In Navbar, we have bg-blue-900, so text-blue-600 etc. are invisible.
    content = content.replace(/text-blue-600/g, 'text-slate-100');
    content = content.replace(/hover:text-blue-600/g, 'hover:text-white');
    content = content.replace(/hover:text-blue-700/g, 'hover:text-white');
    // For active background in navbar, bg-blue-600 is good (Royal Blue)
    // But let's just make sure text is white.
    
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('apps/frontend/src/components/Navbar.tsx');

