/* Petit serveur statique pour previsualiser le site en local : node server.js
   Expose aussi POST /__save?name=<cle> qui enregistre un JSON dans data/. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8123;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const DATA = path.join(__dirname, 'data');

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // CORS : autorise la collecte depuis un autre onglet
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (url.pathname === '/__save' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const name = (url.searchParams.get('name') || 'sans-nom').replace(/[^a-z0-9_-]/gi, '');
      fs.mkdirSync(DATA, { recursive: true });
      fs.writeFileSync(path.join(DATA, name + '.json'), body, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok ' + body.length);
    });
    return;
  }

  const rel = decodeURIComponent(url.pathname);
  const file = path.join(__dirname, rel === '/' ? 'index.html' : rel);
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => console.log('http://localhost:' + PORT));
