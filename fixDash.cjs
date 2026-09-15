const fs = require('fs');

function replaceFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900/g, 'bg-blue-600 text-white hover:bg-blue-700');
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceFile('apps/frontend/src/app/dashboard/customer/page.tsx');
