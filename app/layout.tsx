import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/calculatorsMeta";
import { ADSENSE_CLIENT, adsEnabled } from "@/lib/ads";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 주휴수당·4대보험·실수령액 계산`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "2026년 기준 주휴수당, 4대보험 실수령액, 연봉·월급 환산, 퇴직금, 연말정산을 무료로 계산하세요. 회원가입 없이 바로 사용.",
  keywords: [
    "주휴수당 계산기",
    "4대보험 계산기",
    "실수령액 계산기",
    "연봉 계산기",
    "퇴직금 계산기",
    "연말정산 계산기",
    "2026 최저시급",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 주휴수당·4대보험·실수령액 계산`,
    description: "2026년 기준 급여 계산기 모음. 회원가입 없이 무료.",
  },
  robots: { index: true, follow: true },
  verification: {
    other: {
      "naver-site-verification": "b6286881aa075ec184de090b5854283c42d45057",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        {adsEnabled && (
          <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
