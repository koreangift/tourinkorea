import './globals.css';

export const metadata = {
  title: 'Tour in Korea',
  description: '한국의 관광명소를 찾아보세요. Discover attractions across South Korea.',
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
