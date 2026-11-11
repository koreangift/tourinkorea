import Link from 'next/link';
import AttractionPhoto from './attraction-photo';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { attractionsPerPage, getRegionalAttractions } from '../lib/tour-api.mjs';
import { browseQuery, getBrowseSelection, regions } from '../lib/regions.mjs';

export default async function Home({ searchParams }) {
  await connection();
  const { region, regionName, page } = getBrowseSelection(await searchParams);
  const result = await getRegionalAttractions(process.env.TOUR_API_KEY, region, page);
  const pageCount = result.status === 'ready' ? Math.max(1, Math.ceil(result.total / attractionsPerPage)) : 1;
  if (result.status === 'ready' && page > pageCount) {
    redirect('/?' + browseQuery(region, pageCount));
  }

  return (
    <>
      <header>
        <div className="wrap">
          <h1 lang="en">Tour in Korea</h1>
          <p>Tour in Korea는 한국의 관광명소와 여행 정보를 소개합니다. 가보고 싶은 곳을 찾고 나만의 한국 여행을 계획해 보세요.</p>
          <p lang="en">Tour in Korea helps you discover attractions across South Korea and find travel information to plan your trip.</p>
        </div>
      </header>
      <main className="wrap">
        <form className="region-filter" action="/">
          <label htmlFor="region">지역</label>
          <select id="region" name="region" defaultValue={region}>
            {regions.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
          <button type="submit">보기</button>
        </form>
        <h2>{regionName} 관광지</h2>
        {result.status === 'ready' && <p className="result-count">총 {result.total.toLocaleString('ko-KR')}곳</p>}
        {result.status === 'unconfigured' && <p>관광지 목록은 API 연결 후 표시됩니다.</p>}
        {result.status === 'unavailable' && <p>관광지 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
        {result.status === 'ready' && (
          result.attractions.length ? (
            <div id="spots">
              {result.attractions.map((attraction) => (
                <article key={attraction.id}>
                  <AttractionPhoto src={attraction.image} gallery={attraction.gallery} photoPage={attraction.photoPage} />
                  <div>
                    <h3>{attraction.title}</h3>
                    {attraction.address && <p>{attraction.address}</p>}
                    <Link className="detail-link" href={`/spots/${attraction.id}?${browseQuery(region, page)}`} prefetch={false} aria-label={`${attraction.title} 상세 정보`}>
                      상세 정보
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : <p>표시할 관광지가 아직 없습니다.</p>
        )}
        {result.status === 'ready' && pageCount > 1 && (
          <nav className="pagination" aria-label="관광지 목록 페이지">
            {page > 1 && <Link href={'/?' + browseQuery(region, page - 1)} prefetch={false}>이전</Link>}
            <span>{page} / {pageCount} 페이지</span>
            {page < pageCount && <Link href={'/?' + browseQuery(region, page + 1)} prefetch={false}>다음</Link>}
          </nav>
        )}
      </main>
      <footer>
        <div className="wrap">
          관광정보 출처 <a href="https://www.data.go.kr/data/15101578/openapi.do">한국관광공사 TourAPI</a>
        </div>
      </footer>
    </>
  );
}
