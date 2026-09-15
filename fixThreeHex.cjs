const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace cyan/teal/emerald with Blues
    content = content.replace(/0x06b6d4/g, '0x2563eb');
    content = content.replace(/0x0891b2/g, '0x1e3a8a');
    content = content.replace(/0x10b981/g, '0x2563eb');
    content = content.replace(/0x14b8a6/g, '0x60a5fa');
    content = content.replace(/0x0d9488/g, '0x1e3a8a'); // ThreeMap3D
    content = content.replace(/0x0284c7/g, '0x2563eb');
    content = content.replace(/0x0369a1/g, '0x1e3a8a');
    content = content.replace(/0x38bdf8/g, '0x60a5fa');
    content = content.replace(/0x1d4ed8/g, '0x1e3a8a');
    content = content.replace(/0x0f172a/g, '0xffffff'); // Some ambient light in hero
    content = content.replace(/0x0a1422/g, '0xf8fafc'); // ambient map bg
    content = content.replace(/0x060a12/g, '0xf8fafc'); // fog
    content = content.replace(/0x111c2e/g, '0xe2e8f0'); // roof building
    content = content.replace(/0x09202f/g, '0xe2e8f0'); 
    
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('apps/frontend/src/components/ThreeAuth3D.tsx');
replaceInFile('apps/frontend/src/components/ThreeHero3D.tsx');
replaceInFile('apps/frontend/src/components/ThreeMap3D.tsx');
replaceInFile('apps/frontend/src/components/BookingSuccess3DModal.tsx');
