const { createServer } = require('node:http');
const { parse } = require('node:url');
const next = require('next');
const fs = require('node:fs');
const path = require('node:path');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

const frontendDir = path.resolve(process.cwd(), 'apps/frontend');
const rootDir = process.cwd();

// In production mode, if .next exists in root but not in apps/frontend, copy it over
if (!dev) {
  const prodNextDir = path.join(frontendDir, '.next');
  const rootNextDir = path.join(rootDir, '.next');
  if (!fs.existsSync(path.join(prodNextDir, 'BUILD_ID')) && fs.existsSync(path.join(rootNextDir, 'BUILD_ID'))) {
    console.log('> Syncing production .next artifacts to apps/frontend/.next...');
    fs.cpSync(rootNextDir, prodNextDir, { recursive: true });
  }
}

const dir = frontendDir;

const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || '/', true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, host, () => {
    console.log(`> Ready on http://${host}:${port}`);
  });
}).catch((err) => {
  console.error('Error preparing Next app:', err);
  process.exit(1);
});
