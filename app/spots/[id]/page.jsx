import Link from 'next/link';
import { notFound } from 'next/navigation';
import AttractionPhoto from '../../attraction-photo';
import { getAttractionDetails } from '../../../lib/tour-api.mjs';

import { browseQuery, getBrowseSelection } from '../../../lib/regions.mjs';

export default async function AttractionPage({ params, searchParams }) {
  const { id } = await params;
  const { region, page } = getBrowseSelection(await searchParams);
  if (!/^\d{1,12}$/.test(id)) notFound();

  const result = await getAttractionDetails(process.env.TOUR_API_KEY, id);
  if (result.status === 'missing') notFound();

  return (
    <main className="wrap attraction-detail">
      <Link className="back-link" href={'/?' + browseQuery(region, page)}>← 관광지 목록</Link>
      {result.status === 'ready' ? (
        <article>
          <AttractionPhoto src={result.attraction.image} gallery={result.attraction.gallery} photoPage={result.attraction.photoPage} />
          <div>
            <h1>{result.attraction.title}</h1>
            {result.attraction.address && <p>주소 · {result.attraction.address}</p>}
            {result.attraction.phone && <p>문의 · {result.attraction.phone}</p>}
            <h2>관광지 소개</h2>
            <p className="overview">{result.attraction.overview || '등록된 소개가 없습니다.'}</p>
            <p className="detail-source">관광정보 출처 · 한국관광공사 TourAPI</p>
          </div>
        </article>
      ) : (
        <p role="status">상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      )}
    </main>
  );
}
