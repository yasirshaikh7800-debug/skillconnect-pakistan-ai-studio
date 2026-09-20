import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'next';
import { startServer } from 'next/dist/server/lib/start-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV = 'production';

// Locate the directory with the compiled Next.js build artifacts (.next)
const candidateDirs = [
  path.resolve(process.cwd(), 'apps/frontend'),
  process.cwd(),
  path.resolve(__dirname, 'apps/frontend'),
  __dirname,
  path.resolve(__dirname, '..'),
  path.resolve(__dirname, '../..'),
];

let dir = candidateDirs.find((candidate) =>
  fs.existsSync(path.join(candidate, '.next', 'BUILD_ID'))
);

if (!dir) {
  dir = fs.existsSync(path.resolve(process.cwd(), 'apps/frontend'))
    ? path.resolve(process.cwd(), 'apps/frontend')
    : process.cwd();
}

const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT || '', 10);
if (
  Number.isNaN(keepAliveTimeout) ||
  !Number.isFinite(keepAliveTimeout) ||
  keepAliveTimeout < 0
) {
  keepAliveTimeout = undefined;
}

// Load nextConfig from required-server-files.json if available
let nextConfig = {
  distDir: '.next',
};

const reqFilesPath = path.join(dir, '.next', 'required-server-files.json');
if (fs.existsSync(reqFilesPath)) {
  try {
    const raw = fs.readFileSync(reqFilesPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.config) {
      nextConfig = {
        ...parsed.config,
        distDir: parsed.config.distDir || '.next',
      };
    }
  } catch (err) {
    console.warn('Could not parse required-server-files.json, using default config:', err);
  }
} else {
  // Check if .next is in root or other candidate
  for (const candidate of candidateDirs) {
    const altReqPath = path.join(candidate, '.next', 'required-server-files.json');
    if (fs.existsSync(altReqPath)) {
      try {
        const raw = fs.readFileSync(altReqPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.config) {
          nextConfig = {
            ...parsed.config,
            distDir: parsed.config.distDir || '.next',
          };
          break;
        }
      } catch (_) {}
    }
  }
}

nextConfig.distDir = nextConfig.distDir || '.next';

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

startServer({
  dir,
  isDev: false,
  config: nextConfig,
  hostname,
  port: currentPort,
  allowRetry: false,
  keepAliveTimeout,
}).then(() => {
  console.log(`> Production server listening on http://${hostname}:${currentPort}`);
}).catch((err) => {
  console.error('Failed to start standalone server:', err);
  process.exit(1);
});
