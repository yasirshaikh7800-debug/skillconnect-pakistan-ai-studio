const fs = require('fs');

let css = fs.readFileSync('apps/frontend/src/app/globals.css', 'utf8');
css = css.replace(/\.glow-cyan-emerald/g, '.glow-blue-cyan');
css = css.replace(/\.glow-teal-active/g, '.glow-blue-active-alt');
fs.writeFileSync('apps/frontend/src/app/globals.css', css, 'utf8');
