import type { Metadata } from "next";
import { ReservationClient } from "./ReservationClient";
import { CalendarCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "상담 및 평가 온라인 예약",
  description:
    "말자람터 언어심리연구소의 전문가 초기 상담 및 진단 평가 일정을 온라인으로 간편하고 안전하게 예약하세요. 실시간 예약 슬롯 중복 방지 시스템이 적용되어 있습니다.",
};

export default function ReservationPage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          페이지 히어로 헤더
      ══════════════════════════════════════════ */}
      <section
        aria-label="예약 안내 헤더"
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
            <CalendarCheck2
              className="h-7 w-7"
              style={{ color: "var(--color-brand-green)" }}
            />
          </div>
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--color-brand-green)" }}
          >
            Reservation
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--color-brand-teal)" }}
          >
            실시간 상담 예약
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            원하시는 방문 날짜를 선택하시면 상담 가능한 시간대가 표시됩니다.
            선착순 실시간 마감 시스템으로 동일 슬롯 중복 예약이 완벽히 차단됩니다.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          예약 클라이언트 메인 본문
      ══════════════════════════════════════════ */}
      <section className="py-16 section-padding">
        <div className="container-wide">
          <ReservationClient />
        </div>
      </section>
    </>
  );
}
