import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { getPublishedPrograms } from "@/lib/supabase/programs";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "프로그램 안내",
  description:
    "말자람터 언어심리연구소에서 제공하는 언어발달 평가, 조음·발음 치료, 인지 학습 치료, 부모 상담 프로그램을 소개합니다.",
};

// ISR (Incremental Static Regeneration) 설정: 1시간(3600초)마다 주기적 백그라운드 재검증
export const revalidate = 3600;

export default async function ProgramsPage() {
  const { programs, isFallback } = await getPublishedPrograms();

  return (
    <>
      {/* ══════════════════════════════════════════
          페이지 히어로
      ══════════════════════════════════════════ */}
      <section
        aria-label="프로그램 안내 헤더"
        className="py-16 md:py-24 section-padding relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand-cream) 0%, var(--color-brand-beige) 100%)",
        }}
      >
        <div className="container-narrow text-center relative z-10">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold mb-5"
            style={{
              background: "var(--color-brand-green-light)",
              color: "var(--color-brand-teal)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>맞춤형 전문 커리큘럼</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ color: "var(--color-brand-teal)" }}
          >
            치료 프로그램 안내
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            표준화된 진단 평가부터 개별화된 맞춤 치료까지,
            아이의 언어적 발달과 정서적 성장을 체계적으로 지원합니다.
          </p>
        </div>
      </section>

      {/* DB 연동 전 Fallback 안내 배너 */}
      {isFallback && (
        <div className="bg-amber-50 border-y border-amber-200 py-3 section-padding text-center">
          <p className="text-xs md:text-sm text-amber-800 font-medium">
            💡 <span className="underline">안내:</span> 현재 Supabase DB가 연결되어 있지 않아 <strong>샘플 프로그램 데이터</strong>를 렌더링 중입니다. (.env.local 설정 시 실제 DB 데이터로 자동 전환됩니다)
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════
          프로그램 카드 목록
      ══════════════════════════════════════════ */}
      <section aria-label="프로그램 카드 목록" className="py-20 section-padding">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog) => (
              <article
                key={prog.id}
                className="group flex flex-col bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* 이미지 영역 */}
                <Link href={`/programs/${prog.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                  {prog.image_url ? (
                    <Image
                      src={prog.image_url}
                      alt={`${prog.title} 프로그램 대표 이미지`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className="text-xs font-semibold px-3 py-1 shadow-sm text-white"
                      style={{ background: "var(--color-brand-teal)" }}
                    >
                      상시 운영
                    </Badge>
                  </div>
                </Link>

                {/* 본문 설명 영역 */}
                <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/programs/${prog.slug}`} className="hover:underline">
                      <h2
                        className="text-2xl font-bold mb-3"
                        style={{ color: "var(--color-brand-teal)" }}
                      >
                        {prog.title}
                      </h2>
                    </Link>

                    {/* 대상 요약 박스 */}
                    <div
                      className="rounded-xl p-3.5 mb-4 text-xs md:text-sm font-medium flex items-start gap-2"
                      style={{ background: "var(--color-brand-cream)" }}
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: "var(--color-brand-green)" }}
                      />
                      <div>
                        <span className="font-bold text-foreground">추천 대상: </span>
                        <span className="text-muted-foreground">{prog.target}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {prog.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      진행: 개별 및 소그룹
                    </span>
                    <Link
                      href={`/programs/${prog.slug}`}
                      className="inline-flex items-center text-sm font-bold group-hover:underline"
                      style={{ color: "var(--color-brand-green)" }}
                    >
                      상세 커리큘럼 보기
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          하단 상담 예약 CTA
      ══════════════════════════════════════════ */}
      <section
        aria-label="상담 예약 안내"
        className="py-16 section-padding"
        style={{ background: "var(--color-brand-beige)" }}
      >
        <div className="container-narrow text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: "var(--color-brand-teal)" }}
          >
            어떤 프로그램이 맞을지 고민되시나요?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            초기 상담을 통해 아이의 현재 발달 상태를 확인하고, 가장 적합한 치료 방향을 전문가와 함께 설정하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/reservation"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
            >
              온라인 상담 예약하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 border-2"
              )}
            >
              간편 문의 남기기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
