export const regions = [
  ['11', '서울'], ['26', '부산'], ['27', '대구'], ['28', '인천'],
  ['29', '광주'], ['30', '대전'], ['31', '울산'], ['36', '세종'],
  ['41', '경기'], ['43', '충북'], ['44', '충남'], ['46', '전남'],
  ['47', '경북'], ['48', '경남'], ['50', '제주'], ['51', '강원'], ['52', '전북'],
];

export function getBrowseSelection(query) {
  const [region, regionName] = regions.find(([code]) => code === query.region) ?? regions[1];
  const page = typeof query.page === 'string' && /^[1-9]\d{0,5}$/.test(query.page)
    ? Number(query.page)
    : 1;
  return { region, regionName, page };
}

export function browseQuery(region, page) {
  return new URLSearchParams({ region, page: String(page) }).toString();
}
