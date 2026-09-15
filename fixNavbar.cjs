const fs = require('fs');

let content = fs.readFileSync('apps/frontend/src/components/Navbar.tsx', 'utf8');

// The background of the navbar is bg-blue-900.
// Let's adjust text colors inside to be white/blue-100.
content = content.replace(/text-slate-700 dark:text-slate-700/g, 'text-blue-100');
content = content.replace(/text-slate-700 dark:text-slate-200/g, 'text-blue-100');
content = content.replace(/text-slate-600 dark:text-slate-700/g, 'text-blue-200');
content = content.replace(/hover:text-blue-600 dark:hover:text-blue-400/g, 'hover:text-white');
content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-blue-100');

// AI Hub button in navbar
content = content.replace(
  /'text-blue-700 dark:text-blue-400 hover:text-blue-600 bg-blue-50\/60 dark:bg-blue-950\/40 border border-blue-100 dark:border-blue-900\/60 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900\/30'/g,
  "'text-blue-100 hover:text-white bg-blue-800/60 border border-blue-700/60 hover:border-blue-500 hover:bg-blue-800'"
);

// Active states
content = content.replace(
  /'font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950\/60 border border-blue-200 dark:border-blue-800\/60 shadow-\[0_0_12px_rgba\(37,99,235,0\.12\)\] hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100\/70'/g,
  "'font-bold text-white bg-blue-800 border border-blue-600 shadow-md'"
);

// Inactive states
content = content.replace(
  /'font-medium text-slate-700 dark:text-slate-700 hover:text-white hover:bg-slate-100\/80 dark:hover:bg-slate-800\/60'/g,
  "'font-medium text-blue-100 hover:text-white hover:bg-blue-800/80'"
);
content = content.replace(
  /'font-medium text-blue-100 hover:text-white hover:bg-slate-100\/80 dark:hover:bg-slate-800\/60'/g,
  "'font-medium text-blue-100 hover:text-white hover:bg-blue-800/80'"
);

// Theme toggle
content = content.replace(/bg-slate-100 dark:bg-slate-50/g, 'bg-blue-800 hover:bg-blue-700');

// Login link
content = content.replace(/hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2/g, 'hover:text-white px-3 py-2');

fs.writeFileSync('apps/frontend/src/components/Navbar.tsx', content, 'utf8');
