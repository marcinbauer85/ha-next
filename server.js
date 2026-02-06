const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Get HA URL from environment
const HA_URL = process.env.NEXT_PUBLIC_HA_URL || 'http://localhost:8123';

console.log('HA URL:', HA_URL);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Create WebSocket proxy with explicit target
const wsProxy = createProxyMiddleware({
  target: HA_URL,
  ws: true,
  changeOrigin: true,
  pathRewrite: {
    '^/api/ha': '', // Remove /api/ha prefix
  },
  on: {
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
    },
    proxyReqWs: (proxyReq, req, socket) => {
      console.log('Proxying WS to:', HA_URL + req.url);
    },
  },
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Proxy /api/ha/* requests to Home Assistant
    if (parsedUrl.pathname?.startsWith('/api/ha/')) {
      wsProxy(req, res);
      return;
    }

    // Let Next.js handle everything else
    handle(req, res, parsedUrl);
  });

  // Handle WebSocket upgrade for /api/ha/* paths
  server.on('upgrade', (req, socket, head) => {
    const parsedUrl = parse(req.url, true);
    console.log('WebSocket upgrade request:', parsedUrl.pathname);

    if (parsedUrl.pathname?.startsWith('/api/ha/')) {
      console.log('Proxying WebSocket to HA:', HA_URL);
      wsProxy.upgrade(req, socket, head);
    } else {
      // Let Next.js handle other WebSocket upgrades (HMR)
      // Don't destroy socket - let it pass through
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> HA proxy available at /api/ha/*`);
  });
});
