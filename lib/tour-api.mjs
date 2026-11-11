const endpoint = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';

export async function getBusanAttractions(apiKey) {
  const key = apiKey?.trim();
  if (!key) return { status: 'unconfigured' };

  try {
    const url = new URL(endpoint);
    url.search = new URLSearchParams({
      serviceKey: decodeURIComponent(key),
      MobileOS: 'WEB',
      MobileApp: 'TourInKorea',
      _type: 'json',
      pageNo: '1',
      numOfRows: '5',
      lDongRegnCd: '26',
      contentTypeId: '12',
    });

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { status: 'unavailable' };

    const payload = (await response.json()).response;
    if (payload?.header?.resultCode !== '0000') return { status: 'unavailable' };

    const items = payload.body.items?.item ?? [];
    const attractions = items.map((item) => ({
      id: item.contentid,
      title: item.title,
      address: item.addr1,
      image: item.firstimage?.startsWith('https://') ? item.firstimage : null,
    }));

    return { status: 'ready', attractions };
  } catch {
    return { status: 'unavailable' };
  }
}
