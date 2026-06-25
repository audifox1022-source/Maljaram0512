import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  {
    title: "바로가기",
    links: [
      { label: "소개", href: "/about" },
      { label: "프로그램", href: "/programs" },
      { label: "상담 예약", href: "/reservation" },
      { label: "문의하기", href: "/contact" },
      { label: "자주 묻는 질문", href: "/faq" },
    ],
  },
  {
    title: "프로그램",
    links: [
      { label: "언어발달 평가", href: "/programs#evaluation" },
      { label: "언어치료", href: "/programs#therapy" },
      { label: "인지·학습치료", href: "/programs#cognitive" },
      { label: "부모 상담", href: "/programs#parent" },
    ],
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-border"
      style={{ background: "var(--color-brand-teal)" }}
      aria-label="사이트 하단 정보"
    >
      <div className="container-wide section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── 기관 정보 ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold"
                style={{ background: "var(--color-brand-green)" }}
                aria-hidden="true"
              >
                말
              </div>
              <div>
                <p className="font-bold text-white">말자람터 언어심리연구소</p>
                <p className="text-xs" style={{ color: "var(--color-brand-green-light)" }}>
                  아이의 언어, 마음과 함께 자랍니다
                </p>
              </div>
            </div>

            <address className="not-italic space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <MapPin
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: "var(--color-brand-orange)" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm text-white/90">주소</p>
                  {/* TODO: 실제 주소로 교체 */}
                  <p className="text-sm" style={{ color: "var(--color-brand-green-light)" }}>
                    [주소를 입력해 주세요]
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--color-brand-orange)" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm text-white/90">전화</p>
                  {/* TODO: 실제 전화번호로 교체 */}
                  <a
                    href="tel:0000000000"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: "var(--color-brand-green-light)" }}
                  >
                    000-0000-0000
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0"
                  style={{ color: "var(--color-brand-orange)" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm text-white/90">이메일</p>
                  {/* TODO: 실제 이메일로 교체 */}
                  <a
                    href="mailto:info@example.com"
                    className="text-sm hover:underline transition-colors"
                    style={{ color: "var(--color-brand-green-light)" }}
                  >
                    info@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: "var(--color-brand-orange)" }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm text-white/90">운영시간</p>
                  {/* TODO: 실제 운영시간으로 교체 */}
                  <p className="text-sm" style={{ color: "var(--color-brand-green-light)" }}>
                    월–금 09:00 – 18:00
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-brand-green-light)" }}>
                    토 09:00 – 13:00 (일·공휴일 휴무)
                  </p>
                </div>
              </div>
            </address>
          </div>

          {/* ── 링크 섹션 ── */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--color-brand-orange)" }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "var(--color-brand-green-light)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── 지도 자리 placeholder ── */}
        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
          <div
            className="h-40 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)" }}
            role="img"
            aria-label="지도 위치 (추후 카카오맵 또는 네이버맵 연동 예정)"
          >
            <div className="text-center">
              <MapPin
                className="h-8 w-8 mx-auto mb-2 opacity-50"
                style={{ color: "var(--color-brand-orange)" }}
                aria-hidden="true"
              />
              <p className="text-sm opacity-50 text-white">
                🗺 지도 자리 — 카카오맵 또는 네이버맵 연동 예정
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-10" />

        {/* ── 저작권 ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-brand-green-light)" }}>
          <p>© {currentYear} 말자람터 언어심리연구소. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
