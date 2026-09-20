import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential paths to the standalone server.js
const candidatePaths = [
  path.resolve(__dirname, 'apps/frontend/.next/standalone/apps/frontend/server.js'),
  path.resolve(__dirname, '.next/standalone/apps/frontend/server.js'),
  path.resolve(process.cwd(), 'apps/frontend/.next/standalone/apps/frontend/server.js'),
  path.resolve(process.cwd(), '.next/standalone/apps/frontend/server.js'),
];

const target = candidatePaths.find((p) => fs.existsSync(p));

if (!target) {
  console.error('Could not find standalone server.js at any of:', candidatePaths);
  process.exit(1);
}

const child = spawn(process.execPath, [target], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.PORT || '3000',
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0',
    NODE_ENV: 'production',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

