# Tour in Korea

한국의 관광명소와 여행 정보를 소개하는 Next.js 웹사이트입니다.

## Vercel 배포

1. Vercel에서 이 GitHub 저장소를 가져옵니다.
2. 프로젝트의 환경변수 이름을 `TOUR_API_KEY`로 정하고, 값에 공공데이터포털의 일반 인증키를 입력합니다.
3. Deploy를 눌러 공개합니다. 이미 배포한 뒤 키를 추가했다면 다시 배포합니다.

## 로컬 실행

`pnpm install` 후 `pnpm dev`로 실행합니다. 실제 목록을 보려면 `.env.local`에 `TOUR_API_KEY`를 등록합니다.
