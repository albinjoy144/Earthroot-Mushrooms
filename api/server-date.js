module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const now = new Date();
  let serverDate;
  try {
    serverDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
  } catch (e) {
    serverDate = now.toISOString().split('T')[0];
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({
    serverDate: serverDate,
    serverTime: now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
    iso: now.toISOString(),
    timestamp: now.getTime()
  }));
};
