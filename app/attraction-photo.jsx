'use client';

import { useState } from 'react';

export default function AttractionPhoto({ src }) {
  const [failed, setFailed] = useState(false);

  if (src === 'https://tong.visitkorea.or.kr/cms/resource/25/2798125_image2_1.JPG') {
    return (
      <figure className="credited-photo">
        {!failed && <img src={src} alt="부산 영도 감지해변 선착장" loading="lazy" onError={() => setFailed(true)} />}
        <figcaption>
          <a href="https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=cefdd1c9-d346-443c-97ed-d9822a2b9eee">
            {failed ? '공식 페이지에서 감지해변 사진 보기' : '사진 · 한국관광공사'}
          </a>
        </figcaption>
      </figure>
    );
  }

  if (!src || failed) return <div className="photo-placeholder">사진을 표시할 수 없습니다</div>;
  return <img className="attraction-photo" src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}
