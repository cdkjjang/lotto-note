import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 로또 당첨번호 조회·번호별 통계·번호 생성기`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  // 구글 서치콘솔은 도메인 속성(DNS)으로 확인. 네이버 서치어드바이저 코드는
  // 이 도메인으로 사이트 등록 후 발급받아 아래 verification.other에 추가한다.
  verification: {
    other: {
      "naver-site-verification": [
        "9e7807aba29a6562dcb92fc5eddfbb08dc3ab218",
        "21b911bbd060dac887ebb92aada8b70c1e7db7a3",
        "96f50dbf560e8919dc444caf4fce693231823592",
        "989e70c6bc6abfbf9666bb033354d5b0a82e03b2",
        "d23de4095b2c5474a8f451d2d36310f6507e408c",
        "1c3a80151a01ea020e77a0fc52790d90712d9f54",
        "97a551bc4d5b515bf96ae4f89c180149e0b1037a",
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* 애드센스 로더 — 크롤러가 원본 HTML의 <head>에서 script 태그를 찾으므로
          next/script(preload만 출력) 대신 원시 script 태그를 head에 직접 넣는다. */}
      <head>
        {ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
