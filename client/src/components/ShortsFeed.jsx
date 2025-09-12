import React, { useEffect, useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import LazyYouTube from './LazyYouTube';

/*
  This component fetches pages from server and uses react-window
  to render only visible items (so you can have huge lists).
*/

export default function ShortsFeed() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const loadingRef = useRef(false);

  useEffect(()=> {
    fetchMore();
    // eslint-disable-next-line
  }, []);

  async function fetchMore() {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const q = nextCursor ? `?limit=40&before=${encodeURIComponent(nextCursor)}` : '?limit=40';
    try {
      const res = await fetch(`http://localhost:3001/api/shorts${q}`);
      const data = await res.json();
      setItems(prev => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
    }
  }

  const Row = ({ index, style }) => {
    const it = items[index];
    if (!it) return <div style={style}>Loading...</div>;
    return (
      <div style={{ ...style, padding: 8 }}>
        <LazyYouTube videoId={it.embedId} thumbUrl={it.thumbUrl} title={it.title} />
      </div>
    );
  };

  return (
    <div>
      <List
        height={800}
        itemCount={items.length + 1}
        itemSize={480}
        width={'100%'}
        onItemsRendered={({ visibleStopIndex }) => {
          // prefetch next when near end
          if (visibleStopIndex > items.length - 12 && nextCursor) fetchMore();
        }}
      >
        {Row}
      </List>
      <div style={{ textAlign:'center', padding:8 }}>
        <button onClick={fetchMore} disabled={loadingRef.current}>Load more</button>
      </div>
    </div>
  );
}
// पहले था: fetch('http://localhost:3001/api/shorts' + q)
// बदलो ये कर दो:
const res = await fetch(`/api/shorts${q}`);
