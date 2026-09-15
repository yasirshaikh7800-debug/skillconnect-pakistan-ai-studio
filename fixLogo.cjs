const fs = require('fs');

let content = fs.readFileSync('apps/frontend/src/components/SkillConnectLogo.tsx', 'utf8');

// The logo text needs to be white in Navbar but dark on white bg.
// Let's pass an `isDarkBg` prop or just use `text-white` when inside the navbar.
// Or we can just let `className="text-white"` be passed in and applied.

content = content.replace(
  /className=\{`font-bold tracking-tight text-slate-900 dark:text-slate-900 \$\{/g,
  'className={`font-bold tracking-tight ${className.includes(\'text-\') ? \'\' : \'text-slate-900 dark:text-slate-900\'} ${'
);

content = content.replace(
  /className=\{`font-extrabold text-blue-600 dark:text-blue-400 \$\{/g,
  'className={`font-extrabold ${className.includes(\'text-white\') ? \'text-blue-200\' : \'text-blue-600 dark:text-blue-400\'} ${'
);

content = content.replace(
  /className=\{`font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-600 \$\{/g,
  'className={`font-semibold uppercase tracking-wider ${className.includes(\'text-white\') ? \'text-blue-100\' : \'text-slate-500 dark:text-slate-500\'} ${'
);

// We should also modify Navbar to pass `className="text-white"`
let navbar = fs.readFileSync('apps/frontend/src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(
  /<SkillConnectLogo variant="compact" size="md" \/>/g,
  '<SkillConnectLogo variant="compact" size="md" className="text-white" />'
);

fs.writeFileSync('apps/frontend/src/components/SkillConnectLogo.tsx', content, 'utf8');
fs.writeFileSync('apps/frontend/src/components/Navbar.tsx', navbar, 'utf8');
