import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Camera, Video, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { SiteSettings } from "@/lib/supabase/settings";
import { defaultFooterMenus, type NavMenu } from "@/lib/supabase/menus";

const programLinks = [
  { label: "언어발달 평가", href: "/programs#evaluation" },
  { label: "언어치료", href: "/programs#therapy" },
  { label: "인지·학습치료", href: "/programs#cognitive" },
  { label: "부모 상담", href: "/programs#parent" },
];

export function Footer({ settings, menus }: { settings?: SiteSettings; menus?: NavMenu[] }) {
  const currentYear = new Date().getFullYear();

  const siteName = settings?.site_name || "말자람터 언어심리연구소";
  const phoneNum = settings?.phone || "02-1234-5678";
  const addressStr = settings?.address || "서울특별시 중구 세종대로 110 말자람터 빌딩 2층";
  const emailStr = settings?.email || "info@maljarumter.com";
  const hoursStr = settings?.business_hours || "평일 10:00 - 19:00 | 토요일 09:00 - 15:00";
  const mapEmbed = settings?.map_embed;

  const activeQuickLinks = menus && menus.length > 0 ? menus : defaultFooterMenus;

  return (
    <footer
      className="mt-auto border-t border-border text-white"
      style={{ background: "var(--color-brand-teal)" }}
      aria-label="사이트 하단 정보"
    >
      <div className="container-wide section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ── 기관 정보 ── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shadow-md shrink-0"
                style={{ background: "var(--color-brand-green)" }}
                aria-hidden="true"
              >
                말
              </div>
              <div>
                <p className="font-bold text-white text-base">{siteName}</p>
                <p className="text-xs" style={{ color: "var(--color-brand-green-light)" }}>
                  아이의 언어, 마음과 함께 자랍니다
                </p>
              </div>
            </div>

            <address className="not-italic space-y-2.5 mt-6 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <div>
                  <p className="text-white/90 font-semibold">오시는 길</p>
                  <p style={{ color: "var(--color-brand-green-light)" }}>{addressStr}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <div>
                  <span className="text-white/90 font-semibold mr-2">대표 전화</span>
                  <a href={`tel:${phoneNum}`} className="hover:underline transition-colors font-bold" style={{ color: "var(--color-brand-green-light)" }}>
                    {phoneNum}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <div>
                  <span className="text-white/90 font-semibold mr-2">이메일</span>
                  <a href={`mailto:${emailStr}`} className="hover:underline transition-colors font-mono text-xs" style={{ color: "var(--color-brand-green-light)" }}>
                    {emailStr}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-[var(--color-brand-orange)]" aria-hidden="true" />
                <div>
                  <p className="text-white/90 font-semibold">운영시간</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-brand-green-light)" }}>
                    {hoursStr}
                  </p>
                </div>
              </div>
            </address>

            {/* SNS 바로가기 링크 버튼들 */}
            <div className="flex items-center gap-3 mt-6 pt-2">
              {settings?.kakao_url && (
                <a href={settings.kakao_url} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-brand-green)] transition-colors" title="카카오톡 상담">
                  <MessageCircle className="h-4 w-4 text-amber-300" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-brand-green)] transition-colors" title="인스타그램">
                  <Camera className="h-4 w-4 text-pink-300" />
                </a>
              )}
              {settings?.blog_url && (
                <a href={settings.blog_url} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-brand-green)] transition-colors" title="네이버 블로그">
                  <BookOpen className="h-4 w-4 text-emerald-300" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-brand-green)] transition-colors" title="유튜브 채널">
                  <Video className="h-4 w-4 text-red-400" />
                </a>
              )}
            </div>
          </div>

          {/* ── 바로가기 링크 (CMS 연동) ── */}
          <div>
            <h3 className="text-sm font-bold mb-4 tracking-wider uppercase text-[var(--color-brand-orange)]">
              바로가기
            </h3>
            <ul className="space-y-2.5 text-sm">
              {activeQuickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} className="transition-colors hover:text-white" style={{ color: "var(--color-brand-green-light)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 프로그램 링크 ── */}
          <div>
            <h3 className="text-sm font-bold mb-4 tracking-wider uppercase text-[var(--color-brand-orange)]">
              프로그램 안내
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white" style={{ color: "var(--color-brand-green-light)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 지도 임베드 연동 ── */}
        <div className="mt-10 rounded-3xl overflow-hidden border border-white/15 bg-black/20 shadow-inner">
          {mapEmbed && mapEmbed.includes("iframe") ? (
            <div dangerouslySetInnerHTML={{ __html: mapEmbed }} className="w-full h-[320px] [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" />
          ) : (
            <div className="h-40 flex items-center justify-center text-center p-6">
              <div>
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50 text-[var(--color-brand-orange)]" />
                <p className="text-sm opacity-60 text-white">🗺 구글/카카오 지도 임베드가 아직 설정되지 않았습니다.</p>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-8 opacity-15" />

        {/* ── 저작권 ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: "var(--color-brand-green-light)" }}>
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <div className="flex gap-5 font-semibold">
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
