import React, { useRef } from 'react';

export default function LazyYouTube({ videoId, thumbUrl, title }) {
  const ref = useRef();

  const handleClick = () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.width = '100%';
    iframe.height = '420';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.style.border = '0';
    if (ref.current) {
      ref.current.innerHTML = '';
      ref.current.appendChild(iframe);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div ref={ref} className="thumb" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={thumbUrl} alt={title} loading="lazy" />
        <div style={{ position: 'relative', top: '-52px', textAlign: 'center', pointerEvents: 'none' }}>
          <span style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 10px', borderRadius: 999 }}>▶ Play</span>
        </div>
      </div>
      <div className="title">{title}</div>
    </div>
  );
}
