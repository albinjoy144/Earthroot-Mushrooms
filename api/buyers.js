// In-memory / fallback handler for Vercel serverless environment
let inMemoryBuyers = null;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.statusCode = 200;
    return res.end(JSON.stringify(inMemoryBuyers || []));
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed)) {
          inMemoryBuyers = parsed;
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, count: Array.isArray(parsed) ? parsed.length : 1 }));
      } catch (err) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end('Method Not Allowed');
};
