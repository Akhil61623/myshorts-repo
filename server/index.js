// server/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'data', 'shorts.json');

const app = express();
app.use(cors());
app.use(express.json());

// load data (synchronously on startup for simplicity)
let SHORTS = [];
try {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  SHORTS = JSON.parse(raw);
  // ensure sorted newest first by createdAt
  SHORTS.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  console.log('Loaded', SHORTS.length, 'shorts');
} catch (err) {
  console.warn('No shorts.json found — run `npm run seed:10k` or seed:100k to generate sample data.');
  SHORTS = [];
}

// GET /api/shorts?limit=20&before=2025-09-01T00:00:00Z
app.get('/api/shorts', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
  const before = req.query.before ? new Date(req.query.before) : new Date();
  // cursor by createdAt
  const items = [];
  for (let i = 0; i < SHORTS.length && items.length < limit; i++) {
    const s = SHORTS[i];
    if (new Date(s.createdAt) < before) {
      items.push(s);
    }
  }
  // if before is not provided, return first `limit` newest
  // Send createdAt of last item as nextCursor
  const nextCursor = items.length ? items[items.length - 1].createdAt : null;
  res.json({ items, nextCursor });
});

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`));
