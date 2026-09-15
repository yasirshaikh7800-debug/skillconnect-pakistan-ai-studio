const fs = require('fs');

let content = fs.readFileSync('apps/frontend/src/components/Navbar.tsx', 'utf8');

content = content.replace(
    /className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-blue-600 hover:bg-blue-900\/90 text-slate-900 dark:text-slate-900 placeholder-slate-400 border border-slate-200 dark:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"/g,
    'className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-white text-slate-900 placeholder-slate-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"'
);

// We also need to make sure the Search icon inside it looks ok (currently text-slate-400 which is fine on white bg)
// Wait, is the icon color text-slate-400? Let's check: 
// <button type="submit" className="absolute left-3.5 top-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
content = content.replace(
    /className="absolute left-3.5 top-2.5 text-slate-400 hover:text-blue-[0-9]+ dark:hover:text-blue-[0-9]+"/g,
    'className="absolute left-3.5 top-2.5 text-slate-400 hover:text-blue-600 transition-colors"'
);

// Also the "dark/light mode" toggle button:
// className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 text-blue-200 hover:text-slate-100 transition-colors"
content = content.replace(
    /className="p-2 rounded-lg bg-blue-600 hover:bg-blue-900 text-blue-200 hover:text-slate-100 transition-colors"/g,
    'className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100 hover:text-white transition-colors"'
);

fs.writeFileSync('apps/frontend/src/components/Navbar.tsx', content, 'utf8');

