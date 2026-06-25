import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { MessageSquare, Phone, MapPin, Clock } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/settings";

export const metadata: Metadata = {
  title: "문의 및 상담 접수",
  description:
    "말자람터 언어심리연구소에 온라인으로 상담 및 치료 문의를 남겨주세요. 공인 언어재활사가 직접 확인 후 친절하게 안내해 드립니다.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* ══════════════════════════════════════════
          페이지 헤더 히어로
      ══════════════════════════════════════════ */}
      <section
        aria-label="문의하기 헤더"
        className="py-16 md:py-24 section-padding"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand-cream) 0%, var(--color-brand-beige) 100%)",
        }}
      >
        <div className="container-narrow text-center">
          <div
            className="inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-5 mx-auto shadow-xs"
            style={{ background: "var(--color-brand-green-light)" }}
          >
            <MessageSquare
              className="h-7 w-7"
              style={{ color: "var(--color-brand-green)" }}
            />
          </div>
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--color-brand-green)" }}
          >
            Contact Us
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-brand-teal)" }}
          >
            온라인 간편 문의
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            아이의 발달에 관해 사소한 걱정이라도 괜찮습니다.
            내용을 남겨주시면 대표 치료사가 직접 꼼꼼히 읽고 답변해 드립니다.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          메인 본문: 좌측 연락처 정보 & 우측 문의 폼
      ══════════════════════════════════════════ */}
      <section className="py-20 section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* 좌측 안내 센터 정보 */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div>
                <h2
                  className="text-2xl font-bold mb-3"
                  style={{ color: "var(--color-brand-teal)" }}
                >
                  언제든 편하게 연락주세요
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  온라인 문의가 편하지 않으시다면 전화나 방문 상담도 언제나 환영합니다. 치료기기나 평가 일정이 겹칠 수 있으니 방문 전 사전 연락 부탁드립니다.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
                  <div
                    className="p-3 rounded-xl shrink-0"
                    style={{ background: "var(--color-brand-green-light)" }}
                  >
                    <Phone className="h-5 w-5" style={{ color: "var(--color-brand-green)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">전화 문의</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-lg font-bold hover:underline mt-0.5 block"
                      style={{ color: "var(--color-brand-teal)" }}
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
                  <div
                    className="p-3 rounded-xl shrink-0"
                    style={{ background: "var(--color-brand-orange-light)" }}
                  >
                    <Clock className="h-5 w-5" style={{ color: "var(--color-brand-orange-dark)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">운영 시간 안내</p>
                    <p className="text-sm font-semibold text-foreground mt-1 leading-relaxed">
                      {settings.business_hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-xs">
                  <div
                    className="p-3 rounded-xl shrink-0"
                    style={{ background: "var(--color-brand-cream)" }}
                  >
                    <MapPin className="h-5 w-5" style={{ color: "var(--color-brand-teal)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">센터 위치</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{settings.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">방문 전 상담 가능 슬롯을 확인하세요.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 온라인 입력 폼 */}
            <div className="lg:col-span-7 bg-card rounded-3xl p-8 md:p-10 border border-border shadow-md">
              <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: "var(--color-brand-teal)" }}>
                상담 문의 접수 양식
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
