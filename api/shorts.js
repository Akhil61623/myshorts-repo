// api/shorts.js  (Vercel Serverless)
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'shorts.json');
    // sync read is fine for small files in serverless on cold start
    const raw = fs.readFileSync(dataPath, 'utf8');
    const SHORTS = JSON.parse(raw);

    // pagination same as earlier: ?limit=20&before=ISODate
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 200);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    // ensure sorted newest first
    SHORTS.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

    const items = [];
    for (let i = 0; i < SHORTS.length && items.length < limit; i++) {
      const s = SHORTS[i];
      if (new Date(s.createdAt) < before) items.push(s);
    }
    const nextCursor = items.length ? items[items.length - 1].createdAt : null;
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30'); // small cache on edge
    res.status(200).json({ items, nextCursor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
