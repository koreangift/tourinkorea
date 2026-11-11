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
  return payload.body;
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
    image: String(item.contentid) === '2785289'
      ? 'https://tong.visitkorea.or.kr/cms/resource/25/2798125_image2_1.JPG'
      : photoUrl(item.firstimage) ?? photoUrl(item.firstimage2),
  };
}

async function withAttractionPhoto(key, attraction) {
  if (String(attraction.id) !== '2726843') return attraction;

  const photoPage = 'https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=05fde611-81d0-4f3a-88d8-40b2ae64d5a7';
  try {
    const body = await requestTourItems(key, 'detailImage2', {
      contentId: String(attraction.id),
      imageYN: 'Y',
    });
    const gallery = (body.items?.item ?? [])
      .map((item) => photoUrl(item.originimgurl) ?? photoUrl(item.smallimageurl))
      .filter(Boolean);
    return { ...attraction, gallery, photoPage };
  } catch {
    return { ...attraction, photoPage };
  }
}

export const attractionsPerPage = 8;

export async function getRegionalAttractions(apiKey, region, page) {
  const key = apiKey?.trim();
  if (!key) return { status: 'unconfigured' };

  try {
    const body = await requestTourItems(key, 'areaBasedList2', {
      pageNo: String(page),
      numOfRows: String(attractionsPerPage),
      lDongRegnCd: region,
      contentTypeId: '12',
      arrange: 'A',
    });
    return {
      status: 'ready',
      attractions: await Promise.all((body.items?.item ?? []).map((item) => withAttractionPhoto(key, toAttraction(item)))),
      total: Number(body.totalCount),
    };
  } catch {
    return { status: 'unavailable' };
  }
}

export async function getAttractionDetails(apiKey, id) {
  const key = apiKey?.trim();
  if (!key) return { status: 'unconfigured' };

  try {
    const body = await requestTourItems(key, 'detailCommon2', { contentId: id });
    const [item] = body.items?.item ?? [];
    if (!item) return { status: 'missing' };
    return {
      status: 'ready',
      attraction: {
        ...await withAttractionPhoto(key, toAttraction(item)),
        overview: item.overview?.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim(),
        phone: item.tel?.replace(/<[^>]*>/g, '').trim(),
      },
    };
  } catch {
    return { status: 'unavailable' };
  }
}
