// server/seed.js
// Usage: node seed.js 10000
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const count = parseInt(process.argv[2] || '10000', 10);
const outFile = path.join(outDir, 'shorts.json');

function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }

// Some sample YouTube-like video ids (we'll fabricate fairly-looking ids)
function makeVidId(i){
  return 'vid' + i + '_' + Math.random().toString(36).slice(2,9);
}

const now = Date.now();
const items = [];
for (let i = 0; i < count; i++){
  const createdAt = new Date(now - i * 1000 * 60).toISOString(); // spaced by 1 minute
  const id = makeVidId(i);
  const embedId = ['PhVQWwjZn54','WXeFtVV78dg','JvDf7htxvrA','DqdSp0Au6x0'][i % 4]; // reuse few real ids
  items.push({
    videoId: id,
    source: 'youtube',
    embedId,
    title: `Demo Short #${i+1}`,
    thumbUrl: `https://i.ytimg.com/vi/${embedId}/hqdefault.jpg`,
    durationSec: randInt(8,60),
    createdAt
  });
}

fs.writeFileSync(outFile, JSON.stringify(items, null, 2));
console.log(`Wrote ${items.length} items to ${outFile}`);
