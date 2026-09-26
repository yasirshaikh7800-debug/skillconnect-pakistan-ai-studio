import path from 'path';
import { fileURLToPath } from 'url';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  /** @type {import('next').NextConfig} */
  return {
    reactStrictMode: true,
    output: isDev ? undefined : 'standalone',
    outputFileTracingRoot: path.resolve(__dirname, '../../'),
    distDir: isDev ? '.next-dev' : '.next',
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};
