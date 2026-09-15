const fs = require('fs');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/blue-600/g, 'blue-900');
    content = content.replace(/blue-500/g, 'blue-800');
    content = content.replace(/blue-400/g, 'blue-700');
    content = content.replace(/cyan-400/g, 'blue-700');
    content = content.replace(/indigo-600/g, 'blue-900');
    content = content.replace(/indigo-500/g, 'blue-800');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('apps/frontend/src/app/verify-otp/page.tsx');
replaceInFile('apps/frontend/src/app/register/page.tsx');
replaceInFile('apps/frontend/src/app/login/page.tsx');
replaceInFile('apps/frontend/src/components/ai/AiCareerRoadmap.tsx');
replaceInFile('apps/frontend/src/components/ai/AiSkillMatcher.tsx');
