import { connection } from 'next/server';
import { getBusanAttractions } from '../lib/tour-api.mjs';

export default async function Home() {
  await connection();
  const result = await getBusanAttractions(process.env.TOUR_API_KEY);

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
        <h2>부산 관광지 <span lang="en">· Busan</span></h2>
        {result.status === 'unconfigured' && <p>관광지 목록은 API 연결 후 표시됩니다.</p>}
        {result.status === 'unavailable' && <p>관광지 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
        {result.status === 'ready' && (
          result.attractions.length ? (
            <div id="spots">
              {result.attractions.map((attraction) => (
                <article key={attraction.id}>
                  {attraction.image && <img src={attraction.image} alt="" loading="lazy" />}
                  <div>
                    <h3>{attraction.title}</h3>
                    {attraction.address && <p>{attraction.address}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : <p>표시할 관광지가 아직 없습니다.</p>
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
