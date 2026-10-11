const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const BUYERS_FILE = path.join(DATA_DIR, 'buyers.json');
const EXPENSES_FILE = path.join(DATA_DIR, 'expenses.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory:', err.message);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function readRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(body);
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // API 1: Server Date & Time (for synchronizing sell date across devices)
  if (reqPath === '/api/server-date' && req.method === 'GET') {
    const now = new Date();
    const serverDate = now.toISOString().split('T')[0];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      serverDate: serverDate,
      serverTime: now.toLocaleTimeString('en-IN'),
      iso: now.toISOString(),
      timestamp: now.getTime()
    }));
    return;
  }

  // API 2: Buyers / Orders Ledger
  if (reqPath === '/api/buyers') {
    if (req.method === 'GET') {
      fs.readFile(BUYERS_FILE, 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (err || !data) {
          res.end(JSON.stringify([]));
        } else {
          res.end(data);
        }
      });
      return;
    } else if (req.method === 'POST') {
      readRequestBody(req, body => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFile(BUYERS_FILE, JSON.stringify(parsed, null, 2), 'utf8', err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ error: 'Failed to write buyers file', details: err.message }));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ success: true, count: Array.isArray(parsed) ? parsed.length : 1 }));
            }
          });
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // API 3: Expenses Ledger
  if (reqPath === '/api/expenses') {
    if (req.method === 'GET') {
      fs.readFile(EXPENSES_FILE, 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (err || !data) {
          res.end(JSON.stringify([]));
        } else {
          res.end(data);
        }
      });
      return;
    } else if (req.method === 'POST') {
      readRequestBody(req, body => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFile(EXPENSES_FILE, JSON.stringify(parsed, null, 2), 'utf8', err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ error: 'Failed to write expenses file', details: err.message }));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ success: true, count: Array.isArray(parsed) ? parsed.length : 1 }));
            }
          });
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // Static File Serving
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath === '/poultry') reqPath = '/poultry.html';
  if (reqPath === '/admin') reqPath = '/admin.html';

  let filePath = path.join(__dirname, reqPath);
  let ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Local server is running at: http://localhost:${PORT}`);
  console.log(`- Mushroom Farm Storefront: http://localhost:${PORT}/`);
  console.log(`- Poultry Farm: http://localhost:${PORT}/poultry`);
  console.log(`- Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`- Server Date API: http://localhost:${PORT}/api/server-date`);
  console.log(`- Buyers API: http://localhost:${PORT}/api/buyers`);
});
