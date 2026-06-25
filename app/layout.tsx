import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

/* ── 한국어 폰트 ── */
const notoSansKR = Noto_Sans_KR({
  variable: "--font-nanum",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

/* ── 사이트 기본 SEO 메타데이터 ── */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maljarumter.com";
const siteName = "말자람터 언어심리연구소";
const siteDescription =
  "아이의 언어 발달과 심리적 성장을 함께 지원하는 전문 언어심리치료 기관입니다. 언어발달 평가, 언어치료, 인지·학습치료, 부모 상담을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "언어치료",
    "언어발달",
    "심리치료",
    "언어심리",
    "아동언어치료",
    "언어발달평가",
    "말자람터",
    "언어심리연구소",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png", // 추후 실제 OG 이미지로 교체
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5C8B6E", // 세이지 그린
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": siteName,
  "image": `${siteUrl}/og-image.png`,
  "@id": siteUrl,
  "url": siteUrl,
  "telephone": "02-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "도보 3분 거리 빌딩 2층",
    "addressLocality": "서울시",
    "addressRegion": "서울특별시",
    "postalCode": "01234",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.5665,
    "longitude": 126.9780
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "09:00",
      "closes": "15:00"
    }
  ],
  "sameAs": [
    "https://instagram.com",
    "https://blog.naver.com"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        {/* 접근성: 본문 바로가기 링크 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium"
        >
          본문 바로가기
        </a>

        <Header />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
