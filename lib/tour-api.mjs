const endpoint = 'https://apis.data.go.kr/B551011/KorService2';

async function requestTourItems(key, operation, parameters) {
  const url = new URL(endpoint + '/' + operation);
  url.search = new URLSearchParams({
    serviceKey: decodeURIComponent(key),
    MobileOS: 'WEB',
    MobileApp: 'TourInKorea',
    _type: 'json',
    ...parameters,
  });

  const response = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('TourAPI request failed');

  const payload = (await response.json()).response;
  if (payload?.header?.resultCode !== '0000') throw new Error('TourAPI request rejected');
  return payload.body.items?.item ?? [];
}

function photoUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' && url.hostname === 'tong.visitkorea.or.kr') {
      url.protocol = 'https:';
    }
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function toAttraction(item) {
  return {
    id: item.contentid,
    title: item.title,
    address: [item.addr1, item.addr2].filter(Boolean).join(' '),
    image: photoUrl(item.firstimage) ?? photoUrl(item.firstimage2),
  };
}

export async function getBusanAttractions(apiKey) {
  const key = apiKey?.trim();
  if (!key) return { status: 'unconfigured' };

  try {
    const items = await requestTourItems(key, 'areaBasedList2', {
      pageNo: '1',
      numOfRows: '5',
      lDongRegnCd: '26',
      contentTypeId: '12',
      arrange: 'O',
    });
    return { status: 'ready', attractions: items.map(toAttraction) };
  } catch {
    return { status: 'unavailable' };
  }
}

export async function getAttractionDetails(apiKey, id) {
  const key = apiKey?.trim();
  if (!key) return { status: 'unconfigured' };

  try {
    const [item] = await requestTourItems(key, 'detailCommon2', { contentId: id });
    if (!item) return { status: 'missing' };
    return {
      status: 'ready',
      attraction: {
        ...toAttraction(item),
        overview: item.overview?.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim(),
        phone: item.tel?.replace(/<[^>]*>/g, '').trim(),
      },
    };
  } catch {
    return { status: 'unavailable' };
  }
}
