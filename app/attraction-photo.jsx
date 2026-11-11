'use client';

import { useState } from 'react';

export default function AttractionPhoto({ src }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <div className="photo-placeholder">사진을 표시할 수 없습니다</div>;
  return <img className="attraction-photo" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}
